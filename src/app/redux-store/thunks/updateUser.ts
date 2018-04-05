
import { ThunkAction } from 'redux-thunk'

import { User } from 'models/user'

import { PUT } from '../api'
import { AppState } from 'state'
import storeUser from 'actions/storeUser'
import { UpdateRequest } from 'api/user/types'
export { UpdateRequest }

export default (update: UpdateRequest): ThunkAction<any, AppState, Promise<User>> => {
  const endpoint = `/user`
  return async (dispatch) => {
    const updatedUser = await PUT<User, UpdateRequest>(endpoint, update)
    dispatch(storeUser({ user: updatedUser, id: updatedUser.username }))
    dispatch(storeUser({ user: updatedUser, id: 'me' }))
    return updatedUser
  }
}