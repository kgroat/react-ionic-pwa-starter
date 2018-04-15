
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { replace } from 'react-router-redux'
import { Redirect } from 'react-router-dom'

import IonInput from 'components/Ionic/Input'
import View from 'components/View'
import ValidationDisplay from 'components/ValidationDisplay'

import loginThunk from 'thunks/login'
import { AppState } from 'state'
import { HttpError } from 'shared/statusCodes'
import { sleep, REDIRECT_WAIT } from 'shared/helpers'

import { buttonGroup, spacer } from './LoginView.scss'

interface OwnProps extends RouteComponentProps<void> {
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  username: string
  password: string
  networkError: string | null
  redirect: boolean
  success: boolean
  waiting: boolean
}

class LoginViewBase extends React.Component<Props, State> {
  state: State = {
    username: '',
    password: '',
    networkError: null,
    redirect: this.props.token !== null,
    success: false,
    waiting: false,
  }

  render () {
    if (this.state.redirect) {
      const { from } = this.props.location.state || { from: { pathname: '/' } }
      return <Redirect to={from} />
    }

    const { username, password, waiting } = this.state

    return (
      <View>
        <ion-header>
          <ion-toolbar color='primary'>
            <ion-title>Login</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list>
            {this.renderStatus()}
            <ion-item>
              <ion-label color='primary' position='stacked'>Username</ion-label>
              <IonInput autofocus placeholder='Username' value={username} onIonInput={this.onUsernameChange} />
            </ion-item>
            <ion-item>
              <ion-label color='primary' position='stacked'>Password</ion-label>
              <IonInput type='password' placeholder='Password' value={password} onIonInput={this.onPasswordChange} />
            </ion-item>
          </ion-list>
          <div className={buttonGroup}>
            <ion-button color='primary' disabled={this.hasErrors() || waiting} onClick={this.submit} expand='block'>
              Login
            </ion-button>
            <ion-button color='light' onClick={this.cancel} expand='block'>
              Cancel
            </ion-button>
            <div className={spacer} />
            <ion-button color='light' disabled={waiting} onClick={() => this.props.redirectTo('/register')} expand='block'>
              Register
            </ion-button>
          </div>
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
          message={'Successfully logged in!'}
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

  private cancel = () => {
    this.props.history.goBack()
  }

  private submit = async () => {
    if (this.hasErrors()) {
      return
    }

    this.setState({ networkError: null, waiting: true })

    const { username, password } = this.state

    try {
      await this.props.login(username, password)
      return this.succeed()
    } catch (err) {
      console.error(err)
      if (err instanceof HttpError) {
        const { response } = err
        const networkError = await response.text()
        this.setState({ networkError, waiting: false })
      }
    }
  }

  private hasErrors = () => {
    const { username, password } = this.state
    return username.length === 0 || password.length === 0
  }

  private onUsernameChange = (ev: Event) => {
    const target = ev.target as HTMLIonInputElement
    this.setState({ username: target.value })
  }

  private onPasswordChange = (ev: Event) => {
    const target = ev.target as HTMLIonInputElement
    this.setState({ password: target.value })
  }
}

interface StateProps {
  token: string | null
}

interface DispatchProps {
  login: (username: string, password: string) => Promise<void>
  redirectTo: (location: string) => void
}

const withRedux = connect<StateProps, DispatchProps, OwnProps, AppState>(
  (state) => ({
    token: state.auth.token,
  }),
  (dispatch) => ({
    login: (username, password) => dispatch(loginThunk({ username, password })),
    redirectTo: (location) => dispatch(replace(location)),
  }),
)

export default withRedux(LoginViewBase)
