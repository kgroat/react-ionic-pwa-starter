
export { AppState } from './AppState'

export const DEFAULT_STATE: AppState = {
  auth: {
    token: null,
  },
  router: undefined,
  entities: {
    users: {},
  },
  ui: {
    usersList: {
      usernames: [],
    },
  },
}
