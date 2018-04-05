
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { AppState } from 'state'
import auth from './reducers/authReducer'
import entities from './reducers/entities'
import ui from './reducers/ui'

export default combineReducers<AppState>({
  auth,
  router: routerReducer,
  entities,
  ui,
})
