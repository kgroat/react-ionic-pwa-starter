
import { User } from 'models/user'
import { FlatMap } from './FlatMap'

export interface Entities {
  users: FlatMap<User>
}

export const DEFAULT_STATE: Entities = {
  users: {},
}
