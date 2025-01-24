'use client'

import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import { setAuthState } from '@/store/slices/authSlice'
import useUser from '@/hooks/useUser'

import SubmitButton from '@/components/buttons/SubmitBotton'
import useClickOutside from '@/hooks/useClickOutside'

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  const user = useUser()

  const ref = useRef<HTMLDivElement | null>(null)

  useClickOutside([ref], () => setIsOpen(false))

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
        <div className="absolute bg-background dark:bg-background-dark z-[9999] right-0 mt-2 w-48  shadow-lg font-semibold rounded-2xl p-7 pt-5 break-words">
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
