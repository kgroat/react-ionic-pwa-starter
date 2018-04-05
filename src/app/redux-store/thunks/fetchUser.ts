
import { ThunkAction } from 'redux-thunk'

import { User } from 'models/user'

import { GET } from '../api'
import { AppState } from 'state'
import storeUser from 'actions/storeUser'

const ME = 'me'
export default (username: string = ME): ThunkAction<any, AppState, Promise<User>> => {
  const endpoint = `/user/${username}`
  return async (dispatch) => {
    const user = await GET<User>(endpoint)
    dispatch(storeUser({ user, id: user.username }))

    if (username === ME) {
      dispatch(storeUser({ user, id: ME }))
    }
    return user
  }
}