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

const handleAuthRequest = async (url: string, formData: Credentials) => {
  try {
    const response: AxiosResponse<AuthApiResponse> = await api.post(
      url,
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
    const errorResponse: AuthApiResponse | undefined =
      axiosError?.response?.data

    return { success: false, messageKey: errorResponse?.messageKey }
  }
}

export const registerUser = async (formData: RegisterFormData) =>
  handleAuthRequest('/Auth/register', formData)

export const loginUser = async (formData: LoginFormData) =>
  handleAuthRequest('/Auth/login', formData)
