
import { Action } from 'redux'
import { User } from 'models/user'

export const type = 'STORE_USER'

interface Options {
  id: string
  user: User | undefined
}

export type StoreUserAction = Options & Action

export default (options: Options): StoreUserAction => ({
  ...options,
  type,
})
