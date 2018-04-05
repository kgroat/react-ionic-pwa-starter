
import { StoreUserAction, type as STORE_USER } from 'actions/storeUser'

import { ActorMap, buildReducer } from '../../actorMap'
import { User } from 'models/user'

export const INITIAL_STATE: User | undefined = undefined

const actors: ActorMap<User | undefined> = {
  [STORE_USER]: (prev, { user }: StoreUserAction) => (
    user
  ),
}

export default buildReducer(INITIAL_STATE, actors)
