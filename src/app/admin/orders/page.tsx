'use client'

import { fetchAllOrders } from '@/services/api/orders'

import OrdersTable from '@/components/orders/table/OrdersTable'

const OrdersPanel = () => <OrdersTable fetchOrders={fetchAllOrders} />

export default OrdersPanel
