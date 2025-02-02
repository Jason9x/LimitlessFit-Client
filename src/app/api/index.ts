import axios, { AxiosInstance, AxiosError } from 'axios'
import Cookies from 'js-cookie'

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
  })

  instance.interceptors.request.use(config => {
    const token = Cookies.get('jwtToken')

    if (!token || !config.headers) return config

    config.headers.Authorization = `Bearer ${token}`

    return config
  })

  instance.interceptors.response.use(
    response => response,
    ({ response, message }: AxiosError) => {
      if (response?.status !== 401)
        return Promise.reject(response?.data || message)

      Cookies.remove('jwtToken')

      if (typeof window !== 'undefined') window.location.pathname = '/'

      return Promise.reject('Session expired, please login again.')
    }
  )

  return instance
}

const index = createApiClient()
export default index
