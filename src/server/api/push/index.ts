
import { Router } from 'express'
import * as catcher from 'async-catcher'

import { publicKey, sendNotification } from 'services/pushService'

import { PushKeyResponse, RegistrationRequest, RegistrationResponse } from './types'
const router = Router()

router.get('/key', catcher(async (req, res) => {
  const response: PushKeyResponse = {
    publicKey,
  }

  res.json(response)
}))

router.post('/register', catcher(async (req, res) => {
  const { subscription }: RegistrationRequest = req.body
  const response: RegistrationResponse = {
    message: 'ok',
    endpoint: subscription.endpoint,
  }

  await sendNotification(subscription, {
    text: 'Push notification registered',
  })

  res.json(response)
}))

export default router
