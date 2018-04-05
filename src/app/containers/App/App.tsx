
import * as React from 'react'

import Nav from 'components/Ionic/Nav'
import SideMenu from 'containers/SideMenu'

import store from 'redux-store'
import InnerApp from './InnerApp'

export default () => {
  return (
    <ion-app>
      <SideMenu store={store} />
      <Nav id='test' root={InnerApp} />
    </ion-app>
  )
}
