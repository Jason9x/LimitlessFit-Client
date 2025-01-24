import { Item } from '@/types/item'

export type OrderItemRequest = {
  itemId: number
  quantity: number
}

export type OrderRequest = {
  customerName: string
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
