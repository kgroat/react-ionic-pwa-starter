
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Location } from 'history'

import { AppState } from 'state'

interface OwnProps {
  location: Location
}

type Props = OwnProps & StateProps & DispatchProps

class AuthGateBase extends React.Component<Props> {
  render () {
    const { isLoggedIn, location, children } = this.props

    if (!isLoggedIn) {
      const { from } = location.state || { from: { pathname: '/' } }
      return <Redirect to={from} />
    }

    return children
  }
}

interface StateProps {
  isLoggedIn: boolean
}

interface DispatchProps {
}

const withRedux = connect<StateProps, DispatchProps, OwnProps, AppState>(
  (state) => ({
    isLoggedIn: !!state.auth.token,
  }),
  (dispatch) => ({
  }),
)

const HomeView = withRedux(AuthGateBase)

export default HomeView
