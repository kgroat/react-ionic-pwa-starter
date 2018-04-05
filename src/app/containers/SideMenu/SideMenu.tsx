
import * as React from 'react'
import { connect, Store } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { push } from 'react-router-redux'

import Menu from 'components/Ionic/Menu'

import { AppState } from 'state'

interface OwnProps {
  store?: Store<any>
}

type Props = OwnProps & StateProps & DispatchProps

class SideMenu extends React.Component<Props> {
  private menu: Menu

  render () {
    return (
      <Menu ref={ref => this.menu = ref} contentId='test'>
        <ion-content>
          <ion-list>
            <ion-item>
              <ion-title>Menu</ion-title>
            </ion-item>
            <ion-item onClick={this.goTo('/')}>
              Home
            </ion-item>
            {
              this.props.isLoggedIn
              ? <ion-item onClick={this.goTo('/profile')}>
                  Your Profile
                </ion-item>
              : null
            }
            <ion-item onClick={this.goTo('/users')}>
              Users List
            </ion-item>
            {
              this.props.isLoggedIn
              ? <ion-item key='logout' onClick={this.goTo('/logout')}>
                  Log Out
                </ion-item>
              : <ion-item key='login' onClick={this.goTo('/login')}>
                  Log In
                </ion-item>
            }
          </ion-list>
        </ion-content>
      </Menu>
    )
  }

  private goTo = (route: string) => () => {
    this.props.goTo(route)
    if (this.menu) {
      this.menu.element.close()
    }
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
    goTo: (location) => dispatch(push(location))
  }),
)

const ConnectedSideMenu = withRedux(SideMenu)

export default ConnectedSideMenu
