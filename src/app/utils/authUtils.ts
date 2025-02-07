import { jwtDecode } from 'jwt-decode'

import AuthTokenPayload from '@/types/auth-token-payload'

export const decodeUserFromToken = (token: string) => {
  try {
    const decoded = jwtDecode<AuthTokenPayload>(token)

    return {
      id: Number(
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ]
      ),
      name: decoded[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
      ],
      email:
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ]
    }
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return
  }
}
