import { useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchUserRole } from '@/api/services/users'

import { getAccessToken } from '@/utils/cookieUtils'
import { decodeUserFromToken } from '@/utils/authUtils'

import { Role, User } from '@/types/models/user'

const useUser = () => {
  const queryClient = useQueryClient()
  const token = getAccessToken()

  const { data: user } = useQuery({
    queryKey: ['user', token],
    queryFn: async () => {
      if (!token) return

      const user = decodeUserFromToken(token)

      if (!user) return

      const role = await fetchUserRole(user.id)

      return { ...user, role }
    },
    enabled: !!token
  })

  const updateRole = (role: Role) =>
    queryClient.setQueryData<User | null>(['user', token], cachedUser =>
      cachedUser ? { ...cachedUser, role } : cachedUser
    )

  return { user, updateRole }
}

export default useUser
