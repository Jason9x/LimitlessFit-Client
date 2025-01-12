import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Cookies from 'js-cookie'

const useAuth = () => {
  const router = useRouter()

  useEffect(() => {
    const jwt = Cookies.get('jwt')

    if (!jwt) router.push('/login').then(() => {})
  }, [router])

  return !!Cookies.get('jwt')
}

export default useAuth
