import { useTranslations } from 'next-intl'

import { useEffect, useRef } from 'react'

import { NotificationType } from '@/types/models/notification'
import { formatRelativeDate } from '@/utils/dateUtils'
import { useLocale } from 'use-intl'
import { getNotificationMessage } from '@/utils/notificationUtils'
import { getOrderStatusLabels } from '@/utils/orderUtils'
import { OrderStatusEnum } from '@/types/models/order'
import Link from 'next/link'

type NotificationItemProps = {
  notification: NotificationType
  markAsRead: (id: number) => void
}

const NotificationItem = ({
  notification,
  markAsRead
}: NotificationItemProps) => {
  const { id, isRead, createdAt } = notification

  const translations = useTranslations('NotificationItem')
  const statusTranslations = useTranslations('OrderStatus')

  const itemRef = useRef<HTMLLIElement>(null)
  const locale = useLocale()

  const { translationKey, translationValues } =
    getNotificationMessage(notification)
  const { orderId, status } = translationValues

  const statusLabels = getOrderStatusLabels(statusTranslations)
  const formattedRelativeDate = formatRelativeDate(createdAt, locale)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isRead) markAsRead(id)
      },
      { threshold: 0.5 }
    )

    const currentItem = itemRef.current

    if (currentItem) observer.observe(currentItem)

    return () => {
      if (currentItem) observer.unobserve(currentItem)
    }
  }, [id, isRead, markAsRead])

  return (
    <li
      ref={itemRef}
      className={`my-4 py-1.5 px-4 rounded-2xl border-none bg-secondary dark:bg-secondary-dark 
                  cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800`}
    >
      <Link href={`/orders/${orderId}`} passHref>
        <p className="text-sm mb-1">
          {translations(translationKey, {
            status:
              statusLabels[status as unknown as OrderStatusEnum].toLowerCase()
          })}
        </p>

        <p className="text-xs text-foreground-secondary dark:text-foreground-secondary-dark">
          {formattedRelativeDate}
        </p>
      </Link>
    </li>
  )
}

export default NotificationItem
