import Link from 'next/link'
import { useLocale } from 'use-intl'
import Image from 'next/image'

import { formatDistanceToNow } from 'date-fns'
import { it, enUS } from 'date-fns/locale'
import { toZonedTime } from 'date-fns-tz'

import OrderStatus from '../OrderStatus'
import OrderItems from './OrderItems'

import { OrderType, OrderStatusEnum } from '@/types/orderType'
import { updateOrderStatus } from '@/api/orders'

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
  const locale = useLocale()
  const selectedLocale = locale === 'it' ? it : enUS

  const formattedTraditionalDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(order.date))

  const localeTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const utcDate = new Date(order.date + 'Z')
  const localDate = toZonedTime(utcDate, localeTimeZone)

  const formattedRelativeDate = formatDistanceToNow(localDate, {
    addSuffix: true,
    locale: selectedLocale
  })

  const username = order.user?.name
  const paddingClasses = `${isFirst && 'pt-8'} ${isLast && 'pb-12'}`

  const handleStatusChange = async (status: OrderStatusEnum) => {
    if (order.status !== Number(status))
      await updateOrderStatus(order.id, status)
  }

  return (
    <>
      <tr className="text-foreground-secondary dark:text-foreground-secondary-dark">
        <td
          className={`p-3 px-8 text-link dark:text-link-dark font-normal ${paddingClasses}`}
        >
          <Link href={`/orders/${order.id}`}>#{order.id}</Link>
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
          € {order.totalPrice}
        </td>

        <td className={`p-3 px-8 ${paddingClasses}`}>
          <OrderStatus
            status={order.status}
            isDropdown={!isMyOrders}
            onChange={handleStatusChange}
          />
        </td>

        {!isMyOrders && (
          <td className={`p-3 px-8 ${paddingClasses}`}>
            <button
              onClick={() => onToggleExpand(order.id)}
              className="w-4 h-4 flex items-center justify-center"
            >
              <Image
                src="/icons/arrows/arrow-expand.svg"
                width={15}
                height={15}
                alt="Arrow expand"
                className={`transition-transform duration-300 ${
                  expandedOrderId === order.id ? 'rotate-180' : 'rotate-0'
                } ease-out dark:invert`}
              />
            </button>
          </td>
        )}
      </tr>

      {expandedOrderId === order.id && !isMyOrders && (
        <tr>
          <td colSpan={5} className="p-6">
            <div className="flex justify-center items-center w-full">
              <OrderItems items={order.items} />
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default OrderRow
