
import * as React from 'react'
import { connect, Store } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router-dom'

import ValidationDisplay from 'components/ValidationDisplay'
import ContentView from 'containers/ContentView'

import fetchUserThunk from 'thunks/fetchUser'

import { AppState } from 'state'
import { User } from 'models/user'
import { sleep, REDIRECT_WAIT } from 'shared/helpers'

import { GET, HttpError } from 'redux-store/api'
import { VerificationResponse } from 'api/user/types'

interface RouteParams {
  username: string
  verificationToken: string
}

interface OwnProps extends RouteComponentProps<RouteParams> {
  store?: Store<any>
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  success: boolean | null
  redirect: boolean
  error: string
}

export class VerifyView extends React.Component<Props, State> {
  state: State = {
    success: null,
    redirect: false,
    error: '',
  }

  componentDidMount () {
    this.verify()
  }

  render () {
    const { success, redirect, error } = this.state

    if (redirect) {
      return <Redirect to='/' />
    } else if (error) {
      return (
        <ContentView title='Verify' noVerificationWarning>
          <ValidationDisplay
            level='error'
            message={error}
          />
        </ContentView>
      )
    } else if (success === null) {
      return (
        <ContentView title='Verify' noVerificationWarning>
          <ValidationDisplay
            level='info'
            message='Verifying your email...'
          />
        </ContentView>
      )
    } else if (!success) {
      return (
        <ContentView title='Verify' noVerificationWarning>
          <ValidationDisplay
            level='info'
            message='Your email has already been verified.'
          />
        </ContentView>
      )
    } else {
      return (
        <ContentView title='Verify' noVerificationWarning>
          <ValidationDisplay
            level='success'
            message='Your email has been successfully verified.'
          />
        </ContentView>
      )
    }
  }

  private verify = async () => {
    const { user, fetchUser } = this.props
    const { username, verificationToken } = this.props.match.params

    if (user && user.verified) {
      return this.finish(false)
    }

    try {
      const { success } = await GET<VerificationResponse>(`/user/verify/${username}/${verificationToken}`)
      if (!success) {
        return this.finish(false)
      }
    } catch (err) {
      if (err instanceof HttpError) {
        const errorString = await err.response.text()
        return this.finish(null, errorString)
      }
    }

    const fetchedUser = await fetchUser()

    this.finish(fetchedUser.verified)
  }

  private finish = async (success: boolean | null, error: string = '') => {
    this.setState({ success, error })
    await sleep(REDIRECT_WAIT)
    this.setState({ redirect: true })
  }
}

interface StateProps {
  user?: User
}

interface DispatchProps {
  fetchUser: () => Promise<User>
}

const withRedux = connect<StateProps, DispatchProps, OwnProps, AppState>(
  (state) => ({
    user: state.entities.users.me,
  }),
  (dispatch) => ({
    fetchUser: () => dispatch(fetchUserThunk())
  }),
)

const ConnectedVerifyView = withRedux(VerifyView)

export default ConnectedVerifyView
