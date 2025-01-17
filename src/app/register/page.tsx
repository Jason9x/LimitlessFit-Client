'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { RegisterForm } from '@/components/auth/AuthForm'

const Register = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )

  const [isHydrated, setIsHydrated] = useState(false)
  const router = useRouter()

  useEffect(() => setIsHydrated(true), [])

  useEffect(() => {
    if (isHydrated && isAuthenticated) router.push('/')
  }, [isHydrated, isAuthenticated, router])

  if (!isHydrated) return null

  return <>{!isAuthenticated && <RegisterForm />}</>
}

export default Register
