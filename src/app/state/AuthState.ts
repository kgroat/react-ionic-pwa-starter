
export interface AuthState {
  token: string | null
}

export const DEFAULT_STATE: AuthState = {
  token: null,
}
