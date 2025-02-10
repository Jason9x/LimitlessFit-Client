import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import useSignalR from '@/hooks/useSignalR'

import { adjustStatusCount, checkOrderAgainstFilters } from '@/utils/orderUtils'

import { ORDERS_PAGE_SIZE } from '@/constants/pagination'

import {
  OrderType,
  OrderFilterType,
  OrdersResponse,
  OrderStatusEnum,
  OrderStats
} from '@/types/models/order'

const useOrderUpdates = (
  queryKey: (string | number | OrderFilterType | null)[],
  filter: OrderFilterType | null
) => {
  const queryClient = useQueryClient()
  const queryKeyRef = useRef(queryKey)
  const filterRef = useRef(filter)

  useEffect(() => {
    queryKeyRef.current = queryKey
    filterRef.current = filter

    queryClient.invalidateQueries({ queryKey }).then()
  }, [queryKey, filter, queryClient])

  const handleOrderAdd = async (order: OrderType) => {
    await queryClient.cancelQueries({ queryKey: queryKeyRef.current })

    queryClient.setQueryData<OrdersResponse>(
      queryKeyRef.current,
      previousData => {
        if (!previousData) return previousData

        if (
          previousData.orders.some(
            existingOrder => existingOrder.id === order.id
          )
        )
          return previousData

        if (checkOrderAgainstFilters(order, filterRef.current)) {
          const updatedOrders = [order, ...previousData.orders].slice(
            0,
            ORDERS_PAGE_SIZE
          )

          return { ...previousData, orders: updatedOrders }
        }

        return previousData
      }
    )

    updateOrderStats(queryClient, null, order.status, order.date)
  }

  const handleStatusUpdate = async ({
    id,
    previousStatus,
    status,
    date
  }: {
    id: number
    previousStatus: OrderStatusEnum
    status: OrderStatusEnum
    date: string
  }) => {
    await queryClient.cancelQueries({ queryKey: queryKeyRef.current })

    const previousData = queryClient.getQueryData<OrdersResponse>(
      queryKeyRef.current
    )

    if (!previousData) return

    const updatedOrders = previousData.orders
      .map(order => {
        if (order.id !== id) return order

        const updatedOrder = { ...order, status }

        return checkOrderAgainstFilters(updatedOrder, filterRef.current)
          ? updatedOrder
          : null
      })
      .filter((order): order is OrderType => order !== null)

    queryClient.setQueryData(queryKeyRef.current, {
      ...previousData,
      orders: updatedOrders
    })

    updateOrderStats(queryClient, previousStatus, status, date)
  }

  return useSignalR('/orderUpdateHub', [
    { eventName: 'AddNewOrder', callback: handleOrderAdd },
    { eventName: 'ReceivedOrderStatusUpdate', callback: handleStatusUpdate }
  ])
}

const updateOrderStats = (
  queryClient: QueryClient,
  previousStatus: OrderStatusEnum | null,
  newStatus: OrderStatusEnum,
  deliveryDate?: string
) => {
  queryClient.setQueryData<OrderStats>(['stats'], cachedStats => {
    const stats = cachedStats ?? {
      deliveredToday: 0,
      pendingOrders: 0,
      shippingOrders: 0
    }

    if (previousStatus !== null) adjustStatusCount(stats, previousStatus, -1)

    if (newStatus !== OrderStatusEnum.Processing)
      adjustStatusCount(stats, newStatus, 1, deliveryDate)

    return stats
  })
}

export default useOrderUpdates
