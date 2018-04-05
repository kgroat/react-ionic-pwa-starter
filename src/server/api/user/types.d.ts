
import { User } from 'models/user'
export { UpdateRequest } from 'services/userService'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  verifyPassword: string
}

export interface RegisterResponse {
  user: User
  token: string
}

export interface TokenResponse {
  token: string
}

export interface VerificationResponse {
  success: boolean
}
