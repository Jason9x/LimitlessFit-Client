import { useQueryClient } from '@tanstack/react-query'

import useSignalR from '@/hooks/useSignalR'

import { UsersResponse, Role, User } from '@/types/models/user'

import { USERS_PAGE_SIZE } from '@/constants/pagination'

type UseUsersSignalRProps = {
  searchTerm: string
  currentPage: number
}

export const useUsersSignalR = ({
  searchTerm,
  currentPage
}: UseUsersSignalRProps) => {
  const queryClient = useQueryClient()
  const queryKey = ['users', searchTerm, currentPage, USERS_PAGE_SIZE]

  useSignalR('/userHub', [
    {
      eventName: 'RoleUpdated',
      callback: (userId: number, roleId: Role) => {
        queryClient.setQueryData<UsersResponse>(queryKey, cachedData => {
          if (!cachedData) return cachedData

          return {
            ...cachedData,
            users: cachedData.users
              .map(user => (user.id === userId ? { ...user, roleId } : user))
              .sort((userA, userB) => {
                const roleCompare =
                  userA.roleId === Role.Admin
                    ? -1
                    : userB.roleId === Role.Admin
                      ? 1
                      : 0

                return roleCompare !== 0
                  ? roleCompare
                  : (userA.name ?? '').localeCompare(userB.name ?? '')
              })
          }
        })
      }
    },
    {
      eventName: 'UserAdded',
      callback: (newUser: User) => {
        queryClient.setQueryData<UsersResponse>(queryKey, cachedData => {
          if (!cachedData) return cachedData

          return {
            ...cachedData,
            users: [newUser, ...cachedData.users]
          }
        })
      }
    }
  ])
}

export default useUsersSignalR
