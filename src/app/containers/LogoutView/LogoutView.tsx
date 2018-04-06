
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router-dom'

import setToken from 'actions/setToken'
import storeUser from 'actions/storeUser'
import { AppState } from 'state'

interface OwnProps extends RouteComponentProps<void> {
}

type Props = OwnProps & StateProps & DispatchProps

class LoginViewBase extends React.Component<Props> {

  componentDidMount () {
    this.props.clearToken()
    this.props.resetUser()
  }

  render () {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    return <Redirect to={from} />
  }
}

interface StateProps {
}

interface DispatchProps {
  clearToken: () => void
  resetUser: () => void
}

const withRedux = connect<StateProps, DispatchProps, OwnProps, AppState>(
  (state) => ({
  }),
  (dispatch) => ({
    clearToken: () => dispatch(setToken({ token: null })),
    resetUser: () => dispatch(storeUser({ id: 'me', user: undefined })),
  }),
)

export default withRedux(LoginViewBase)
