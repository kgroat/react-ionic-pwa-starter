
import { User } from 'models/user'
import { FlatMap } from './FlatMap'

export interface Entities {
  users: FlatMap<User>
}
