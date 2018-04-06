
import * as owasp from 'owasp-password-strength-test'

import { Validator } from './types'
import { SyncValidatorFunction, makeValidator } from './index'

owasp.config({
  minOptionalTestsToPass: 3,
})

export const verifyPassword: Validator<string> = (pw) => {
  const { requiredTestErrors, optionalTestErrors, strong } = owasp.test(pw)

  return {
    errors: requiredTestErrors,
    warnings: optionalTestErrors,
    passes: strong,
  }
}

const minUsernameLength = 6
const maxUsernameLength = 32
const validUsernameCharacters = /^[a-zA-Z0-9\-\.]*$/

export const usernameTests: SyncValidatorFunction<string>[] = [
  (username) => {
    if (!validUsernameCharacters.test(username)) {
      return 'Username must only contain letters, numbers, dashes "-", or periods "."'
    }
  },
  (username) => {
    if (username.length < minUsernameLength) {
      return `Username must be at least ${minUsernameLength} characters long`
    }
  },
  (username) => {
    if (username.length > maxUsernameLength) {
      return `Username cannot be longer than ${maxUsernameLength} characters long`
    }
  },
]

export const verifyUsername = makeValidator({
  required: usernameTests,
})

const emailRgx = /^[a-zA-Z0-9\.!#$%&'*+/=?^_`{|}~;\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/
export const emailTests: SyncValidatorFunction<string>[] = [
  (email) => {
    if (!emailRgx.test(email)) {
      return 'Please use a valid email address'
    }
  },
]

export const verifyEmail = makeValidator({
  required: emailTests,
})
