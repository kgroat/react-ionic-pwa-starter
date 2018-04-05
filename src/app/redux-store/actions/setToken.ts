
import { Action } from 'redux'

export const type = 'SET_TOKEN'

interface Options {
  token: string | null
}

export type SetTokenAction = Options & Action

export default (options: Options): SetTokenAction => ({
  ...options,
  type,
})
