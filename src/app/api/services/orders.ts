import api from '@/api'

import AxiosErrorWithMessageKey from '@/types/axios-error'
import { PaginationParams } from '@/types/pagination'
import {
  OrderType,
  OrderFilterType,
  OrderRequest,
  OrdersResponse,
  OrderStatusEnum,
  OrderStats
} from '@/types/models/order'

export const createOrder = async (request: OrderRequest) => {
  const { data: order } = await api.post<OrderType>('/Orders', request)

  return order
}

export const fetchOrderById = async (id: number) => {
  try {
    const { data: order } = await api.get<OrderType>(`/Orders/${id}`)

    return order
  } catch (error) {
    const { messageKey } =
      (error as AxiosErrorWithMessageKey).response?.data || {}

    throw new Error(messageKey)
  }
}

export const fetchMyOrders = async (
  { pageNumber, pageSize }: PaginationParams,
  { startDate, endDate, status }: OrderFilterType
) => {
  const { data: orders } = await api.get<OrdersResponse>('/Orders/my-orders', {
    params: { pageNumber, pageSize, startDate, endDate, status }
  })

  return orders
}

export const fetchAllOrders = async (
  { pageNumber, pageSize }: PaginationParams,
  { startDate, endDate, status }: OrderFilterType
) => {
  const { data: orders } = await api.get<OrdersResponse>('/Orders/all', {
    params: { pageNumber, pageSize, startDate, endDate, status }
  })

  return orders
}

export const fetchOrderStats = async () => {
  const { data: stats } = await api.get<OrderStats>('/Orders/stats')

  return stats
}

export const updateOrderStatus = async (id: number, status: OrderStatusEnum) =>
  await api.patch(`/Orders/${id}/status`, status)
