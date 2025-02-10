import { useTranslations } from 'next-intl'

import { isToday, parseISO } from 'date-fns'

import {
  OrderType,
  OrderFilterType,
  OrderStatusEnum,
  OrderStats
} from '@/types/models/order'

type TranslationFunction = ReturnType<typeof useTranslations<'OrderStatus'>>

export const getOrderStatusLabels = (translations: TranslationFunction) => ({
  [OrderStatusEnum.Pending]: translations('pending'),
  [OrderStatusEnum.Processing]: translations('processing'),
  [OrderStatusEnum.Shipping]: translations('shipping'),
  [OrderStatusEnum.Delivered]: translations('delivered')
})

export const checkOrderAgainstFilters = (
  order: OrderType,
  filter: OrderFilterType | null
): boolean => {
  if (!filter) return true

  const { status, startDate, endDate } = filter
  const orderDate = +new Date(order.date)

  return [
    !status || order.status === status,
    !startDate || orderDate >= +new Date(startDate),
    !endDate || orderDate <= +new Date(endDate)
  ].every(Boolean)
}

export const adjustStatusCount = (
  stats: OrderStats,
  status: OrderStatusEnum,
  delta: number,
  deliveryDate?: string
): void => {
  const statusMap: Partial<Record<OrderStatusEnum, keyof OrderStats>> = {
    [OrderStatusEnum.Delivered]: 'deliveredToday',
    [OrderStatusEnum.Pending]: 'pendingOrders',
    [OrderStatusEnum.Shipping]: 'shippingOrders'
  }

  const key = statusMap[status]

  if (!key) return

  if (
    status === OrderStatusEnum.Delivered &&
    deliveryDate &&
    !isToday(parseISO(deliveryDate))
  )
    return

  stats[key] = Math.max(0, stats[key] + delta)
}
