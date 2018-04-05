
import { SetTokenAction, type as SET_TOKEN } from 'actions/setToken'

import { ActorMap, buildReducer } from '../actorMap'
import { AuthState } from 'state/AuthState'

export const INITIAL_STATE: AuthState = {
  token: null,
}

const actors: ActorMap<AuthState> = {
  [SET_TOKEN]: (prev, { token }: SetTokenAction) => ({
    ...prev,
    token,
  }),
}

export default buildReducer(INITIAL_STATE, actors)
