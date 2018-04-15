
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
export { Subscription } from 'rxjs/Subscription'

const CUSTOM_ONLINE = 'ONL'
const CUSTOM_OFFLINE = 'OFFL'

export type OnlineStatusString = 'online' | 'offline'
export interface OnlineStatus {
  online: boolean
  status: OnlineStatusString
}

const ONLINE: OnlineStatus = {
  online: true,
  status: 'online',
}

const OFFLINE: OnlineStatus = {
  online: false,
  status: 'offline',
}

const nativeSupport = ('online' in window && 'offline' in window)

const onlineStatusObservable = new Observable<OnlineStatus>((subscriber) => {
  const onlineHandler = () => {
    subscriber.next(ONLINE)
  }
  const offlineHandler = () => {
    subscriber.next(OFFLINE)
  }

  if (nativeSupport) {
    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)
  } else {
    document.addEventListener(CUSTOM_ONLINE, onlineHandler)
    document.addEventListener(CUSTOM_OFFLINE, offlineHandler)
  }

  return () => {
    if (nativeSupport) {
      window.removeEventListener('online', onlineHandler)
      window.removeEventListener('offline', offlineHandler)
    } else {
      document.removeEventListener(CUSTOM_ONLINE, onlineHandler)
      document.removeEventListener(CUSTOM_OFFLINE, offlineHandler)
    }
  }
})

export const onlineStatus = new BehaviorSubject<OnlineStatus>(navigator.onLine ? ONLINE : OFFLINE)
onlineStatusObservable.subscribe(onlineStatus)

if (!nativeSupport) {
  let previousOnlineState = navigator.onLine
  setInterval(() => {
    if (navigator.onLine !== previousOnlineState) {
      previousOnlineState = navigator.onLine

      const ev = new CustomEvent(navigator.onLine ? CUSTOM_ONLINE : CUSTOM_OFFLINE)
      document.dispatchEvent(ev)
    }
  }, 300)
}
