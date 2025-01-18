'use client'

import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

import AuthTokenPayload from '@/types/AuthTokenPayload'

import { setAuthState } from '@/store/authSlice'
import SubmitButton from '@/components/ui/SubmitBotton'

const UserDropdown = () => {
  const [user, setUser] = useState<{
    email: string | undefined
    name: string | undefined
  }>()
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const getUserFromToken = () => {
    const token = Cookies.get('authToken')

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

  useEffect(() => {
    getUserFromToken()

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      )
        setDropdownOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    Cookies.remove('authToken')

    router.refresh()

    dispatch(setAuthState(false))
  }

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen)

  return (
    <div className="relative ml-6">
      <button
        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-primary-dark text-white"
        onClick={toggleDropdown}
      >
        {user?.name?.[0].toUpperCase()}
      </button>

      {isDropdownOpen && user && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-background dark:bg-background-dark shadow-lg font-semibold rounded-2xl p-7 pt-5 break-words"
        >
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
