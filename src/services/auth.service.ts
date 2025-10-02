import { api } from '../utils/libs/axios'

const login = async (user: Record<string, any>) =>
  api.post('/v1/auth/login', user)

export const AuthService = {
  login
}
