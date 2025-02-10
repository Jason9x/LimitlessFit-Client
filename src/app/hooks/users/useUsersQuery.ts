import { useQuery } from '@tanstack/react-query'
import { UsersResponse } from '@/types/models/user'
import { fetchUsers } from '@/api/services/users'
import { USERS_PAGE_SIZE } from '@/constants/pagination'

export const useUsersQuery = (searchTerm: string, currentPage: number) =>
  useQuery<UsersResponse>({
    queryKey: ['users', searchTerm, currentPage, USERS_PAGE_SIZE],
    queryFn: () =>
      fetchUsers({
        pageNumber: currentPage,
        searchTerm,
        pageSize: USERS_PAGE_SIZE
      }),
    staleTime: 60000
  })
