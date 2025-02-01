'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { RegisterForm } from '@/components/auth/AuthForm'

const Register = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )

  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  return <>{!isAuthenticated && <RegisterForm />}</>
}

export default Register
