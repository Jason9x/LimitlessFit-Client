'use client'

import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { RootState } from '@/store'

import getServerHealth from '@/api/serverHealth'

import { LoginForm } from '@/components/auth/AuthForm'

import BackButton from '@/components/buttons/BackButton'

const ProtectedContent = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const pathname = usePathname()
  const translations = useTranslations('ProtectedContent')

  const { isError } = useQuery({
    queryKey: ['serverHealth'],
    queryFn: getServerHealth,
    retry: 0,
    networkMode: 'always'
  })

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Image
          src="/icons/sad.png"
          alt="Error"
          width={35}
          height={35}
          className="mb-2"
          priority
        />

        <p className="text-md text-gray-700 text-center">
          {translations('serverUnreachable')}
        </p>
      </div>
    )

  const excludedPaths = ['/register', '/reset-password']

  if (!isAuthenticated && !excludedPaths.includes(pathname))
    return <LoginForm />

  return (
    <>
      {isAuthenticated && pathname !== '/' && <BackButton />}

      {children}
    </>
  )
}

export default ProtectedContent
