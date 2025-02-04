'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ChangeEvent, useState, useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchUsers, updateUserRole } from '@/api/services/users'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Pagination from '@/components/ui/Pagination'
import Snackbar from '@/components/ui/Snackbar'
import { Role, UserResponse } from '@/types/models/user'

const ITEMS_PER_PAGE = 4
const ROLES = Object.values(Role)

const UsersPanel = () => {
  const translations = useTranslations('UsersPanel')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    variant: 'error' | 'info' | 'success'
  }>({ open: false, message: '', variant: 'info' })

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

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: Role }) =>
      updateUserRole(userId, role),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users', searchTerm, currentPage, ITEMS_PER_PAGE]
      })

      setSnackbar({
        open: true,
        message: translations('roleUpdatedSuccessfully'),
        variant: 'success'
      })
    },
    onError: (error: any) => {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || translations('roleUpdateFailed'),
        variant: 'error'
      })
    }
  })

  const handleRoleChange = (userId: number, role: Role) => {
    updateRoleMutation.mutate({ userId, role })
  }

  const translateRole = (role: Role) => translations(`roles.${role}`)

  useEffect(() => {
    if (error)
      setSnackbar({ open: true, message: error.message, variant: 'error' })
  }, [error])

  useEffect(() => {
    if (paginatedUsers?.users?.length === 0)
      setSnackbar({
        open: true,
        message: translations('noUsersFound'),
        variant: 'info'
      })
  }, [paginatedUsers?.users, translations])

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [paginatedUsers])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setCurrentPage(1)
    searchInputRef.current?.focus()
  }

  const handlePageChange = (page: number) => setCurrentPage(page)

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="m-10">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold">{translations('title')}</p>

        <div className="relative w-fit">
          <input
            ref={searchInputRef}
            type="search"
            placeholder={translations('searchPlaceholder')}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-4 pr-10 py-2 rounded-full border bg-secondary dark:bg-secondary-dark border-none
             text-sm focus:shadow-md focus:outline-none focus:ring-0 transition-all
             [-webkit-appearance:none] [&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {searchTerm ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <Image
                  src="/icons/close.svg"
                  alt="Clear search"
                  width={20}
                  height={20}
                  className="dark:invert opacity-70"
                />
              </button>
            ) : (
              <Image
                src="/icons/search.svg"
                alt="Search"
                width={20}
                height={20}
                className="dark:invert opacity-70"
              />
            )}
          </div>
        </div>
      </div>

      <hr className="my-10 border-gray-300 dark:border-gray-600" />

      <ul className="mb-2">
        {paginatedUsers?.users.map(({ id, name, email, role }) => (
          <li
            key={id}
            className="px-5 py-3 mb-6 bg-secondary dark:bg-secondary-dark flex items-center justify-between
                     max-w-lg shadow-md shadow-secondary dark:shadow-secondary-dark rounded-2xl"
          >
            <div className="flex items-center">
              <div
                className="flex items-center justify-center w-8 h-8 mr-3 rounded-full
                            bg-primary dark:bg-primary-dark text-white"
              >
                {name?.[0]?.toUpperCase()}
              </div>

              <div>
                <p>{name}</p>

                <p className="text-sm text-foreground-secondary dark:text-foreground-secondary-dark">
                  {email}
                </p>
              </div>
            </div>

            <div className="relative">
              <select
                value={role}
                onChange={event =>
                  handleRoleChange(id ?? -1, event.target.value as Role)
                }
                className="appearance-none bg-transparent border-none text-sm pr-6 cursor-pointer focus:ring-0"
                disabled={updateRoleMutation.isPending}
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>
                    {translateRole(role)}
                  </option>
                ))}
              </select>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                <Image
                  src="/icons/arrows/arrow-expand.svg"
                  width={16}
                  height={16}
                  alt=""
                  className="dark:invert"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalPages={paginatedUsers?.totalPages}
        onPageChange={handlePageChange}
      />

      <Snackbar
        message={snackbar.message}
        open={snackbar.open}
        onClose={() =>
          setSnackbar(previousState => ({ ...previousState, open: false }))
        }
        variant={snackbar.variant}
      />
    </div>
  )
}

export default UsersPanel
