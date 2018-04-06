
import * as React from 'react'
import { connect, Store } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { push } from 'react-router-redux'

import ContentView from 'containers/ContentView'

import fetchUsersListThunk from 'thunks/fetchUsersList'

import { AppState } from 'state'

interface RouteParams {
}

interface OwnProps extends RouteComponentProps<RouteParams> {
  store?: Store<any>
}

type Props = OwnProps & StateProps & DispatchProps

export class UsersListView extends React.Component<Props> {
  componentDidMount () {
    this.props.fetchUsersList()
      .catch(() => null)
  }

  render () {
    const { usernames } = this.props

    return (
      <ContentView title='Users' loading={usernames.length === 0}>
        {this.renderList()}
      </ContentView>
    )
  }

  private renderList = () => {
    const { usernames } = this.props

    return (
      <ion-list>
        {
          usernames.map(username => (
            <ion-item key={username} onClick={this.goToProfile(username)}>{username}</ion-item>
          ))
        }
      </ion-list>
    )
  }

  private goToProfile = (username: string) => () => {
    this.props.goTo(`/profile/${username}`)
  }
}

interface StateProps {
  usernames: string[]
}

interface DispatchProps {
  goTo: (location: string) => void
  fetchUsersList: () => Promise<void>
}

const withRedux = connect<StateProps, DispatchProps, OwnProps, AppState>(
  (state) => ({
    usernames: state.ui.usersList.usernames,
  }),
  (dispatch) => ({
    goTo: (location) => dispatch(push(location)),
    fetchUsersList: () => dispatch(fetchUsersListThunk()),
  }),
)

const ConnectedUsersListView = withRedux(UsersListView)

export default ConnectedUsersListView
