
import { ThunkAction } from 'redux-thunk'

import { LoginRequest, LoginResponse } from 'api/user/types'

import { POST } from '../api'
import { AppState } from 'state'
import setToken from 'actions/setToken'

const endpoint = '/user/login'

export default (req: LoginRequest): ThunkAction<any, AppState, Promise<void>> =>
  async (dispatch) => {
    const { token } = await POST<LoginResponse>(endpoint, req)
    dispatch(setToken({ token }))
  }
