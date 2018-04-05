
import { GET, POST } from './redux-store/api'

import { PushKeyResponse, RegistrationRequest, RegistrationResponse } from 'api/push/types'

function urlBase64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

if ('serviceWorker' in navigator) {
  (async function () {
    const registration = await (navigator as Navigator).serviceWorker.register('sw.js')
    let subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
    }

    const { publicKey } = await GET<PushKeyResponse>('/push/key')

    const applicationServerKey = urlBase64ToUint8Array(publicKey)
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })

    const body: RegistrationRequest = {
      subscription,
    }

    return POST<RegistrationResponse, RegistrationRequest>('/push/register', body)
  })()
  .catch(err => {
    console.warn('Service worker registration failed', err)
  })
}
