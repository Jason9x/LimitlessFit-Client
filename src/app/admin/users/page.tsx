'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { ChangeEvent, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { fetchUsers } from '@/api/services/users'

import { UserResponse } from '@/types/models/user'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Pagination from '@/components/ui/Pagination'

const ITEMS_PER_PAGE = 4

const UsersPanel = () => {
  const translations = useTranslations('UsersPanel')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const {
    data: paginatedUsers,
    isLoading,
    error
  } = useQuery<UserResponse>({
    queryKey: ['users', searchTerm, currentPage, ITEMS_PER_PAGE],
    queryFn: () =>
      fetchUsers({
        pageNumber: currentPage,
        searchTerm,
        pageSize: ITEMS_PER_PAGE
      })
  })

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => setCurrentPage(page)

  const users = paginatedUsers?.users || []
  const totalPages = paginatedUsers?.totalPages || 1

  if (isLoading) return <LoadingSpinner />

  if (error) {
    console.error('Error fetching users:', error) // Log the error for debugging
    return <div>{translations('error')}</div> // Display an error message to the user
  }

  return (
    <div className="m-10">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold">{translations('title')}</p>

        <div className="relative w-fit">
          <input
            type="search"
            placeholder={translations('searchPlaceholder')}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-4 pr-10 py-2 rounded-full border bg-secondary dark:bg-secondary-dark border-none
                       text-sm focus:shadow-md focus:outline-none focus:ring-0 transition-all"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Image
              src="/icons/search.svg"
              alt="Search"
              width={20}
              height={20}
              className="dark:invert"
            />
          </div>
        </div>
      </div>

      <hr className="my-10 border-gray-300 dark:border-gray-600" />

      {users.map(user => (
        <li
          key={user.id}
          className="py-2 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div>
              <p className="font-medium">{user.name}</p> {/* User name */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>{' '}
              {/* User email */}
              {/* Add other user details as needed */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {translations('role')}: {user.role}
              </p>
            </div>
          </div>
        </li>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default UsersPanel
