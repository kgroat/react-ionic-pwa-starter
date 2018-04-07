
import { ObjectID } from 'mongodb'
import { BaseModel } from './base'

export interface User extends BaseModel {
  username: string
  email: string
  firstName: string
  lastName: string
  verified: boolean
}

export interface UserUNSAFE extends User {
  _id: ObjectID
  password: string
  verificationKey: string
}
