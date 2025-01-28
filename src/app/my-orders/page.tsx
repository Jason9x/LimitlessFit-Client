'use client'

import { fetchMyOrders } from '@/services/api/orders'

import OrdersTable from '@/components/orders/table/OrdersTable'

const MyOrders = () => (
  <OrdersTable fetchOrders={fetchMyOrders} isMyOrders={true} />
)

export default MyOrders
