
import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import { ObjectID } from 'mongodb'

import { UNAUTHORIZED, LOGIN_TIMEOUT } from 'shared/statusCodes'
import { getByIdUNSAFE, passwordMatchesUNSAFE, stripPrivates } from './userService'
import { User, UserUNSAFE } from 'models/user'
import { BaseError } from 'server/errors'

if (!__DEV__ && !process.env.AUTH_SECRET) {
  console.error('Running the app in production mode requires that the $AUTH_SECRET environment variable be set')
  process.exit(1)
}

export interface TokenContent {
  userId: string
}

const AUTH_SECRET = process.env.AUTH_SECRET || 'This secret is not safe for production'

const ALGORITHM = 'HS512'

export class AuthError extends BaseError {
  constructor (message: string, status: number = UNAUTHORIZED) {
    super(status, message)
  }
}

export async function createToken (username: string, password: string) {
  const user = await passwordMatchesUNSAFE(username, password)

  return createTokenFromUserId(user._id)
}

export function createTokenFromUserId (userId: string | ObjectID) {
  return generateToken({
    userId: userId.toString(),
  })
}

export const useAuth: express.RequestHandler =
  async (req, res, next) => {
    const token = await getTokenFromRequest(req)
      .catch(() => {
        next()
      })

    if (!token) {
      return
    }

    try {
      req.userUNSAFE = await getByIdUNSAFE(token.userId)
      req.user = stripPrivates(req.userUNSAFE)
      next()
    } catch (err) {
      res.status(UNAUTHORIZED).send('Invalid authorization token')
    }
  }

export const requireAuth: express.RequestHandler =
  async (req, res, next) => {
    const token = await getTokenFromRequest(req)
      .catch(err => {
        res.status(err.status).send(err.message)
        throw err
      })

    try {
      req.userUNSAFE = await getByIdUNSAFE(token.userId)
      req.user = stripPrivates(req.userUNSAFE)
      next()
    } catch (err) {
      res.status(UNAUTHORIZED).send('Invalid authorization token')
    }
  }

async function getTokenFromRequest (req: express.Request): Promise<TokenContent> {
  const authorization = req.headers.authorization as string | undefined
  if (!authorization) {
    throw new AuthError('Missing authorization token')
  }

  const [method, token] = authorization.split(' ')
  if (method !== 'Bearer') {
    throw new AuthError('Authorization method not recognized; please use Bearer token')
  }

  req.token = token

  try {
    return await decodeToken(token)
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new AuthError('Authorization token expired', LOGIN_TIMEOUT)
    }
    throw new AuthError('Invalid authorization token')
  }
}

function decodeToken (token: string): Promise<TokenContent> {
  return new Promise((resolve, reject) => {
    return jwt.verify(
      token,
      AUTH_SECRET,
      {
        algorithms: [ALGORITHM],
        clockTolerance: 10,
      },
      (err, content: TokenContent) => {
        if (err) { return reject(err) }
        resolve(content)
      },
    )
  })
}

function generateToken (content: TokenContent): Promise<string> {
  return new Promise((resolve, reject) => {
    return jwt.sign(
      content,
      AUTH_SECRET,
      {
        algorithm: ALGORITHM,
        expiresIn: '7d',
      },
      (err, token) => {
        if (err) { return reject(err) }
        resolve(token)
      },
    )
  })
}

declare global {
  namespace Express {
    export interface Request {
      token?: string
      user?: User
      userUNSAFE?: UserUNSAFE
    }
  }
}
