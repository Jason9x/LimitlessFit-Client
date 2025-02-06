import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    variant: 'error' | 'success' | 'info'
  }>({ open: false, message: '', variant: 'info' })

  const [currentPage, setCurrentPage] = useState(1)
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

  const filterFromUrl = searchParams.get('filter')
    ? (JSON.parse(searchParams.get('filter') as string) as OrderFilterType)
    : null
  const [filter, setFilter] = useState<OrderFilterType | null>(filterFromUrl)

  const queryKey = [isMyOrders ? 'my-orders' : 'all', currentPage, filter]

  const {
    data: paginatedOrders,
    isLoading,
    isError,
    error
  } = useQuery<OrdersResponse, Error>({
    queryKey,
    queryFn: () =>
      fetchOrders(
        { pageNumber: currentPage, pageSize: PAGE_SIZE },
        filter || {}
      )
  })

  useEffect(() => {
    if (isError)
      setSnackbar({
        open: true,
        message: translations(error?.message || ''),
        variant: 'error'
      })
  }, [isError, error?.message, translations])

  useSignalR('/orderUpdateHub', [
    {
      eventName: 'ReceiveOrderUpdate',
      callback: (updatedOrder: OrderType) =>
        queryClient.setQueryData<OrdersResponse>(queryKey, cachedOrders => {
          if (!cachedOrders) return cachedOrders

          const { orders } = cachedOrders
          const existingIndex = orders.findIndex(
            ({ id }) => id === updatedOrder.id
          )

          const shouldInclude = checkOrderAgainstFilters(updatedOrder)
          const isNewOrder = existingIndex === -1

          if (isNewOrder)
            return shouldInclude
              ? {
                  ...cachedOrders,
                  orders: [updatedOrder, ...orders].slice(0, PAGE_SIZE)
                }
              : cachedOrders

          return shouldInclude
            ? {
                ...cachedOrders,
                orders: orders.map(order =>
                  order.id === updatedOrder.id ? updatedOrder : order
                )
              }
            : {
                ...cachedOrders,
                orders: orders.filter(order => order.id !== updatedOrder.id)
              }
        })
    },
    {
      eventName: 'ReceivedOrderStatusUpdate',
      callback: (id: number, status: OrderStatusEnum) =>
        queryClient.setQueryData<OrdersResponse>(queryKey, cachedOrders => {
          if (!cachedOrders) return cachedOrders

          return {
            ...cachedOrders,
            orders: cachedOrders.orders.flatMap(order => {
              if (order.id !== id) return [order]

              const updatedOrder = { ...order, status }

              if (!checkOrderAgainstFilters(updatedOrder)) return []

              return [updatedOrder]
            })
          }
        })
    }
  ])

  const checkOrderAgainstFilters = (
    order: OrderType,
    filter?: OrderFilterType
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

  const handleFilterChange = (newFilter: OrderFilterType) => {
    setFilter(newFilter)
    setCurrentPage(1)

    const params = new URLSearchParams(searchParams.toString())
    params.set('filter', JSON.stringify(newFilter))

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleStatusUpdateSuccess = () =>
    setSnackbar({
      open: true,
      message: translations('statusUpdatedSuccessfully'),
      variant: 'success'
    })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="m-10">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="font-semibold text-xl mb-3 sm:mb-0">
          {translations(isMyOrders ? 'orderHistory' : 'title')}
        </h1>

        <OrdersFilter onFilterChange={handleFilterChange} />
      </div>

      <hr className="my-10 border-gray-300 dark:border-gray-600" />

      {!isError && paginatedOrders && (
        <>
          {paginatedOrders.orders.length > 0 ? (
            <div className="space-y-6">
              <table
                className="min-w-full shadow-md rounded-xl shadow-secondary dark:shadow-secondary-dark
                         bg-secondary dark:bg-secondary-dark table-auto border-collapse"
              >
                <OrdersTableHeader isMyOrders={isMyOrders} />

                <tbody>
                  {paginatedOrders.orders.map((order, index) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      isMyOrders={isMyOrders}
                      expandedOrderId={expandedOrderId}
                      onToggleExpand={setExpandedOrderId}
                      onStatusChangeSuccess={handleStatusUpdateSuccess}
                      isFirst={index === 0}
                      isLast={index === paginatedOrders.orders.length - 1}
                    />
                  ))}
                </tbody>
              </table>

              <Pagination
                currentPage={currentPage}
                totalPages={paginatedOrders.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {translations(isMyOrders ? 'noOrders' : 'noOrderFound')}
            </div>
          )}
        </>
      )}

      <Snackbar
        message={snackbar.message}
        open={snackbar.open}
        onClose={() =>
          setSnackbar(previousState => ({ ...previousState, open: false }))
        }
        variant={snackbar.variant}
      />
    </div>
  )
}

export default OrdersTable
