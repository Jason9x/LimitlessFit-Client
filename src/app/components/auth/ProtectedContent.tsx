'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'

import { RootState } from '@/store'

import getServerHealth from '@/api/serverHealth'

import { LoginForm } from '@/components/auth/AuthForm'
import BackButton from '@/components/buttons/BackButton'
import Snackbar from '@/components/ui/Snackbar'

const ProtectedContent = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const pathname = usePathname()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const translations = useTranslations('ProtectedContent')

  const { isError } = useQuery({
    queryKey: ['serverHealth'],
    queryFn: getServerHealth,
    retry: 3,
    staleTime: 2000
  })

  useEffect(() => {
    if (isError) setSnackbarOpen(true)
  }, [isError])

  if (isError)
    return (
      <Snackbar
        message={translations('serverUnreachable')}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        variant="error"
      />
    )

  if (!isAuthenticated && pathname !== '/register') return <LoginForm />

  return (
    <>
      {isAuthenticated && pathname !== '/' && <BackButton />}

      {children}
    </>
  )
}

export default ProtectedContent
