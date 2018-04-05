
import { Action } from 'redux'

export const type = 'SET_USERS_LIST_USERS'

interface Options {
  usernames: string[]
}

export type SetUsersListUsersAction = Options & Action

export default (options: Options): SetUsersListUsersAction => ({
  ...options,
  type,
})
