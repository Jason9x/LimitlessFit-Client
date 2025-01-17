import { AxiosError, AxiosResponse } from 'axios'

import { AuthApiResponse } from '@/types/apiTypes'
import api from '@/services/api/api'

type Credentials = {
  email: string
  password: string
}

type RegisterFormData = Credentials & {
  name: string
}

type LoginFormData = Credentials

export const registerUser = async (formData: RegisterFormData) => {
  try {
    const response: AxiosResponse<AuthApiResponse> = await api.post(
      '/Auth/register',
      formData
    )

    const { messageKey, token } = response.data

    return {
      success: response.status === 200,
      messageKey,
      token
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<AuthApiResponse>

    const errorResponse: AuthApiResponse = axiosError?.response?.data || {
      messageKey: 'error'
    }

    return { success: false, messageKey: errorResponse.messageKey }
  }
}

export const loginUser = async (formData: LoginFormData) => {
  try {
    const response: AxiosResponse<AuthApiResponse> = await api.post(
      '/Auth/login',
      formData
    )

    const { messageKey, token } = response.data

    return {
      success: response.status === 200,
      messageKey,
      token
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<AuthApiResponse>

    const errorResponse: AuthApiResponse = axiosError?.response?.data || {
      messageKey: 'error'
    }

    return { success: false, messageKey: errorResponse.messageKey }
  }
}
