import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateUserRole } from '@/api/services/users'

import {
  updateUserRoleInArray,
  sortUsersByRoleAndName
} from '@/utils/userUtils'

import { USERS_PAGE_SIZE } from '@/constants/pagination'

import { UsersResponse, Role } from '@/types/models/user'

export const useUsersMutation = (searchTerm: string, currentPage: number) => {
  const queryClient = useQueryClient()
  const queryKey = ['users', searchTerm, currentPage, USERS_PAGE_SIZE]

  const performOptimisticUpdate = async (userId: number, newRole: Role) => {
    await queryClient.cancelQueries({ queryKey })

    const previousUsers = queryClient.getQueryData<UsersResponse>(queryKey)

    if (!previousUsers) return { previousUsers: undefined }

    const updatedUsers = updateUserRoleInArray(
      previousUsers.users,
      userId,
      newRole
    )
    const sortedUsers = sortUsersByRoleAndName(updatedUsers)

    queryClient.setQueryData(queryKey, {
      ...previousUsers,
      users: sortedUsers
    })

    return { previousUsers }
  }

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: Role }) =>
      updateUserRole(userId, roleId),
    onMutate: async ({ userId, roleId }) =>
      performOptimisticUpdate(userId, roleId),
    onError: (_, __, context) => {
      if (context?.previousUsers)
        queryClient.setQueryData(queryKey, context.previousUsers)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
