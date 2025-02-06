'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'

import { RootState } from '@/store'

import getServerHealth from '@/api/serverHealth'

import { LoginForm } from '@/components/auth/AuthForm'
import BackButton from '@/components/buttons/BackButton'
import Snackbar from '@/components/ui/Snackbar'

import useUser from '@/hooks/useUser'
import { setRole } from '@/store/slices/authSlice'

const ProtectedContent = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const pathname = usePathname()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const translations = useTranslations('ProtectedContent')
  const dispatch = useDispatch()
  const user = useUser()

  const { isError } = useQuery({
    queryKey: ['serverHealth'],
    queryFn: getServerHealth,
    retry: 3,
    staleTime: 2000
  })

  useEffect(() => {
    if (isError) setSnackbarOpen(true)
  }, [isError])

  useEffect(() => {
    if (user) dispatch(setRole(user.roleId))
  }, [dispatch, user])

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
