'use client'

import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'

import { RootState } from '@/store'

import { LoginForm } from '@/components/auth/AuthForm'

const AuthCheck = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const pathname = usePathname()

  if (!isAuthenticated && pathname !== '/register') return <LoginForm />

  return <>{children}</>
}

export default AuthCheck
