'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useMemo } from 'react'

import { fetchMyOrders } from '@/services/api/orders'

import OrdersFilter from '@/components/orders/OrdersFilter'
import OrderStatus from '@/components/orders/OrderStatus'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Snackbar from '@/components/ui/Snackbar'
import Pagination from '@/components/ui/Pagination'

import { OrderFilterType } from '@/types/order'

const PAGE_SIZE = 4

const MyOrders = () => {
  const translations = useTranslations('MyOrders')
  const orderTranslations = useTranslations('Order')

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const filterFromUrl = searchParams.get('filter')
    ? JSON.parse(searchParams.get('filter') as string)
    : null
  const [filter, setFilter] = useState<OrderFilterType>(filterFromUrl)

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-orders', currentPage, filter],
    queryFn: () =>
      fetchMyOrders(
        {
          pageNumber: currentPage,
          pageSize: PAGE_SIZE
        },
        filter || {}
      )
  })

  const orders = useMemo(
    () => data?.orders.$values || [],
    [data?.orders.$values]
  )

  useEffect(() => {
    if (error) setSnackbarOpen(true)
  }, [error])

  useEffect(() => {
    if (orders.length === 0) setSnackbarOpen(true)
  }, [orders])

  if (isLoading) return <LoadingSpinner />

  if (error)
    return (
      <Snackbar
        message={translations(error.message)}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        variant="error"
      />
    )

  const handleFilterChange = (newFilter: OrderFilterType) => {
    setFilter(newFilter)
    setCurrentPage(1)

    const newSearchParams = new URLSearchParams(window.location.search)
    newSearchParams.set('filter', JSON.stringify(newFilter))

    router.push(`${pathname}?${newSearchParams.toString()}`)
  }

  const handlePageChange = (page: number) => setCurrentPage(page)

  return (
    <div className="m-10">
      <div className="flex justify-between items-center">
        <h1 className="text-foreground dark:text-foreground-dark font-semibold text-xl">
          {translations('orderHistory')}
        </h1>

        <OrdersFilter onFilterChange={handleFilterChange} />
      </div>

      <hr className="mt-4 mb-10 border-gray-300 dark:border-gray-600" />

      {orders.length === 0 ? (
        <Snackbar
          message={translations('noOrders')}
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          variant="info"
        />
      ) : (
        <>
          <table className="min-w-full shadow-md mb-10 bg-secondary rounded-xl dark:bg-secondary-dark table-auto border-collapse">
            <thead>
              <tr className="text-left border-b-[1px] border-gray-300 dark:border-gray-600">
                <th className="pb-4 p-6 font-semibold">Id</th>

                <th className="pb-4 p-6 font-semibold">
                  {orderTranslations('date')}
                </th>

                <th className="pb-4 p-6 font-semibold">
                  {orderTranslations('total')}
                </th>

                <th className="pb-4 p-6 font-semibold">
                  {orderTranslations('status')}
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((value, index) => {
                const isFirst = index === 0
                const isLast = index === orders.length - 1

                const date = new Date(value.date)
                const formattedDate = new Intl.DateTimeFormat('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }).format(date)

                return (
                  <tr
                    key={index}
                    className="text-foreground-secondary dark:text-foreground-secondary-dark"
                  >
                    <td
                      className={`p-3 text-link dark:text-link-dark px-6 font-normal 
                                  ${isFirst ? 'pt-8' : ''} ${isLast ? 'pb-10' : ''}`}
                    >
                      <Link href={`/orders/${value.id}`}>#{value.id}</Link>
                    </td>

                    <td
                      className={`p-3 px-6 ${isFirst ? 'pt-8' : ''} ${isLast ? 'pb-10' : ''}`}
                    >
                      {formattedDate}
                    </td>

                    <td
                      className={`p-3 px-6 font-normal ${isFirst ? 'pt-8' : ''} ${isLast ? 'pb-10' : ''}`}
                    >
                      € {value.totalPrice}
                    </td>

                    <td
                      className={`p-3 px-6 ${isFirst ? 'pt-8' : ''} ${isLast ? 'pb-10' : ''}`}
                    >
                      <OrderStatus status={value.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={data?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}

export default MyOrders
