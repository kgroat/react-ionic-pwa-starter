
import { StoreUserAction, type as STORE_USER } from 'actions/storeUser'

import { ActorMap, buildReducer } from '../../actorMap'
import { User } from 'models/user'

const actors: ActorMap<User | undefined> = {
  [STORE_USER]: (prev, { user }: StoreUserAction) => (
    user
  ),
}

export default buildReducer(undefined, actors)
