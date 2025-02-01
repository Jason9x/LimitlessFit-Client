import Link from 'next/link'
import { useLocale } from 'use-intl'
import Image from 'next/image'

import { formatDistanceToNow } from 'date-fns'
import { it, enUS } from 'date-fns/locale'
import { toZonedTime } from 'date-fns-tz'

import OrderStatus from '../OrderStatus'
import OrderItems from './OrderItems'

import { updateOrderStatus } from '@/api/orders'

import { OrderType, OrderStatusEnum } from '@/types/models/order'

type OrderRowProps = {
  order: OrderType
  isMyOrders: boolean
  expandedOrderId: number | null
  onToggleExpand: (orderId: number) => void
  isFirst?: boolean
  isLast?: boolean
}

const OrderRow = ({
  order,
  isMyOrders,
  expandedOrderId,
  onToggleExpand,
  isFirst = false,
  isLast = false
}: OrderRowProps) => {
  const { id, date, user, totalPrice, status, items } = order

  const locale = useLocale()
  const selectedLocale = locale === 'it' ? it : enUS

  const formattedTraditionalDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date))

  const localeTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const utcDate = new Date(date + 'Z')
  const localDate = toZonedTime(utcDate, localeTimeZone)

  const formattedRelativeDate = formatDistanceToNow(localDate, {
    addSuffix: true,
    locale: selectedLocale
  })

  const username = user?.name
  const paddingClasses = `${isFirst && 'pt-8'} ${isLast && 'pb-12'}`

  const handleStatusChange = async (status: OrderStatusEnum) => {
    if (status !== Number(status)) await updateOrderStatus(id, status)
  }

  return (
    <>
      <tr className="text-foreground-secondary dark:text-foreground-secondary-dark">
        <td
          className={`p-3 px-8 text-link dark:text-link-dark font-normal ${paddingClasses}`}
        >
          <Link href={`/orders/${id}`}>#{id}</Link>
        </td>

        <td className={`p-3 px-8 ${paddingClasses}`}>
          {isMyOrders ? (
            formattedTraditionalDate
          ) : (
            <div className="flex items-center">
              <div
                className="flex items-center justify-center w-8 h-8 mr-3 rounded-full
                          bg-primary dark:bg-primary-dark text-white"
              >
                {username?.[0].toUpperCase()}
              </div>

              {username}
            </div>
          )}
        </td>

        {!isMyOrders && (
          <td className={`p-3 px-8 font-normal ${paddingClasses}`}>
            {formattedRelativeDate}
          </td>
        )}

        <td className={`p-3 px-8 font-normal ${paddingClasses}`}>
          € {totalPrice}
        </td>

        <td className={`p-3 px-8 ${paddingClasses}`}>
          <OrderStatus
            status={status}
            isDropdown={!isMyOrders}
            onChange={handleStatusChange}
          />
        </td>

        {!isMyOrders && (
          <td className={`p-3 px-8 ${paddingClasses}`}>
            <button
              onClick={() => onToggleExpand(id)}
              className="w-4 h-4 flex items-center justify-center"
            >
              <Image
                src="/icons/arrows/arrow-expand.svg"
                width={15}
                height={15}
                alt="Arrow expand"
                className={`transition-transform duration-300 ${
                  expandedOrderId === id ? 'rotate-180' : 'rotate-0'
                } ease-out dark:invert`}
              />
            </button>
          </td>
        )}
      </tr>

      {expandedOrderId === id && !isMyOrders && (
        <tr>
          <td colSpan={5} className="p-6">
            <div className="flex justify-center items-center w-full">
              <OrderItems items={items} />
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default OrderRow
