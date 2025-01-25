'use client'

import { useTranslations } from 'next-intl'

import Link from 'next/link'
import { useLocale } from 'use-intl'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { fetchMyOrders } from '@/services/api/orders'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Snackbar from '@/components/ui/Snackbar'
import OrderStatus from '@/components/order/OrderStatus'
import Pagination from '@/components/ui/Pagination'

const PAGE_SIZE = 4

const MyOrders = () => {
  const translations = useTranslations('MyOrders')
  const orderTranslations = useTranslations('Order')

  const locale = useLocale()

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-orders', currentPage],
    queryFn: () =>
      fetchMyOrders({ pageNumber: currentPage, pageSize: PAGE_SIZE })
  })

  useEffect(() => {
    if (error) setSnackbarOpen(true)
  }, [error])

  const orders = data?.orders.$values || []
  const totalPages = data?.totalPages || 1

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

  return (
    <div className="m-10">
      <h1 className="text-foreground dark:text-foreground-dark font-semibold text-xl mb-3">
        {translations('orderHistory')}
      </h1>

      <hr className="mt-4 mb-10 border-gray-300 dark:border-gray-600" />

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
            const formattedDate = new Intl.DateTimeFormat(locale, {
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
                  className={`p-3 text-link dark:text-link-dark px-6 font-normal ${isFirst ? 'pt-8' : ''} ${isLast ? 'pb-10' : ''}`}
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
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default MyOrders
