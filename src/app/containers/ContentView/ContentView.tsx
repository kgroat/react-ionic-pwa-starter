
import * as React from 'react'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'

import Toolbar from 'components/Ionic/Toolbar'
import PassThrough from 'components/PassThrough'
import Content from 'components/Content'
import Loading from 'components/Loading'
import View from 'components/View'
import ValidationDisplay from 'components/ValidationDisplay'

import fetchUserThunk from 'thunks/fetchUser'
import { AppState } from 'state'
import { User } from 'models/user'

import { POST } from 'redux-store/api'
import { VerificationResponse } from 'api/user/types'

import { contentView, padded } from './ContentView.scss'

interface OwnProps {
  title: string
  className?: string
  refresh?: () => Promise<any>
  padding?: boolean
  noMenu?: boolean
  noVerificationWarning?: boolean
  rawContent?: boolean
  loading?: boolean
  backButton?: boolean
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  sendingVerification: boolean
  verificationSent: boolean
  verificationError: boolean
}

class ContentView extends React.PureComponent<Props, State> {
  state: State = {
    sendingVerification: false,
    verificationSent: false,
    verificationError: false,
  }

  componentDidMount () {
    const { isLoggedIn, user, fetchUser } = this.props
    if (isLoggedIn && !user) {
      fetchUser()
    }
  }

  render () {
    const {
      title,
      noMenu,
    } = this.props

    return (
      <View>
        <ion-header>
          <Toolbar color='primary'>
            {this.renderToolbarButton()}
            <ion-title>{title}</ion-title>
          </Toolbar>
        </ion-header>

        {this.renderContent()}
      </View>
    )
  }

  private renderToolbarButton = () => {
    const {
      backButton,
      noMenu,
      goBack,
    } = this.props

    if (backButton) {
      return (
        <ion-button onClick={goBack} buttonType='bar-button'>
          <ion-icon name='arrow-back' />
        </ion-button>
      )
    }
    if (noMenu) {
      return null
    }

    return <ion-menu-button />
  }

  private renderChildren = () => {
    return React.Children.map(this.props.children, (child) => {
      if ((child as React.ReactElement<any>).type) {
        const element = child as React.ReactElement<any>
        return React.createElement(element.type, element.props)
      } else {
        return child
      }
    })
  }

  private renderContent = () => {
    const {
      refresh,
      padding,
      rawContent,
      loading,
      children,
      className = '',
    } = this.props

    if (loading) {
      return <Loading />
    }

    if (rawContent) {
      return (
        <PassThrough>
          <div>
            {this.renderVerificationWarning()}
          </div>
          <div>
            {children}
          </div>
        </PassThrough>
      )
    }

    return (
      <Content className={`${contentView} ${className}`} refresh={refresh}>
        <div>
          {this.renderVerificationWarning()}
        </div>
        <div className={padding ? padded : undefined}>
          {children}
        </div>
      </Content>
    )
  }

  private renderVerificationWarning = () => {
    const { noVerificationWarning, user } = this.props

    if (noVerificationWarning || !user || user.verified) {
      return null
    }

    const { sendingVerification, verificationSent, verificationError } = this.state

    let content: string | JSX.Element

    if (verificationError) {
      content = (
        <span>
          Something went wrong &nbsp;
          <a href='#' onClick={this.sendVerificationEmail}>Resend</a>
        </span>
      )
    } else if (verificationSent) {
      content = 'Verification email sent'
    } else if (sendingVerification) {
      content = 'Sending email...'
    } else {
      content = (
        <span>
          You haven't verified your email &nbsp;
          <a href='#' onClick={this.sendVerificationEmail}>Resend</a>
        </span>
      )
    }

    return (
      <ValidationDisplay
        level={'warning'}
        message={content}
      />
    )
  }

  private sendVerificationEmail = async () => {
    try {
      this.setState({ sendingVerification: true, verificationError: false })
      const { success } = await POST<VerificationResponse>('/user/verify/resend')
      this.setState({ verificationSent: success, verificationError: !success })
    } catch (err) {
      this.setState({ verificationError: true })
    }
  }
}

interface StateProps {
  isLoggedIn: boolean
  user?: User
}

interface DispatchProps {
  fetchUser: () => Promise<void>
  goBack: () => void
}

const withRedux = connect<StateProps, DispatchProps, OwnProps, AppState>(
  (state) => ({
    isLoggedIn: !!state.auth.token,
    user: state.entities.users.me,
  }),
  (dispatch) => ({
    fetchUser: () => dispatch(fetchUserThunk()),
    goBack: () => dispatch(goBack())
  }),
)

export const ConnectedContentView = withRedux(ContentView)

export default ConnectedContentView
