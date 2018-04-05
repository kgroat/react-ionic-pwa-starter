
import * as React from 'react'
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { Redirect } from 'react-router-dom'

import HomeView from 'containers/HomeView'
import LoginView from 'containers/LoginView'
import LogoutView from 'containers/LogoutView'
import RegisterView from 'containers/RegisterView'
import ProfileView from 'containers/ProfileView'
import ProfileEditView from 'containers/ProfileEditView'
import UsersListView from 'containers/UsersListView'
import VerifyView from 'containers/VerifyView'

import store from 'redux-store'
import history from './history'
import AuthRoute from './layouts/AuthRoute'

export default () => (
  <ConnectedRouter history={history} store={store}>
    <Switch>
      <Route exact path='/' component={HomeView}/>
      <Route exact path='/login' component={LoginView}/>
      <Route exact path='/logout' component={LogoutView}/>
      <Route exact path='/register' component={RegisterView}/>
      <Route path='/profile/:username' component={ProfileView}/>
      <Route exact path='/users' component={UsersListView} />
      <Route path='/verify/:username/:verificationToken' component={VerifyView} />
      <AuthRoute exact path='/profile' component={ProfileView}/>
      <AuthRoute exact path='/editProfile' component={ProfileEditView}/>
      <Route path='*' render={() => <Redirect to='/' />} />
    </Switch>
  </ConnectedRouter>
)
