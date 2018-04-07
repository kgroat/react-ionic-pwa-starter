
import { RouterState } from 'react-router-redux'

import { AuthState, DEFAULT_STATE as auth } from './AuthState'
import { Entities, DEFAULT_STATE as entities } from './Entities'
import { UiState, DEFAULT_STATE as ui } from './UiState'

export interface AppState {
  router: RouterState
  auth: AuthState
  entities: Entities
  ui: UiState
}

export const DEFAULT_STATE: AppState = {
  router: undefined as any,
  auth,
  entities,
  ui,
}
