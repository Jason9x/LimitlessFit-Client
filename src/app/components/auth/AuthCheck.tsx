'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { LoginForm } from '@/components/auth/AuthForm'

const AuthCheck = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )

  const pathname = usePathname()

  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => setIsHydrated(true), [])
  if (!isHydrated || pathname === '/register' || pathname === '/login')
    return <>{children}</>

  return <>{isAuthenticated ? children : <LoginForm />}</>
}

export default AuthCheck
