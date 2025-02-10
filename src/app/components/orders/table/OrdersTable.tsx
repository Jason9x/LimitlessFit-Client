import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

import useOrderUpdates from '@/hooks/useOrderUpdates'

import { fetchOrderStats } from '@/api/services/orders'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Snackbar from '@/components/ui/Snackbar'
import Pagination from '@/components/ui/Pagination'

import OrderStatCard from '@/components/orders/OrderStatCard'

import OrdersFilter from '../OrdersFilter'
import OrderRow from './OrderRow'
import OrdersTableHeader from './OrdersTableHeader'

import { ORDERS_PAGE_SIZE } from '@/constants/pagination'

import {
  OrderFilterType,
  OrdersResponse,
  OrderStats
} from '@/types/models/order'
import { PaginationParams } from '@/types/pagination'

type OrdersTableProps = {
  fetchOrders: (
    params: PaginationParams,
    filter: OrderFilterType
  ) => Promise<OrdersResponse>
  isMyOrders?: boolean
}

const OrdersTable = ({ fetchOrders, isMyOrders = false }: OrdersTableProps) => {
  const translations = useTranslations(isMyOrders ? 'MyOrders' : 'OrdersPanel')
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
  } = useQuery<OrdersResponse>({
    queryKey,
    queryFn: () =>
      fetchOrders(
        { pageNumber: currentPage, pageSize: ORDERS_PAGE_SIZE },
        filter || {}
      ),
    staleTime: 60000
  })

  const { data: stats } = useQuery<OrderStats, Error>({
    queryKey: ['stats'],
    queryFn: fetchOrderStats,
    staleTime: 60000
  })

  useOrderUpdates(queryKey, filter)

  useEffect(() => {
    if (isError)
      setSnackbar({
        open: true,
        message: translations(error?.message || ''),
        variant: 'error'
      })
  }, [isError, error?.message, translations])

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
          {!isMyOrders && (
            <div className="flex justify-center lg:justify-start space-x-6 mb-8">
              <OrderStatCard
                value={stats?.deliveredToday || 0}
                label={translations('stats.ordersDeliveredToday')}
              />

              <OrderStatCard
                value={stats?.pendingOrders || 0}
                label={translations('stats.pendingOrders')}
              />

              <OrderStatCard
                value={stats?.shippingOrders || 0}
                label={translations('stats.shippingOrders')}
              />
            </div>
          )}

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
        {...snackbar}
        onClose={() =>
          setSnackbar(previousState => ({ ...previousState, open: false }))
        }
      />
    </div>
  )
}

export default OrdersTable
