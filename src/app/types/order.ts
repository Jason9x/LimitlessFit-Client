import { Item } from '@/types/item'
import { PaginationType } from '@/types/pagination'
import User from '@/types/user'

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

export type OrderItem = {
  id: number
  orderId: number
  order: Order
  itemId: number
  item: Item
  quantity: number
}

export type Order = {
  id: number
  user?: User
  date: string
  totalPrice: number
  status: OrderStatusEnum
  items: OrderItem[]
}

export type OrdersResponse = PaginationType & {
  orders: Order[]
}

export type OrderFilterType = {
  startDate?: string
  endDate?: string
  status?: OrderStatusEnum
}
