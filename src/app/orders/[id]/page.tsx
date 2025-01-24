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

import OrderStatus from '@/components/order/OrderStatus'

import { OrderStatusEnum } from '@/types/order'

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

  const items = data?.items

  console.log(items)

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

      <hr className="mt-5 mb-10" />

      <table className="min-w-full bg-secondary rounded-xl dark:bg-secondary-dark table-auto border-collapse">
        <thead>
          <tr>
            <th className="border-b px-4 py-2 text-left">
              {translations('preview')}
            </th>

            <th className="border-b px-4 py-2 text-left">
              {translations('items')}
            </th>

            <th className="border-b px-4 py-2 text-left">
              {translations('total')}
            </th>
          </tr>
        </thead>

        <tbody>
          {items?.$values.map((value, index) => (
            <tr key={index}>
              <td className="border-b px-4 py-2">
                <Image
                  src={value.item.imageUrl}
                  width={40}
                  height={40}
                  alt={`Item #${index}`}
                />
              </td>

              <td className="border-b px-4 py-2">
                {value.quantity} x {itemTranslations(value.item.nameKey)}
              </td>

              <td className="border-b px-4 py-2">
                € {value.quantity * value.item.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Order
