import { useTranslations } from 'next-intl'
import { useLocale } from 'use-intl'
import Link from 'next/link'

import { useEffect, useRef } from 'react'

import { formatRelativeDate } from '@/utils/dateUtils'
import { getNotificationMessage } from '@/utils/notificationUtils'
import { getOrderStatusLabels } from '@/utils/orderUtils'

import {
  NotificationType,
  NotificationDataTypes
} from '@/types/models/notification'

import { OrderStatusEnum } from '@/types/models/order'
import { Role } from '@/types/models/user'

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
  const roleTranslations = useTranslations('Roles')

  const locale = useLocale()
  const itemRef = useRef<HTMLLIElement>(null)

  const { translationKey, translationValues } =
    getNotificationMessage(notification)
  const formattedRelativeDate = formatRelativeDate(createdAt, locale)
  const statusLabels = getOrderStatusLabels(statusTranslations)

  const getDynamicValues = () => {
    switch (translationKey) {
      case 'orderStatusUpdate': {
        const { orderId, status } =
          translationValues as NotificationDataTypes['orderStatusUpdate']

        return {
          href: `/orders/${orderId}`,
          translationParams: {
            status:
              status !== undefined
                ? statusLabels[
                    status as unknown as OrderStatusEnum
                  ].toLowerCase()
                : ''
          }
        }
      }

      case 'roleUpdated': {
        const { role } =
          translationValues as NotificationDataTypes['roleUpdated']

        const translatedRole = roleTranslations(Role[role].toLowerCase())

        return { translationParams: { role: translatedRole.toLowerCase() } }
      }

      default:
        return { translationParams: {} }
    }
  }

  const { href, translationParams } = getDynamicValues()
  const notificationContent = translations(translationKey, translationParams)

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

  const innerContent = (
    <>
      <p className="text-sm mb-1">{notificationContent}</p>

      <p className="text-xs text-foreground-secondary dark:text-foreground-secondary-dark">
        {formattedRelativeDate}
      </p>
    </>
  )

  return (
    <li
      ref={itemRef}
      className="my-4 py-1.5 px-4 rounded-2xl border-none bg-secondary dark:bg-secondary-dark
                 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
    >
      {href ? (
        <Link href={href} passHref>
          {innerContent}
        </Link>
      ) : (
        innerContent
      )}
    </li>
  )
}

export default NotificationItem
