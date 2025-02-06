import { AxiosResponse } from 'axios'
import api from '@/api'
import AuthTokenPayload from '@/types/auth-token-payload'
import AxiosErrorWithMessageKey from '@/types/axios-error'

type Credentials = {
  email: string
  password: string
}

type RegisterFormData = Credentials & {
  name: string
}

type LoginFormData = Credentials

const handleAuthRequest = async (url: string, formData: Credentials) => {
  try {
    const { data: payload }: AxiosResponse<AuthTokenPayload> = await api.post(
      url,
      formData
    )
    const { accessToken, refreshToken } = payload

    return { accessToken, refreshToken }
  } catch (error) {
    const { messageKey } = error as AxiosErrorWithMessageKey
    throw new Error(messageKey)
  }
}

export const registerUser = async (formData: RegisterFormData) =>
  handleAuthRequest('/Auth/register', formData)

export const loginUser = async (formData: LoginFormData) =>
  handleAuthRequest('/Auth/login', formData)

export const fetchNewTokens = async () => {
  const { data: payload }: AxiosResponse<AuthTokenPayload> = await api.post(
    '/Auth/refresh-token'
  )
  const { accessToken, refreshToken } = payload

  return { accessToken, refreshToken }
}
