import api from '@/services/api/api'

import { Order, OrderRequest, OrdersResponse } from '@/types/order'
import { AxiosError } from 'axios'

import AxiosErrorWithMessageKey from '@/types/axios-error'
import { PaginationParams } from '@/types/pagination'

export const createOrder = async (request: OrderRequest) => {
  try {
    const { data } = await api.post<Order>('/Orders', request)

    return data
  } catch (error) {
    throw error
  }
}

export const fetchOrderById = async (id: number) => {
  try {
    const { data } = await api.get<Order>(`/Orders/${id}`)

    return data
  } catch (error) {
    const { messageKey } = (error as AxiosError).response
      ?.data as AxiosErrorWithMessageKey

    throw new Error(messageKey)
  }
}

export const fetchMyOrders = async ({
  pageNumber,
  pageSize
}: PaginationParams) => {
  try {
    const { data } = await api.get<OrdersResponse>('/Orders/my-orders', {
      params: {
        pageNumber,
        pageSize
      }
    })

    return data
  } catch (error) {
    throw error
  }
}
