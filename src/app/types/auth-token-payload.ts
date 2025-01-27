type AuthTokenPayload = {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string

  jti?: string
  exp?: number
  iss?: string
  aud?: string

  [claim: string]: string | number | undefined
}

export default AuthTokenPayload
