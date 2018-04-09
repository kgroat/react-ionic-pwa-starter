
import { PushContent } from 'server/types/push'

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js')

const worker: ServiceWorkerGlobalScope = self as any
const baseUrl = process.env.BASE_URL as string

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

workbox.precaching.precacheAndRoute([
  baseUrl,
  `${baseUrl}index.js`,
  `${baseUrl}ionic.js`,
  `${baseUrl}ionic.js`,
])

workbox.routing.registerRoute(
  /\/collection\/.*/,
  workbox.strategies.cacheFirst(),
)

workbox.routing.registerRoute(
  /\/ionic\/.*/,
  workbox.strategies.cacheFirst(),
)

workbox.routing.registerRoute(
  /\.css$/,
  workbox.strategies.cacheFirst(),
)

workbox.routing.registerRoute(
  /\.js$/,
  workbox.strategies.cacheFirst(),
)

workbox.routing.registerRoute(
  /\/api\/.*/,
  workbox.strategies.networkFirst(),
)
