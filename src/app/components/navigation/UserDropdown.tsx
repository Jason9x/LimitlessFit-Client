'use client'

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

import AuthTokenPayload from '@/types/auth-token-payload'

import { setAuthState } from '@/store/slices/authSlice'

import SubmitButton from '@/components/SubmitBotton'
import useClickOutside from '@/hooks/useClickOutside'

const UserDropdown = () => {
  const [user, setUser] = useState<{
    email: string | undefined
    name: string | undefined
  }>()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  const ref = useClickOutside(() => setIsOpen(false))

  const getUserFromToken = () => {
    const token = Cookies.get('jwtToken')

    if (!token) return

    try {
      const data = jwtDecode<AuthTokenPayload>(token)

      const name =
        data['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      const email =
        data[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ]

      setUser({
        name,
        email
      })
    } catch (error) {
      console.error('Failed to decode JWT:', error)
    }
  }

  useEffect(() => getUserFromToken(), [])

  const handleLogout = () => {
    Cookies.remove('jwtToken')

    router.refresh()

    dispatch(setAuthState(false))
  }

  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-primary-dark text-white"
        onClick={toggleDropdown}
      >
        {user?.name?.[0]?.toUpperCase() || 'U'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background dark:bg-background-dark shadow-lg font-semibold rounded-2xl p-7 pt-5 break-words">
          <p className="mb-1">{user?.name}</p>

          <p className="text-foreground-secondary dark:text-foreground-secondary-dark text-sm mb-4">
            {user?.email}
          </p>

          <hr className="mb-4" />

          <SubmitButton label="Logout" onClick={handleLogout} variant="thin" />
        </div>
      )}
    </div>
  )
}

export default UserDropdown
