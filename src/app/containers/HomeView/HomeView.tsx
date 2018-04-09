
import * as React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import GitCorner from 'components/GitCorner'
import ContentView from 'containers/ContentView'

import { AppState } from 'state'

interface OwnProps {
}

type Props = OwnProps & StateProps & DispatchProps

class HomeViewBase extends React.Component<Props> {
  render () {
    return (
      <ContentView title='React Ionic PWA Starter' padding>
        <GitCorner />
        <p>
          Welcome to the React Ionic PWA Starter.
        </p>
        <p>
          {this.renderLoginLogout()}
        </p>
      </ContentView>
    )
  }

  private renderLoginLogout = () => {
    const { isLoggedIn } = this.props
    if (isLoggedIn) {
      return (
        <ion-button onClick={this.goTo('/logout')}>Log Out</ion-button>
      )
    } else {
      return (
        <ion-button onClick={this.goTo('/login')}>Log In</ion-button>
      )
    }
  }

  private goTo = (location: string) => () => {
    this.props.goTo(location)
  }
}

interface StateProps {
  isLoggedIn: boolean
}

interface DispatchProps {
  goTo: (location: string) => void
}

const withRedux = connect<StateProps, DispatchProps, OwnProps, AppState>(
  (state) => ({
    isLoggedIn: !!state.auth.token,
  }),
  (dispatch) => ({
    goTo: (location) => dispatch(push(location)),
  }),
)

const HomeView = withRedux(HomeViewBase)

export default HomeView
