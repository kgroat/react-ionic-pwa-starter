
import { PushContent } from 'server/types'
import * as wp from 'web-push'

import { singletonPromise } from './singletonPromise'

const { pushEmail } = require('../../../package.json')

export const { publicKey, privateKey } = wp.generateVAPIDKeys()

const configWebPush = singletonPromise(async () => {
  if (process.env.FCM_KEY) {
    wp.setGCMAPIKey(process.env.FCM_KEY)
  }

  wp.setVapidDetails(
    `mailto:${pushEmail}`,
    publicKey,
    privateKey,
  )

  return wp
})

export async function sendNotification (sub: PushSubscription, content: PushContent) {
  try {
    const webPush = await configWebPush()
    return await webPush.sendNotification(sub, JSON.stringify(content))
  } catch (err) {
    if (__DEV__) {
      console.warn('failed to send notification', err)
    }
  }
}
