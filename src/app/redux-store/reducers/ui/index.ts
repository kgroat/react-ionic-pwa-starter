
import { combineReducers } from 'redux'
import { Entities } from 'state/Entities'

import usersList from './usersListReducer'

export default combineReducers<Entities>({
  usersList,
})
