import axios, { AxiosInstance } from 'axios'
import Cookies from 'js-cookie'

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Cookies.get('jwtToken')}`
  },
  withCredentials: true
})

api.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export default api
