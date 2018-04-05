
export const BAD_REQUEST = 400
export const UNAUTHORIZED = 401
export const FORBIDDEN = 403
export const NOT_FOUND = 404

export const SERVER_ERROR = 500
export const NOT_IMPLEMENTED = 501
export const LOGIN_TIMEOUT = 440

export class HttpError extends Error {
  constructor (public response: Response, message?: string) {
    super(message)
  }
}
