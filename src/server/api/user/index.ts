
import { Router } from 'express'
import * as catcher from 'async-catcher'

import { FORBIDDEN, BAD_REQUEST } from 'shared/statusCodes'
import * as userService from 'services/userService'
import * as emailService from 'services/emailService'
import { requireAuth, useAuth, createToken } from 'services/authService'

import * as userTypes from './types'

const router = Router()

const DEFAULT_COUNT = 20
const MAX_COUNT = 50

const USERNAME = 'username'
const VERIFICATION_KEY = 'verificationKey'

router.get('/', catcher(async (req, res) => {
  const { take: takeStr, skip: skipStr, sortBy } = req.query

  const take = takeStr && parseInt(takeStr, 10) || DEFAULT_COUNT
  const skip = skipStr && parseInt(skipStr, 10)
  const users = await userService.getMany(Math.min(take, MAX_COUNT), skip, sortBy)

  res.json(users)
}))

router.put('/', requireAuth, catcher(async (req, res) => {
  const update = req.body as userTypes.UpdateRequest
  const updatedUser = await userService.updateUser(req.user!.username, update)
  res.json(updatedUser)
}))

router.post(`/verify/resend`, requireAuth, catcher(async (req, res) => {
  if (req.user!.verified) {
    return res.send({
      success: false,
    })
  }

  console.log('user', req.userUNSAFE)
  await emailService.sendVerifyEmail(req.userUNSAFE!)

  res.send({
    success: true,
  })
}))

router.get(`/verify/:${USERNAME}/:${VERIFICATION_KEY}`, catcher(async (req, res) => {
  const username = req.param('username')
  const verificationKey = req.param('verificationKey')

  const success = await userService.verifyUser(username, verificationKey)

  res.send({
    success,
  })
}))

router.get('/me', requireAuth, catcher(async (req, res) => {
  res.json(req.user)
}))

router.get(`/:${USERNAME}`, catcher(async (req, res) => {
  const username = req.param(USERNAME)
  const user = await userService.getByUsername(username)
  res.json(user)
}))

router.post('/token', requireAuth, catcher(async (req, res) => {
  const response: userTypes.TokenResponse = {
    token: req.token!,
  }

  res.json(response)
}))

router.post('/register', useAuth, catcher(async (req, res) => {
  if (req.user) {
    return res.status(FORBIDDEN).send('You are already logged in')
  }

  const { email, username, password, verifyPassword } = req.body as userTypes.RegisterRequest

  if (username.length < 6) {
    return res.status(BAD_REQUEST).send('Username must be at least 6 characters')
  } else if (password !== verifyPassword) {
    return res.status(BAD_REQUEST).send('Passwords do not match')
  }

  const { token, user } = await userService.create({
    email,
    username,
    password,
  })
  const response: userTypes.RegisterResponse = {
    user,
    token,
  }

  res.json(response)
}))

router.post('/login', useAuth, catcher(async (req, res) => {
  if (req.user) {
    return res.status(FORBIDDEN).send('You are already logged in')
  }

  const { username, password } = req.body as userTypes.LoginRequest

  const token = await createToken(username, password)
  const response: userTypes.LoginResponse = {
    token,
  }

  res.json(response)
}))

export default router
