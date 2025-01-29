import api from '@/api/api'

import { ItemsResponse } from '@/types/item'
import { PaginationParams } from '@/types/pagination'

export const fetchItems = async ({
  pageNumber,
  pageSize
}: PaginationParams) => {
  try {
    const response = await api.get<ItemsResponse>('/items', {
      params: {
        pageNumber,
        pageSize
      }
    })

    return response.data
  } catch (error) {
    throw error
  }
}
