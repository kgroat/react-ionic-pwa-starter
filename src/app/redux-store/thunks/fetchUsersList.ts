
import { ThunkAction } from 'redux-thunk'

import { User } from 'models/user'

import { GET } from '../api'
import { AppState } from 'state'
import storeUser from 'actions/storeUser'
import setUsersListUsers from 'actions/setUsersListUsers'

const endpoint = '/user'
export default (replace: boolean = false): ThunkAction<any, AppState, Promise<void>> => {
  return async (dispatch) => {
    const users = await GET<User[]>(endpoint)
    const usernames = users.map(user => {
      dispatch(storeUser({ user, id: user.username }))
      return user.username
    })

    dispatch(setUsersListUsers({ usernames }))
  }
}