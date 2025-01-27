'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useLocale } from 'use-intl'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { fetchOrderById } from '@/services/api/orders'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Snackbar from '@/components/ui/Snackbar'

import OrderStatus from '@/components/orders/OrderStatus'

import { OrderStatusEnum } from '@/types/order'
import Pagination from '@/components/ui/Pagination'

const ITEMS_PER_PAGE = 4

const Order = () => {
  const { id } = useParams()
  const locale = useLocale()

  const translations = useTranslations('Order')
  const itemTranslations = useTranslations('OrderItem')

  const { data, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(Number(id)),
    retry: false
  })

  useEffect(() => {
    if (error) setSnackbarOpen(true)
  }, [error])

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)

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

  const totalPrice = data?.totalPrice

  const date = new Date(data?.date || '')
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)

  const status = data?.status ?? OrderStatusEnum.Pending

  const orderDetails = [
    { label: 'total', value: `€ ${totalPrice}` },
    { label: 'date', value: formattedDate },
    { label: 'status', value: <OrderStatus status={status} /> }
  ]

  const items = data?.items?.$values || []

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="m-10">
      <h1 className="text-foreground dark:text-foreground-dark font-semibold text-xl mb-3">
        {translations('order')}{' '}
        <span className="text-link dark:text-link-dark">#{id}</span>
      </h1>

      <div className="space-y-2 text-sm">
        {orderDetails.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-start text-foreground dark:text-foreground-dark font-semibold"
          >
            <span className="mr-2 min-w-[40px]">{translations(label)}:</span>
            <span className="text-foreground-secondary dark:text-foreground-secondary-dark">
              {value}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-foreground dark:text-foreground-dark font-semibold text-lg mt-[50px]">
        {translations('items')}
      </h2>

      <hr className="mt-4 mb-10 border-gray-300 dark:border-gray-600" />

      <table className="min-w-full shadow-md mb-10 bg-secondary rounded-xl dark:bg-secondary-dark table-auto border-collapse">
        <thead>
          <tr className="text-left border-b-[1px] border-gray-300 dark:border-gray-600">
            <th className="pb-4 p-6 font-semibold">
              {translations('preview')}
            </th>
            <th className="pb-4 p-6 font-semibold">{translations('items')}</th>
            <th className="pb-4 p-6 font-semibold">{translations('total')}</th>
          </tr>
        </thead>

        <tbody>
          {paginatedItems.map((value, index) => {
            const isFirst = index === 0
            const isLast = index === paginatedItems.length - 1

            return (
              <tr
                key={index}
                className="text-foreground-secondary dark:text-foreground-secondary-dark"
              >
                <td
                  className={`p-2 px-6 ${isFirst ? 'pt-6' : ''} ${isLast ? 'pb-6' : ''}`}
                >
                  <Image
                    src={value.item.imageUrl}
                    width={40}
                    height={40}
                    alt={`Item #${index}`}
                  />
                </td>

                <td
                  className={`p-2 px-6 font-normal ${isFirst ? 'pt-6' : ''} ${isLast ? 'pb-6' : ''}`}
                >
                  {value.quantity} x {itemTranslations(value.item.nameKey)}
                </td>

                <td
                  className={`p-2 px-6 font-normal ${isFirst ? 'pt-6' : ''} ${isLast ? 'pb-6' : ''}`}
                >
                  € {value.quantity * value.item.price}
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

export default Order
