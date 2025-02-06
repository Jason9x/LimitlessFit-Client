import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

import AuthTokenPayload from '@/types/auth-token-payload'
import { User } from '@/types/models/user'

import { getAccessToken } from '@/utils/cookieUtils'

const useUser = () => {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const token = getAccessToken()

    if (!token) return

    try {
      const {
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': name,
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress':
          email,
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role':
          roleId = '0'
      } = jwtDecode<AuthTokenPayload>(token)

      setUser({ name, email, roleId: +roleId })
    } catch (error) {
      console.error('Failed to decode JWT:', error)
    }
  }, [])

  return user
}

export default useUser
