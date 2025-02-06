'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ChangeEvent, useState, useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

import { fetchUsers, updateUserRole } from '@/api/services/users'

import useSignalR from '@/hooks/useSignalR'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Pagination from '@/components/ui/Pagination'
import Snackbar from '@/components/ui/Snackbar'
import RoleDropdown from '@/components/dropdowns/RoleDropdown'

import { setRole } from '@/store/slices/authSlice'

import { User, UsersResponse } from '@/types/models/user'

const ITEMS_PER_PAGE = 4

const UsersPanel = () => {
  const translations = useTranslations('UsersPanel')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  )
  const searchInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    variant: 'error' | 'info' | 'success'
  }>({ open: false, message: '', variant: 'info' })

  const {
    data: paginatedUsers,
    isLoading,
    error
  } = useQuery<UsersResponse>({
    queryKey: ['users', searchTerm, currentPage, ITEMS_PER_PAGE],
    queryFn: () =>
      fetchUsers({
        pageNumber: currentPage,
        searchTerm,
        pageSize: ITEMS_PER_PAGE
      })
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) =>
      updateUserRole(userId, roleId),
    onSuccess: async (_, { userId, roleId }) => {
      queryClient.setQueryData<UsersResponse>(
        ['users', searchTerm, currentPage, ITEMS_PER_PAGE],
        cachedUsers => {
          if (!cachedUsers) return cachedUsers

          return {
            ...cachedUsers,
            users: cachedUsers.users.map(user =>
              user.id === userId ? { ...user, roleId } : user
            )
          }
        }
      )

      dispatch(setRole(roleId))

      setSnackbar({
        open: true,
        message: translations('roleUpdatedSuccessfully'),
        variant: 'success'
      })
    },
    onError: (_, __, context) =>
      queryClient.setQueryData(
        ['users', searchTerm, currentPage, ITEMS_PER_PAGE],
        context?.previousUsers
      ),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['users', searchTerm, currentPage, ITEMS_PER_PAGE]
      })

      const previousUsers = queryClient.getQueryData<UsersResponse>([
        'users',
        searchTerm,
        currentPage,
        ITEMS_PER_PAGE
      ])

      return { previousUsers }
    }
  })

  useSignalR('/userHub', [
    {
      eventName: 'RoleUpdated',
      callback: (userId: number, roleId: number) =>
        queryClient.setQueryData<UsersResponse>(
          ['users', searchTerm, currentPage, ITEMS_PER_PAGE],
          cachedUsers => {
            if (!cachedUsers) return cachedUsers

            return {
              ...cachedUsers,
              users: cachedUsers.users.map(user =>
                user.id === userId ? { ...user, roleId } : user
              )
            }
          }
        )
    },
    {
      eventName: 'UserAdded',
      callback: (user: User) => {
        console.log('aaa')
        queryClient.setQueryData<UsersResponse>(
          ['users', searchTerm, currentPage, ITEMS_PER_PAGE],
          cachedUsers => {
            if (!cachedUsers) return cachedUsers

            return {
              ...cachedUsers,
              users: [user, ...cachedUsers.users]
            }
          }
        )
      }
    }
  ])

  useEffect(() => {
    if (error)
      setSnackbar({ open: true, message: error.message, variant: 'error' })
  }, [error])

  useEffect(() => searchInputRef.current?.focus(), [paginatedUsers])

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

  const handleRoleChange = (userId: number, roleId: number) =>
    updateRoleMutation.mutate({ userId, roleId })

  const handleToggleDropdown = (index: number) =>
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="m-10">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <p className="text-xl font-semibold">{translations('title')}</p>

        <div className="relative w-fit mt-4 sm:mt-0">
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

      {paginatedUsers?.users.length ? (
        <ul className="mb-2">
          {paginatedUsers.users.map(({ id, name, email, roleId }, index) => (
            <li
              key={id}
              className="flex flex-col sm:flex-row justify-between items-center px-5 py-3
                         mb-6 bg-secondary dark:bg-secondary-dark max-w-lg shadow-md shadow-secondary
                       dark:shadow-secondary-dark rounded-2xl"
            >
              <div className="flex items-center mb-3 sm:mb-0">
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

              <RoleDropdown
                role={roleId}
                onRoleChange={roleId => handleRoleChange(id ?? -1, roleId)}
                isOpen={openDropdownIndex === index}
                toggleDropdown={() => handleToggleDropdown(index)}
              />
            </li>
          ))}

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedUsers?.totalPages}
            onPageChange={handlePageChange}
          />
        </ul>
      ) : (
        <p className="text-center text-sm text-foreground-secondary dark:text-foreground-secondary-dark">
          {translations('noUsersFound')}
        </p>
      )}

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
