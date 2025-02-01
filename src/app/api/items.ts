import api from '@/api/api'

import { ItemsResponse } from '@/types/models/item'
import { PaginationParams } from '@/types/pagination'

export const fetchItems = async ({
  pageNumber,
  pageSize
}: PaginationParams) => {
  const { data: items } = await api.get<ItemsResponse>('/items', {
    params: { pageNumber, pageSize }
  })

  return items
}
