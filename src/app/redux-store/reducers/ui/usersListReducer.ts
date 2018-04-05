
import { SetUsersListUsersAction, type as SET_USERS_LIST_USERS } from 'actions/setUsersListUsers'

import { ActorMap, buildReducer } from '../../actorMap'
import { UiState } from 'state/UiState'

export const INITIAL_STATE: UiState['usersList'] = {
  usernames: [],
}

const actors: ActorMap<UiState['usersList']> = {
  [SET_USERS_LIST_USERS]: (prev, { usernames }: SetUsersListUsersAction) => ({
    ...prev,
    usernames: usernames.sort(),
  }),
}

export default buildReducer(INITIAL_STATE, actors)
