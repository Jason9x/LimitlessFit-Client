import axios, { AxiosInstance } from 'axios'

import { fetchNewTokens } from '@/api/services/auth'

import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setTokens
} from '@/utils/cookieUtils'

const logoutUser = () => {
  removeTokens()

  if (typeof window !== 'undefined') window.location.pathname = '/'
}

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
  })

  instance.interceptors.request.use(config => {
    const token = getAccessToken()

    if (!token || !config.headers) return config

    config.headers.Authorization = `Bearer ${token}`

    return config
  })

  instance.interceptors.response.use(
    response => response,
    async error => {
      const { response: { status } = {}, config: originalRequest } = error

      if (status !== 401 || originalRequest._retry) return Promise.reject(error)

      originalRequest._retry = true

      try {
        const refreshTokenFromCookie = getRefreshToken()

        if (!refreshTokenFromCookie) {
          logoutUser()

          return Promise.reject(error)
        }

        const { accessToken, refreshToken } = await fetchNewTokens()

        setTokens(String(accessToken), String(refreshToken))

        if (originalRequest.headers)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`

        return instance(originalRequest)
      } catch (refreshError) {
        logoutUser()

        return Promise.reject(refreshError)
      }
    }
  )

  return instance
}

const index = createApiClient()

export default index
