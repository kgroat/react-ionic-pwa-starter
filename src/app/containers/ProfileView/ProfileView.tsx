
import * as React from 'react'
import { connect, Store } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { push } from 'react-router-redux'

import ContentView from 'containers/ContentView'

import { User } from 'models/user'
import { NOT_FOUND, HttpError } from 'shared/statusCodes'

import fetchUserThunk from 'thunks/fetchUser'
import { AppState } from 'state'

import { profileView } from './ProfileView.scss'

export interface RouteParams {
  username?: string
}

interface OwnProps extends RouteComponentProps<RouteParams> {
  store?: Store<AppState>
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  notFound: boolean
  error: string
}

export class ProfileView extends React.Component<Props, State> {
  state: State = {
    notFound: false,
    error: '',
  }

  componentDidMount () {
    this.fetch()
      .catch(() => null)
  }

  render () {
    const { user } = this.props
    const { notFound, error } = this.state
    const showBackButton = !!this.props.match.params.username

    return (
      <ContentView
        title='Profile'
        refresh={this.fetch}
        loading={!user && !notFound && !error}
        className={profileView}
        backButton={showBackButton}
      >
        {this.renderContent()}
        {this.renderEdit()}
      </ContentView>
    )
  }

  private renderContent = () => {
    const { user } = this.props
    const { notFound, error } = this.state

    if (notFound || error) {
      return this.renderError()
    }

    if (!user) {
      return null
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
              <ion-label color='tertiary'>First Name</ion-label>
              <h2>{user.firstName}</h2>
            </ion-item>
            <ion-item>
              <ion-label color='tertiary'>Last Name</ion-label>
              <h2>{user.lastName}</h2>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    )
  }

  private renderError = () => {
    const { match } = this.props
    const { notFound, error } = this.state

    if (notFound) {
      return (
        <ion-card>
          <ion-card-header>
            Cannot find user {match.params.username}
          </ion-card-header>
        </ion-card>
      )
    }

    return error
  }

  private renderEdit = () => {
    const { goTo } = this.props
    if (this.props.match.params.username) {
      return null
    }

    return (
      <ion-fab horizontal='right' vertical='bottom'>
        <ion-fab-button onClick={() => goTo('/editProfile')}>
          <ion-icon name='options' />
        </ion-fab-button>
      </ion-fab>
    )
  }

  private fetch = async () => {
    try {
      await this.props.fetchUser()
    } catch (err) {
      if (err instanceof HttpError && err.response.status === NOT_FOUND) {
        this.setState({ notFound: true })
      } else {
        this.setState({ error: err.message || 'Something went wrong' })
      }
    }
  }
}

interface StateProps {
  user?: User
}

interface DispatchProps {
  fetchUser: () => Promise<void>
  goTo: (location: string) => void
}

const withRedux = connect<StateProps, DispatchProps, OwnProps, AppState>(
  (state, ownProps) => ({
    user: state.entities.users[ownProps.match.params.username || 'me'],
  }),
  (dispatch, ownProps) => ({
    fetchUser: () => dispatch(fetchUserThunk(ownProps.match.params.username)),
    goTo: (location) => dispatch(push(location)),
  }),
)

const ConnectedProfileView = withRedux(ProfileView)

export default ConnectedProfileView
