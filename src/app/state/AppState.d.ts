
import { RouterState } from 'react-router-redux'

import { AuthState } from './AuthState'
import { Entities } from './Entities'
import { UiState } from './UiState'

export interface AppState {
  auth: AuthState
  router: RouterState
  entities: Entities
  ui: UiState
}
