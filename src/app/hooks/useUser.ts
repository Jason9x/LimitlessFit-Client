import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

import AuthTokenPayload from '@/types/auth-token-payload'
import User from '@/types/models/user'

const useUser = () => {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const token = Cookies.get('jwtToken')

    if (!token) return

    try {
      const {
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': name,
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress':
          email,
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': role
      } = jwtDecode<AuthTokenPayload>(token)
      setUser({ name, email, role })
    } catch (error) {
      console.error('Failed to decode JWT:', error)
    }
  }, [])

  return user
}

export default useUser
