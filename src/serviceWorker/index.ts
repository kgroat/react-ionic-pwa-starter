
import { PushContent } from 'server/types/push'

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js')

const worker: ServiceWorkerGlobalScope = self as any

workbox.skipWaiting()
workbox.clientsClaim()

/*
  This is our code to handle push events.
*/
worker.addEventListener('push', event => {
  if (!event || !event.data) {
    return
  }

  const data: PushContent = event.data.json()

  if (__DEV__) {
    console.log('[Service Worker] Push Received.', data)
  }

  const title = 'Push Notification'
  const options = {
    body: data.text,
    icon: 'icon.png',
    badge: 'badge.png',
  }

  event.waitUntil(worker.registration.showNotification(title, options))
})

workbox.precaching.precacheAndRoute([])

workbox.routing.registerRoute(
  /.*/,
  workbox.strategies.networkFirst(),
)
