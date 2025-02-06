import api from '@/api'

import { UserSearchRequest } from '@/types/user-search'
import { UsersResponse } from '@/types/models/user'

export const fetchUsers = async ({
  pageNumber,
  pageSize,
  searchTerm
}: UserSearchRequest) => {
  const { data: users } = await api.get<UsersResponse>('/Users', {
    params: { pageNumber, pageSize, searchTerm }
  })

  return users
}

export const updateUserRole = async (id: number, roleId: number) =>
  await api.patch(`/Users/${id}/role`, roleId)
