
export interface UiState {
  usersList: {
    usernames: string[],
  }
}

export const DEFAULT_STATE: UiState = {
  usersList: {
    usernames: [],
  },
}
