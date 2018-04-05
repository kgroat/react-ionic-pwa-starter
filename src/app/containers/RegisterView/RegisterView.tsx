
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router-dom'

import IonInput from 'components/Ionic/Input'
import View from 'components/View'
import ValidationDisplay from 'components/ValidationDisplay'

import {
  verifyPassword,
  verifyUsername,
  verifyUsernameDoesntExists,
  verifyEmail,
  verifyEmailNotTaken,
} from 'app/validation/user'
import { ValidationResult, mergeResults } from 'shared/validation'

import registerUserThunk from 'thunks/registerUser'
import { AppState } from 'state'
import { HttpError } from 'shared/statusCodes'
import { sleep, REDIRECT_WAIT } from 'shared/helpers'

interface OwnProps extends RouteComponentProps<void> {
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  email: string
  emailErrors: ValidationResult | null
  emailSetTime: number
  username: string
  usernameErrors: ValidationResult | null
  usernameSetTime: number
  password: string
  passwordErrors: ValidationResult | null
  verifyPassword: string
  networkError: string | null
  redirect: boolean
  success: boolean
}

const DEBOUNCE_MS = 500

class LoginViewBase extends React.Component<Props, State> {
  state: State = {
    email: '',
    emailErrors: null,
    emailSetTime: 0,
    username: '',
    usernameErrors: null,
    usernameSetTime: 0,
    password: '',
    passwordErrors: null,
    verifyPassword: '',
    networkError: null,
    redirect: this.props.token !== null,
    success: false,
  }

  render () {
    if (this.state.redirect) {
      const { from } = this.props.location.state || { from: { pathname: '/' } }
      return <Redirect to={from} />
    }

    const {
      email,
      emailErrors,
      username,
      usernameErrors,
      password,
      passwordErrors,
      verifyPassword,
    } = this.state

    const passwordsMatch = this.passwordsMatch()

    return (
      <View>
        <ion-header>
          <ion-toolbar color='primary'>
            <ion-title>Register</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list>
            {this.renderStatus()}
            <ion-item>
              <ion-label stacked color={!emailErrors || emailErrors.passes ? 'primary' : 'danger'}>Email</ion-label>
              <IonInput placeholder='Email' debounce={DEBOUNCE_MS} value={email} onIonInput={this.onEmailChange} />
              {this.renderEmailErrors()}
            </ion-item>
            <ion-item>
              <ion-label stacked color={!usernameErrors || usernameErrors.passes ? 'primary' : 'danger'}>Username</ion-label>
              <IonInput placeholder='Username' debounce={DEBOUNCE_MS} value={username} onIonInput={this.onUsernameChange} />
              {this.renderUsernameErrors()}
            </ion-item>
            <ion-item>
              <ion-label stacked color={!passwordErrors || passwordErrors.passes ? 'primary' : 'danger'}>Password</ion-label>
              <IonInput type='password' debounce={DEBOUNCE_MS} placeholder='Password' value={password} onIonInput={this.onPasswordChange} />
              {this.renderPasswordErrors()}
            </ion-item>
            <ion-item>
              <ion-label stacked color={passwordsMatch ? 'primary' : 'danger'}>Verify Password</ion-label>
              <IonInput type='password' debounce={DEBOUNCE_MS} placeholder='Verify Password' value={verifyPassword} onIonInput={this.onVerifyPasswordChange} />
              {
                !passwordsMatch
                ? <ValidationDisplay
                    level='error'
                    message='Passwords do not match'
                  />
                : null
              }
            </ion-item>
            <ion-item>
              <ion-button color='light' onClick={this.cancel}>Cancel</ion-button>
              <ion-button color='primary' disabled={this.hasErrors()} onClick={this.submit}>
                Register
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-content>
      </View>
    )
  }

  private succeed = async () => {
    this.setState({ success: true })

    await sleep(REDIRECT_WAIT)
    this.setState({ redirect: true })
  }

  private renderStatus = () => {
    const { networkError, success } = this.state

    if (success) {
      return (
        <ValidationDisplay
          level='success'
          message={'Registered successfully!'}
        />
      )
    }

    if (networkError) {
      return (
        <ValidationDisplay
          level='error'
          message={networkError}
        />
      )
    }

    return null
  }

  private renderEmailErrors = () => {
    const { emailErrors } = this.state
    if (!emailErrors || emailErrors.passes) {
      return null
    }

    return (
      <ValidationDisplay
        level='error'
        errors={emailErrors.errors}
      />
    )
  }

  private renderUsernameErrors = () => {
    const { usernameErrors } = this.state
    if (!usernameErrors || usernameErrors.passes) {
      return null
    }

    return (
      <ValidationDisplay
        level='error'
        message='Your username has errors:'
        errors={usernameErrors.errors}
      />
    )
  }

  private renderPasswordErrors = () => {
    const { passwordErrors } = this.state
    if (!passwordErrors || passwordErrors.passes) {
      return null
    }

    const remainingOptional = passwordErrors.warnings.length - 1

    return (
      <ValidationDisplay
        level='error'
        message='Your password is not strong enough.'
        errors={passwordErrors.errors}
        warnings={passwordErrors.warnings}
        warningsHeader={`The password must have at least ${remainingOptional} more of the following criteria:`}
      />
    )
  }

  private cancel = () => {
    this.props.history.goBack()
  }

  private submit = async () => {
    if (this.hasErrors()) {
      return
    }

    this.setState({ networkError: null })

    const {
      email,
      username,
      password,
      verifyPassword,
    } = this.state

    try {
      await this.props.register(email, username, password, verifyPassword)
      this.succeed()
    } catch (err) {
      console.error(err)
      if (err instanceof HttpError) {
        const { response } = err
        const networkError = await response.text()
        this.setState({ networkError })
      }
    }
  }

  private hasErrors = () => {
    const {
      username,
      usernameErrors,
      password,
      passwordErrors,
      verifyPassword,
    } = this.state

    if (username.length === 0 || password.length === 0 || verifyPassword.length === 0) {
      return true
    }

    if (usernameErrors && !usernameErrors.passes ||
        passwordErrors && !passwordErrors.passes) {
      return true
    }

    if (!this.passwordsMatch()) {
      return true
    }

    return false
  }

  private passwordsMatch = () => {
    const {
      password,
      verifyPassword,
    } = this.state

    return verifyPassword.length === 0 || password === verifyPassword
  }

  private onEmailChange = async (ev: Event) => {
    const target = ev.target as HTMLIonInputElement
    const email = target.value
    if (!email) {
      this.setState({ email, emailErrors: null })
      return
    }
    const emailSetTime = Date.now()
    const emailErrors = verifyEmail(email)
    this.setState({ email, emailErrors, emailSetTime })
    if (!emailErrors.passes) {
      return
    }

    const existsResult = await verifyEmailNotTaken(email)
    this.setState({ usernameErrors: existsResult })
  }

  private onUsernameChange = async (ev: Event) => {
    const target = ev.target as HTMLIonInputElement
    const username = target.value
    if (!username) {
      this.setState({ username, usernameErrors: null })
      return
    }
    const usernameSetTime = Date.now()
    const usernameErrors = verifyUsername(username)
    this.setState({ username, usernameErrors, usernameSetTime })
    if (!usernameErrors.passes) {
      return
    }

    const existsResult = await verifyUsernameDoesntExists(username)
    this.setState({ usernameErrors: existsResult })
  }

  private onPasswordChange = (ev: Event) => {
    const target = ev.target as HTMLIonInputElement
    const password = target.value
    const passwordErrors = verifyPassword(password)
    this.setState({ password, passwordErrors })
  }

  private onVerifyPasswordChange = (ev: Event) => {
    const target = ev.target as HTMLIonInputElement
    const verifyPassword = target.value
    this.setState({ verifyPassword })
  }
}

interface StateProps {
  token: string | null
}

interface DispatchProps {
  register: (email: string, username: string, password: string, verifyPassword: string) => Promise<void>
}

const withRedux = connect<StateProps, DispatchProps, OwnProps, AppState>(
  (state) => ({
    token: state.auth.token,
  }),
  (dispatch) => ({
    register: (email, username, password, verifyPassword) => dispatch(registerUserThunk({ email, username, password, verifyPassword })),
  }),
)

export default withRedux(LoginViewBase)
