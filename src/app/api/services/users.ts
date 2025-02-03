import api from '@/api'

import { UserSearchRequest } from '@/types/user-search'
import { UserResponse } from '@/types/models/user'

export const fetchUsers = async ({
  pageNumber,
  pageSize,
  searchTerm
}: UserSearchRequest) => {
  const { data: users } = await api.get<UserResponse>('/Users', {
    params: { pageNumber, pageSize, searchTerm }
  })

  return users
}
