import { Item } from '@/types/models/item'
import { PaginationType } from '@/types/pagination'

export type OrderItemRequest = {
  itemId: number
  quantity: number
}

export type OrderRequest = {
  items: OrderItemRequest[]
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

export type OrderType = {
  id: number
  username: string
  date: string
  totalPrice: number
  status: OrderStatusEnum
  items: OrderItem[]
}

export type OrdersResponse = PaginationType & {
  orders: OrderType[]
}

export type OrderFilterType = {
  startDate?: string
  endDate?: string
  status?: OrderStatusEnum
}
