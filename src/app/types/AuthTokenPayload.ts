type AuthTokenPayload = {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string
  jti?: string
  exp?: number
  iss?: string
  aud?: string

  [claim: string]: string | number | undefined
}

export default AuthTokenPayload
