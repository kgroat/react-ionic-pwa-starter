
import { makeAsyncValidator } from 'shared/validation'
import { User } from 'models/user'

import { GET } from 'redux-store/api'

export { verifyPassword, verifyUsername, verifyEmail } from 'shared/validation/user'

export const verifyUsernameDoesntExists = makeAsyncValidator<string>({
  required: [async (username) => {
    try {
      await GET<User>(`/user/${username}`)
      return `Username "${username}" taken`
    } catch (err) {
      // Do nothing, the username does not already exist
    }
  }],
})

export const verifyEmailNotTaken = makeAsyncValidator<string>({
  required: [async (email) => {
    // Make request to check if email is taken
    if (!email) {
      return 'A user with that email already exists'
    }
  }]
})
