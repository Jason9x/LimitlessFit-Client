import { Item } from '@/types/models/item'
import { PaginationType } from '@/types/pagination'

export type OrderRequest = {
  items: OrderItemRequest[]
}

export type OrderItemRequest = {
  itemId: number
  quantity: number
}

export type OrdersResponse = PaginationType & {
  orders: OrderType[]
}

export type OrderType = {
  id: number
  username: string
  date: string
  totalPrice: number
  status: OrderStatusEnum
  items: OrderItem[]
}

export enum OrderStatusEnum {
  Pending,
  Processing,
  Shipping,
  Delivered
}

export type OrderItem = Item & {
  quantity: number
}

export type OrderFilterType = {
  startDate?: string
  endDate?: string
  status?: OrderStatusEnum
}

export type OrderStats = {
  deliveredToday: number
  pendingOrders: number
  shippingOrders: number
}
