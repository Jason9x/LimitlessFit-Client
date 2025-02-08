'use client'

import { fetchAllOrders } from '@/api/services/orders'

import withAdminRedirect from '@/hoc/withAdminRedirect'

import OrdersTable from '@/components/orders/table/OrdersTable'

const OrdersPanel = () => <OrdersTable fetchOrders={fetchAllOrders} />

export default withAdminRedirect(OrdersPanel)
