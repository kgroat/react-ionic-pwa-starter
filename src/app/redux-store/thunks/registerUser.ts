
import { ThunkAction } from 'redux-thunk'

import { RegisterRequest, RegisterResponse } from 'api/user/types'

import { POST } from '../api'
import { AppState } from 'state'
import setToken from 'actions/setToken'

const endpoint = '/user/register'

export default (req: RegisterRequest): ThunkAction<any, AppState, Promise<void>> =>
  async (dispatch) => {
    const { token } = await POST<RegisterResponse>(endpoint, req)
    dispatch(setToken({ token }))
  }
