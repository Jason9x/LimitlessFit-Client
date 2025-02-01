import { AxiosError, AxiosResponse } from 'axios'

import api from '@/api/api'

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
    const { token } = payload

    return { token }
  } catch (error) {
    const { response } = error as AxiosError
    const { messageKey } = response?.data as AxiosErrorWithMessageKey

    throw new Error(messageKey)
  }
}

export const registerUser = async (formData: RegisterFormData) =>
  handleAuthRequest('/Auth/register', formData)

export const loginUser = async (formData: LoginFormData) =>
  handleAuthRequest('/Auth/login', formData)
