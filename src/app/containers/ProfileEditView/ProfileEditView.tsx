
import * as React from 'react'
import { connect, Store } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router-dom'

import Input from 'components/Ionic/Input'
import ValidationDisplay from 'components/ValidationDisplay'
import ContentView from 'containers/ContentView'

import { User } from 'models/user'
import { HttpError } from 'shared/statusCodes'

import fetchUserThunk from 'thunks/fetchUser'
import updateUserThunk from 'thunks/updateUser'
import { AppState } from 'state'
import { sleep, REDIRECT_WAIT } from 'shared/helpers'

import { profileEditView } from './ProfileEditView.scss'

interface RouteParams {
}

interface OwnProps extends RouteComponentProps<RouteParams> {
  store?: Store<AppState>
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  firstName: string
  lastName: string
  waiting: boolean
  networkError: string | null
  success: boolean
  redirect: boolean
}

export class ProfileEditView extends React.Component<Props, State> {
  state: State = {
    firstName: this.props.user && this.props.user.firstName || '',
    lastName: this.props.user && this.props.user.lastName || '',
    waiting: false,
    networkError: null,
    success: false,
    redirect: false,
  }

  componentDidMount () {
    if (!this.props.user) {
      this.props.fetchUser()
        .catch(() => null)
    }
  }

  componentWillReceiveProps (newProps: Props) {
    if (this.props.user !== newProps.user && newProps.user) {
      this.setStateFromUser(newProps.user)
    }
  }

  render () {
    const { user } = this.props

    return (
      <ContentView
        title='Edit Your Profile'
        loading={!user}
        className={profileEditView}
        noMenu
      >
        {this.renderNetworkStatus()}
        {this.renderContent()}
      </ContentView>
    )
  }

  private renderContent = () => {
    const { user } = this.props
    const { firstName, lastName, waiting, success, redirect } = this.state

    if (!user) {
      return null
    }

    if (redirect) {
      return <Redirect to='/profile' />
    }

    return (
      <ion-card>
        <ion-card-header>
          {user.username}
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-label color='tertiary'>Email</ion-label>
              <h2>{user.email}</h2>
            </ion-item>
            <ion-item>
              <ion-label color='tertiary' position='stacked'>First Name</ion-label>
              <Input autofocus value={firstName} placeholder='First Name' onIonInput={this.setStateVal('firstName')} />
            </ion-item>
            <ion-item>
              <ion-label color='tertiary' position='stacked'>Last Name</ion-label>
              <Input value={lastName} placeholder='Last Name' onIonInput={this.setStateVal('lastName')} />
            </ion-item>
          </ion-list>
          <ion-button color='primary' disabled={waiting || success} onClick={this.submit} expand='block'>
            Save
          </ion-button>
          <ion-button color='light' onClick={this.cancel} expand='block'>
            Cancel
          </ion-button>
        </ion-card-content>
      </ion-card>
    )
  }

  private renderNetworkStatus = () => {
    const { waiting, success, networkError } = this.state

    if (networkError) {
      return (
        <ValidationDisplay
          level='error'
          message={networkError}
        />
      )
    } else if (success) {
      return (
        <ValidationDisplay
          level='success'
          message='Saved successfully'
        />
      )
    } else if (waiting) {
      return (
        <ValidationDisplay
          level='info'
          message='Saving...'
        />
      )
    }

    return null
  }

  private setStateVal = (key: keyof State) => (ev: Event) => {
    const target = ev.target as HTMLIonInputElement
    const value = target.value
    this.setState({ [key]: value } as any)
  }

  private setStateFromUser = (user: User) => {
    const { firstName = '', lastName = '' } = user

    this.setState({
      firstName,
      lastName,
    })
  }

  private cancel = () => {
    this.props.history.goBack()
  }

  private submit = async () => {
    const { firstName, lastName } = this.state
    this.setState({ waiting: true })

    try {
      await this.props.updateUser(firstName, lastName)
      this.setState({ waiting: false, success: true })
      await sleep(REDIRECT_WAIT)
      this.setState({ redirect: true })
    } catch (err) {
      if (err instanceof HttpError) {
        const networkError = await err.response.text()
        this.setState({ networkError })
      } else {
        this.setState({ networkError: 'Something went wrong.' })
      }
      this.setState({ waiting: false })
    }
  }
}

interface StateProps {
  user?: User
}

interface DispatchProps {
  fetchUser: () => Promise<void>
  updateUser: (firstName: string, lastName: string) => Promise<User>
}

const withRedux = connect<StateProps, DispatchProps, OwnProps, AppState>(
  (state, ownProps) => ({
    user: state.entities.users.me,
  }),
  (dispatch, ownProps) => ({
    fetchUser: () => dispatch(fetchUserThunk()),
    updateUser: (firstName, lastName) => dispatch(updateUserThunk({ firstName, lastName })),
  }),
)

const ConnectedProfileEditView = withRedux(ProfileEditView)

export default ConnectedProfileEditView
