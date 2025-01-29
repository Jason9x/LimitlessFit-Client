import api from '@/services/api/api'

import { AxiosError } from 'axios'

import AxiosErrorWithMessageKey from '@/types/axios-error'
import { PaginationParams } from '@/types/pagination'
import {
  OrderType,
  OrderFilterType,
  OrderRequest,
  OrdersResponse,
  OrderStatusEnum
} from '@/types/orderType'

export const createOrder = async (request: OrderRequest) => {
  try {
    const { data } = await api.post<OrderType>('/Orders', request)

    return data
  } catch (error) {
    throw error
  }
}

export const fetchOrderById = async (id: number) => {
  try {
    const { data } = await api.get<OrderType>(`/Orders/${id}`)

    return data
  } catch (error) {
    const { messageKey } = (error as AxiosError).response
      ?.data as AxiosErrorWithMessageKey

    throw new Error(messageKey)
  }
}

export const fetchMyOrders = async (
  { pageNumber, pageSize }: PaginationParams,
  { startDate, endDate, status }: OrderFilterType
) => {
  try {
    const { data } = await api.get<OrdersResponse>('/Orders/my-orders', {
      params: {
        pageNumber,
        pageSize,
        startDate,
        endDate,
        status
      }
    })

    return data
  } catch (error) {
    throw error
  }
}

export const fetchAllOrders = async (
  { pageNumber, pageSize }: PaginationParams,
  { startDate, endDate, status }: OrderFilterType
) => {
  try {
    const { data } = await api.get<OrdersResponse>('/Orders/all', {
      params: {
        pageNumber,
        pageSize,
        startDate,
        endDate,
        status
      }
    })

    return data
  } catch (error) {
    throw error
  }
}

export const updateOrderStatus = async (
  id: number,
  status: OrderStatusEnum
) => {
  try {
    await api.patch(`/Orders/${id}/status`, status)
  } catch (error) {
    throw error
  }
}
