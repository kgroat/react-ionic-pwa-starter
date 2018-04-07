
import { SetTokenAction, type as SET_TOKEN } from 'actions/setToken'

import { ActorMap, buildReducer } from '../actorMap'
import { AuthState, DEFAULT_STATE } from 'state/AuthState'

const actors: ActorMap<AuthState> = {
  [SET_TOKEN]: (prev, { token }: SetTokenAction) => ({
    ...prev,
    token,
  }),
}

export default buildReducer(DEFAULT_STATE, actors)
