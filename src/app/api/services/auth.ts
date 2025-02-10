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

type ResetPasswordRequest = {
  email: string
  resetCode: string
  newPassword: string
}

const handleAuthRequest = async (url: string, formData: Credentials) => {
  try {
    const { data: payload }: AxiosResponse<AuthTokenPayload> = await api.post(
      url,
      formData
    )
    const { accessToken, refreshToken } = payload

    return { accessToken, refreshToken }
  } catch (error) {
    const { messageKey } =
      (error as AxiosErrorWithMessageKey).response?.data || {}

    throw new Error(messageKey)
  }
}

export const registerUser = async (formData: RegisterFormData) =>
  handleAuthRequest('/Auth/register', formData)

export const loginUser = async (formData: LoginFormData) =>
  handleAuthRequest('/Auth/login', formData)

export const fetchNewToken = async () => {
  const { data: payload }: AxiosResponse<AuthTokenPayload> = await api.post(
    '/Auth/refresh-token'
  )
  const { accessToken } = payload

  return accessToken
}

export const forgotPassword = async (email: string) => {
  try {
    const { data: response }: AxiosResponse<{ messageKey: string }> =
      await api.post('/Auth/forgot-password', { email })
    const { messageKey } = response

    return messageKey
  } catch (error) {
    const { messageKey } =
      (error as AxiosErrorWithMessageKey).response?.data || {}

    throw new Error(messageKey)
  }
}

export const resetPassword = async (request: ResetPasswordRequest) => {
  try {
    const { data: response }: AxiosResponse<{ messageKey: string }> =
      await api.post('/Auth/reset-password', {
        ...request
      })
    const { messageKey } = response

    return messageKey
  } catch (error) {
    const { messageKey } =
      (error as AxiosErrorWithMessageKey).response?.data || {}

    throw new Error(messageKey)
  }
}
