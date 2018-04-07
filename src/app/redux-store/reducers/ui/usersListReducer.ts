
import { SetUsersListUsersAction, type as SET_USERS_LIST_USERS } from 'actions/setUsersListUsers'

import { ActorMap, buildReducer } from '../../actorMap'
import { UiState, DEFAULT_STATE } from 'state/UiState'

const actors: ActorMap<UiState['usersList']> = {
  [SET_USERS_LIST_USERS]: (prev, { usernames }: SetUsersListUsersAction) => ({
    ...prev,
    usernames: usernames.sort(),
  }),
}

export default buildReducer(DEFAULT_STATE.usersList, actors)
