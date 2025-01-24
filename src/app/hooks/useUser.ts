import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

import AuthTokenPayload from '@/types/auth-token-payload'

const useUser = () => {
  const [user, setUser] = useState<{ email?: string; name?: string }>()

  useEffect(() => {
    const token = Cookies.get('jwtToken')

    if (!token) return

    try {
      const {
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': name,
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress':
          email
      } = jwtDecode<AuthTokenPayload>(token)
      setUser({ name, email })
    } catch (error) {
      console.error('Failed to decode JWT:', error)
    }
  }, [])

  return user
}

export default useUser
