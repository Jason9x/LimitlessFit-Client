import api from '@/services/api/api'

import { ItemsResponse } from '@/types/items'

export const fetchItems = async (pageNumber: number, pageSize: number) => {
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
