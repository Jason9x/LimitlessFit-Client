import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

import Image from 'next/image'

import useClickOutside from '@/hooks/useClickOutside'
import useDropdownPosition from '@/hooks/useDropdownPosition'

import { Role } from '@/types/models/user'

type RoleDropdownProps = {
  role: Role
  onRoleChange: (roleId: number) => void
  isOpen: boolean
  toggleDropdown: () => void
}

const RoleDropdown = ({
  role,
  onRoleChange,
  isOpen,
  toggleDropdown
}: RoleDropdownProps) => {
  const translations = useTranslations('UsersPanel')
  const roleTranslations = useTranslations('Roles')

  const [selectedRole, setSelectedRole] = useState(role)
  const ref = useRef<HTMLDivElement | null>(null)
  const dropdownPosition = useDropdownPosition(ref)

  useClickOutside([ref], () => {
    if (isOpen) toggleDropdown()
  })

  useEffect(() => setSelectedRole(role), [role])

  const handleSelectRole = (role: Role) => {
    if (selectedRole === role) return toggleDropdown()

    setSelectedRole(role)
    onRoleChange(role)
    toggleDropdown()
  }

  const translateRole = (role: Role) =>
    roleTranslations(Role[role].toLowerCase())

  return (
    <div className="relative text-sm" ref={ref}>
      <button
        onClick={toggleDropdown}
        className="w-full bg-background dark:bg-background-dark px-5 py-1 rounded-full
                 hover:bg-gray-200 dark:hover:bg-gray-600 flex justify-between items-center"
      >
        <span>{translateRole(selectedRole)}</span>

        <div className="ml-2">
          <Image
            src="/icons/arrows/arrow-expand.svg"
            width={10}
            height={10}
            alt="Arrow expand"
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'} ease-out dark:invert`}
            priority
          />
        </div>
      </button>

      {isOpen && (
        <ul
          className={`absolute left-1/2 transform -translate-x-1/2 mt-2
                     bg-background dark:bg-background-dark rounded-xl shadow-md z-10 ${
                       dropdownPosition === 'top'
                         ? 'bottom-full mb-2'
                         : 'top-full mt-2'
                     }`}
        >
          {Object.keys(Role)
            .filter(key => isNaN(Number(key)))
            .map(key => {
              const role = Role[key as keyof typeof Role]

              return (
                <li
                  key={role}
                  onClick={() => handleSelectRole(role as Role)}
                  className="px-4 py-1 cursor-pointer hover:bg-gray-100
                           dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  {translateRole(role as Role)}
                </li>
              )
            })}
        </ul>
      )}
    </div>
  )
}

export default RoleDropdown
