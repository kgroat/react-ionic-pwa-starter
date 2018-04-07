
export interface PushKeyResponse {
  publicKey: string
}

export interface RegistrationRequest {
  subscription: PushSubscription
}

export interface RegistrationResponse {
  message: 'ok' | 'error'
  endpoint: string
}
