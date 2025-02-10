import axios, { AxiosInstance } from 'axios'

import { fetchNewToken } from '@/api/services/auth'

import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setTokens
} from '@/utils/cookieUtils'

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
  })

  instance.interceptors.request.use(config => {
    const { headers } = config
    const token = getAccessToken()

    if (token && headers) headers.Authorization = `Bearer ${token}`

    return config
  })

  instance.interceptors.response.use(
    response => response,
    async error => {
      const { response: { status } = {}, config: originalRequest } = error
      if (status !== 401 || originalRequest._retry) return Promise.reject(error)

      originalRequest._retry = true

      try {
        const refreshToken = getRefreshToken()

        if (!refreshToken) {
          removeTokens()
          return Promise.reject(error)
        }

        const accessToken = await fetchNewToken()

        if (!accessToken) {
          removeTokens()
          return Promise.reject(error)
        }

        setTokens(String(accessToken), String(refreshToken))

        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        return instance(originalRequest)
      } catch (refreshError) {
        removeTokens()
        return Promise.reject(refreshError)
      }
    }
  )

  return instance
}

const apiClient = createApiClient()
export default apiClient
