
import { NOT_FOUND } from 'shared/statusCodes'

export class BaseError extends Error {
  constructor (public status: number, message: string) {
    super(message)
  }
}

export class NotFoundError extends BaseError {
  constructor (public collection: string, public query?: any) {
    super(NOT_FOUND, 'Not Found')
  }
}
