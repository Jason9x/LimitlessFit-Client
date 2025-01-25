import { Item } from '@/types/item'
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

type OrderItem = {
  id: number
  orderId: number
  order: Order
  itemId: number
  item: Item
  quantity: number
}

export type Order = {
  id: number
  customerName: string
  date: string
  totalPrice: number
  status: OrderStatusEnum
  items: {
    $values: OrderItem[]
  }
}

export type OrdersResponse = PaginationType & {
  orders: {
    $values: Order[]
  }
}
