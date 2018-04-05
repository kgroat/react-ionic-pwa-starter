
import { ObjectID, FilterQuery } from 'mongodb'
import * as bcrypt from 'bcrypt'
import * as uuid from 'uuid/v4'

import { BAD_REQUEST } from 'shared/statusCodes'
import { getDb } from './dbService'
import { createTokenFromUserId } from './authService'
import { User, UserUNSAFE } from 'models/user'
import { NotFoundError, BaseError } from 'server/errors'

import { singletonPromise } from './singletonPromise'
import { sendVerifyEmail } from './emailService'

export { User, UserUNSAFE }

const COLLECTION_NAME = 'users'
const getCollection = singletonPromise(() =>
  getDb().then(db => db.collection<UserUNSAFE>(COLLECTION_NAME))
)

const USERNAME: keyof User = 'username'
const saltIterations =
  process.env.PASSWORD_SALT_ITERATIONS
    ? parseInt(process.env.PASSWORD_SALT_ITERATIONS, 10)
    : 10

if (Number.isNaN(saltIterations)) {
  console.error('Please use an integer for your $PASSWORD_SALT_ITERATIONS environment variable')
  process.exit(1)
}

const init = async () => {
  const collection = await getCollection()
  const usernameIndexExists = await collection.indexExists(USERNAME)
  if (!usernameIndexExists) {
    await collection.createIndex(USERNAME, { unique: true })
  }
}

init().catch(err => {
  console.error(`failed to correctly initialize the ${COLLECTION_NAME} collection`, err)
})

export class UserExistsError extends BaseError {
  constructor (public username: string) {
    super(BAD_REQUEST, `Username ${username} already exists.`)
  }
}

export class BadAuthError extends BaseError {
  constructor () {
    super(BAD_REQUEST, `Username or password do not match`)
  }
}

export class VerificationError extends BaseError {
  constructor (message: string) {
    super(BAD_REQUEST, message)
  }
}

export async function getMany (take: number = 20, skip: number = 0, sortBy: keyof User = 'username', query?: FilterQuery<User>) {
  const collection = await getCollection()
  const cursor = collection.find<UserUNSAFE>(query)

  const users =
    await cursor
      .sort({ [sortBy]: 1 })
      .skip(skip)
      .limit(take)
      .toArray()

  return users.map(stripPrivates)
}

export async function getByIdUNSAFE (id: ObjectID | string) {
  if (typeof id === 'string') {
    id = new ObjectID(id)
  }

  const collection = await getCollection()
  const user = await collection.findOne(id)

  if (!user) {
    throw new NotFoundError(COLLECTION_NAME)
  }

  return user
}

export async function getById (id: ObjectID | string) {
  const user = await getByIdUNSAFE(id)
  return stripPrivates(user)
}

export async function getByUsername (username: string) {
  const user = await getByUsernameUNSAFE(username)

  return stripPrivates(user)
}

export async function getByUsernameUNSAFE (username: string) {
  const collection = await getCollection()
  const user = await collection.findOne({ username })

  if (!user) {
    throw new NotFoundError(COLLECTION_NAME, username)
  }

  return user
}

export interface UpdateRequest {
  firstName: string
  lastName: string
}

export async function updateUser (username: string, update: UpdateRequest): Promise<User> {
  const {
    firstName,
    lastName,
  } = update

  const collection = await getCollection()
  const result = await collection.updateOne({ username }, {
    $set: {
      firstName,
      lastName,
    },
  })

  const originalUser = await getByUsername(username)
  return {
    ...originalUser,
    firstName,
    lastName,
  }
}

export async function verifyUser (username: string, verificationKey: string) {
  const user = await getByUsernameUNSAFE(username)
  if (user.verified) {
    return false
  }

  if (user.verificationKey !== verificationKey) {
    throw new VerificationError('Incorrect verification key')
  }

  const collection = await getCollection()
  const result = await collection.updateOne({ username }, {
    $set: { verified: true },
  })

  return true
}

export async function searchByUsername (searchBy: string = '', take: number = 20, skip: number = 0) {
  const collection = await getCollection()
  const cursor = collection.find<UserUNSAFE>({
    username: { $regex: new RegExp(searchBy) },
  })

  const users = await cursor
    .sort('username')
    .skip(skip)
    .max(take)
    .toArray()

  return users.map(stripPrivates)
}

export async function passwordMatchesUNSAFE (username: string, password: string) {
  const user = await getByUsernameUNSAFE(username)
  if (!user) {
    throw new BadAuthError()
  }

  const passwordsMatch = await bcrypt.compare(password, user.password)
  if (!passwordsMatch) {
    throw new BadAuthError()
  }

  return user
}

interface CreateOptions {
  email: string
  username: string
  password: string
}

export async function createUNSAFE (options: CreateOptions) {
  const { username, password, email } = options

  try {
    const existingUser = await getByUsername(username)
    if (existingUser) {
      throw new UserExistsError(username)
    }
  } catch (err) {
    if (!(err instanceof NotFoundError)) {
      throw err
    }
  }

  const hashedPassword = await bcrypt.hash(password, saltIterations)

  const user: UserUNSAFE = {
    _id: undefined as any,
    username,
    email,
    password: hashedPassword,
    verificationKey: uuid(),
    verified: false,
    firstName: '',
    lastName: '',
  }

  const collection = await getCollection()
  const response = await collection.insertOne(user)

  user._id = response.insertedId

  sendVerifyEmail(user)

  return {
    response,
    user: user,
  }
}

export async function create (options: CreateOptions) {
  const { response, user } = await createUNSAFE(options)
  const token = await createTokenFromUserId(user._id)

  return {
    token,
    response,
    user: stripPrivates(user),
  }
}

export function stripPrivates (user: UserUNSAFE): User {
  user = Object.assign({}, user)
  delete user._id
  delete user.password
  delete user.verificationKey

  return user
}
