import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

import useSignalR from '@/hooks/useSignalR'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Snackbar from '@/components/ui/Snackbar'
import Pagination from '@/components/ui/Pagination'

import OrdersFilter from '../OrdersFilter'
import OrderRow from './OrderRow'
import OrdersTableHeader from './OrdersTableHeader'

import {
  OrderType,
  OrderFilterType,
  OrdersResponse,
  OrderStatusEnum
} from '@/types/models/order'
import { PaginationParams } from '@/types/pagination'

const PAGE_SIZE = 4

type OrdersTableProps = {
  fetchOrders: (
    params: PaginationParams,
    filter: OrderFilterType
  ) => Promise<OrdersResponse>
  isMyOrders?: boolean
}

const OrdersTable = ({ fetchOrders, isMyOrders = false }: OrdersTableProps) => {
  const translations = useTranslations(isMyOrders ? 'MyOrders' : 'OrdersPanel')
  const tableTranslations = useTranslations('OrdersTable')

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false)
  const [statusUpdateSnackbarOpen, setStatusUpdateSnackbarOpen] =
    useState<boolean>(false)

  const [currentPage, setCurrentPage] = useState<number>(1)

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [orders, setOrders] = useState<OrderType[]>([])

  const filterFromUrl: OrderFilterType | null = searchParams.get('filter')
    ? JSON.parse(searchParams.get('filter') as string)
    : null
  const [filter, setFilter] = useState<OrderFilterType | null>(filterFromUrl)

  const {
    data: paginatedOrders,
    isLoading,
    error
  } = useQuery({
    queryKey: [isMyOrders ? 'my-orders' : 'all', currentPage, filter],
    queryFn: () =>
      fetchOrders(
        {
          pageNumber: currentPage,
          pageSize: PAGE_SIZE
        },
        filter || {}
      )
  })

  console.log({ paginatedOrders })

  const totalPages = paginatedOrders?.totalPages || 1

  useSignalR('/orderUpdateHub', [
    {
      eventName: 'ReceiveOrderUpdate',
      callback: (updatedOrder: OrderType) =>
        setOrders(previousOrders =>
          previousOrders.map(order =>
            order.id === updatedOrder.id ? { ...updatedOrder } : order
          )
        )
    },
    {
      eventName: 'ReceiveOrderStatusUpdate',
      callback: (orderId: number, status: OrderStatusEnum) => {
        setOrders(previousOrders =>
          previousOrders.map(order =>
            order.id === orderId ? { ...order, status } : order
          )
        )

        setStatusUpdateSnackbarOpen(true)
      }
    }
  ])

  useEffect(() => {
    if (error || orders.length === 0) setErrorSnackbarOpen(true)
  }, [error, orders])

  useEffect(() => {
    if (paginatedOrders) setOrders(paginatedOrders.orders)
  }, [paginatedOrders])

  const handleFilterChange = (filter: OrderFilterType) => {
    setFilter(filter)
    setCurrentPage(1)

    const newSearchParams = new URLSearchParams(window.location.search)
    newSearchParams.set('filter', JSON.stringify(filter))

    router.push(`${pathname}?${newSearchParams.toString()}`)
  }

  const handlePageChange = (page: number) => setCurrentPage(page)

  const handleToggleExpand = (orderId: number) =>
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)

  if (isLoading) return <LoadingSpinner />

  if (error)
    return (
      <Snackbar
        message={translations(error.message)}
        open={errorSnackbarOpen}
        onClose={() => setErrorSnackbarOpen(false)}
        variant="error"
      />
    )

  return (
    <div className="m-10">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">
          {translations(isMyOrders ? 'orderHistory' : 'title')}
        </h1>

        <OrdersFilter onFilterChange={handleFilterChange} />
      </div>

      <hr className="my-10 border-gray-300 dark:border-gray-600" />

      {orders.length === 0 && (
        <Snackbar
          message={translations(isMyOrders ? 'noOrders' : 'noOrderFound')}
          open={errorSnackbarOpen}
          onClose={() => setErrorSnackbarOpen(false)}
          variant="info"
        />
      )}

      {orders.length > 0 && (
        <div className="space-y-6">
          <table
            className="min-w-full shadow-md rounded-xl shadow-secondary dark:shadow-secondary-dark
                 bg-secondary dark:bg-secondary-dark table-auto border-collapse"
          >
            <OrdersTableHeader isMyOrders={isMyOrders} />

            <tbody>
              {orders.map((order, index) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isMyOrders={isMyOrders}
                  expandedOrderId={expandedOrderId}
                  onToggleExpand={handleToggleExpand}
                  isFirst={index === 0}
                  isLast={index === orders.length - 1}
                />
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Snackbar
        message={tableTranslations('statusUpdatedSuccessfully')}
        open={statusUpdateSnackbarOpen}
        onClose={() => setStatusUpdateSnackbarOpen(false)}
        variant="success"
      />
    </div>
  )
}

export default OrdersTable
