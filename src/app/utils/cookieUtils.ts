import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export const setTokens = (accessToken: string, refreshToken: string) => {
  const isProduction = process.env.NODE_ENV === 'production'

  Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
    secure: isProduction,
    sameSite: 'Strict',
    expires: 1 / 24 // 1 hour in days.
  })

  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    secure: isProduction,
    sameSite: 'Strict',
    expires: 7 // 7 days.
  })
}

export const getAccessToken = (): string | undefined =>
  Cookies.get(ACCESS_TOKEN_KEY)

export const getRefreshToken = (): string | undefined =>
  Cookies.get(REFRESH_TOKEN_KEY)

export const removeTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
}
