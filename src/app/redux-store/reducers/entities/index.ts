
import { combineReducers } from 'redux'
import { Entities } from 'state/Entities'

import { buildFlatMap } from '../../actorMap'
import usersReducer from './usersReducer'

export default combineReducers<Entities>({
  users: buildFlatMap(usersReducer),
})
