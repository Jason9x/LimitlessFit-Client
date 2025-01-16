import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const jwt = Cookies.get('authToken')
    setIsAuthenticated(!!jwt)

    if (!jwt) router.push('/login').then(() => {})
  }, [router])

  return isAuthenticated
}

export default useAuth
