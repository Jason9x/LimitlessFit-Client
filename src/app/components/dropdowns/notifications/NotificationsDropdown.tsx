import { useState, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'

import {
  deleteAllNotifications,
  getNotifications,
  markAsRead
} from '@/api/notifications'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import NotificationItem from '@/components/dropdowns/notifications/NotificationItem'
import useClickOutside from '@/hooks/useClickOutside'
import NotificationType from '@/types/models/notification'

const NotificationsDropdown = () => {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  })

  const ref = useRef<HTMLDivElement | null>(null)

  useClickOutside([ref], () => setIsOpen(false))

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousNotifications = queryClient.getQueryData(['notifications'])

      queryClient.setQueryData(
        ['notifications'],
        (currentNotifications: NotificationType[]) =>
          currentNotifications.map(notification =>
            notification.id === id
              ? { ...notification, isRead: true }
              : notification
          )
      )

      return { previousNotifications }
    },
    onError: (_error, _id, context) =>
      queryClient.setQueryData(
        ['notifications'],
        context?.previousNotifications
      )
  })

  const deleteAllNotificationsMutation = useMutation({
    mutationFn: deleteAllNotifications,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousNotifications = queryClient.getQueryData(['notifications'])
      queryClient.setQueryData(['notifications'], [])

      return { previousNotifications }
    },
    onError: (_error, _variables, context) =>
      queryClient.setQueryData(
        ['notifications'],
        context?.previousNotifications
      )
  })

  const unreadCount =
    notifications?.filter(notification => !notification.isRead).length || 0
  const hasNotifications = notifications && notifications.length > 0

  const handleToggle = useCallback(() => setIsOpen(isOpen => !isOpen), [])

  return (
    <div className="relative" ref={ref}>
      <button className="flex" onClick={handleToggle}>
        <Image
          src="/icons/navbar/notification.svg"
          width={20}
          height={20}
          alt="Notifications"
          className="dark:invert"
        />

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 text-xs font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 overflow-y-auto max-h-48">
          {isLoading && <LoadingSpinner />}

          {!hasNotifications && (
            <div className="p-4 text-center">No notifications found</div>
          )}

          <ul className="divide-y divide-gray-200">
            {notifications?.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                markAsRead={markAsReadMutation.mutate}
              />
            ))}
          </ul>

          <div className="p-2 bg-gray-100 text-center">
            <button
              onClick={() => deleteAllNotificationsMutation.mutate()}
              className="text-red-500 text-sm hover:text-red-700 transition-colors"
            >
              Delete All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsDropdown
