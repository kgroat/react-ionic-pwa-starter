
import { UNAUTHORIZED, LOGIN_TIMEOUT, HttpError } from 'shared/statusCodes'
import { apiBaseUrl } from 'appConfig'
import setToken from 'actions/setToken'

import store from './store'

export { HttpError }

function formatUrl (relativeUrl: string) {
  return `${apiBaseUrl}${relativeUrl}`
}

function getHeaders (additionalHeaders?) {
  const { token } = store.getState().auth
  return {
    ...additionalHeaders,
    Authorization: token ? `Bearer ${token}` : undefined,
    'Content-Type': 'application/json',
  }
}

function getInit (init?: RequestInit) {
  return {
    ...init,
    headers: getHeaders(init && init.headers),
  }
}

async function handleResponse (response: Response) {
  if (!response.ok) {
    if (response.status === LOGIN_TIMEOUT || response.status === UNAUTHORIZED) {
      store.dispatch(setToken({ token: null }))
    }

    throw new HttpError(response)
  }

  return response.json()
}

export async function GET<T> (relativeUrl: string, init?: RequestInit) {
  return fetch(
    formatUrl(relativeUrl),
    getInit(init),
  ).then<T>(handleResponse)
}

export async function POST<T, R = {}> (relativeUrl: string, body?: R, init?: RequestInit) {
  return fetch(
    formatUrl(relativeUrl),
    getInit({
      ...init,
      method: 'POST',
      body: JSON.stringify(body),
    }),
  ).then<T>(handleResponse)
}

export async function PUT<T, R = {}> (relativeUrl: string, body: R, init?: RequestInit) {
  return fetch(
    formatUrl(relativeUrl),
    getInit({
      ...init,
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  ).then<T>(handleResponse)
}

export async function PATCH<T, R = {}> (relativeUrl: string, body: R, init?: RequestInit) {
  return fetch(
    formatUrl(relativeUrl),
    getInit({
      ...init,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  ).then<T>(handleResponse)
}

export async function DELETE<T> (relativeUrl: string, init?: RequestInit) {
  return fetch(
    formatUrl(relativeUrl),
    getInit({
      ...init,
      method: 'DELETE',
    }),
  ).then<T>(handleResponse)
}
