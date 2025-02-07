import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import useSignalR from '@/hooks/useSignalR'

import {
  deleteAllNotifications,
  fetchNotifications,
  markAsRead
} from '@/api/services/notifications'

import type { NotificationType } from '@/types/models/notification'

const useNotifications = () => {
  const queryClient = useQueryClient()

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications
  })

  useSignalR('/notificationHub', [
    {
      eventName: 'NewNotification',
      callback: (receivedNotification: NotificationType) => {
        queryClient.setQueryData<NotificationType[]>(
          ['notifications'],
          (previousNotifications = []) => {
            const isExisting = previousNotifications.some(
              notification => notification.id === receivedNotification.id
            )

            return isExisting
              ? previousNotifications
              : [receivedNotification, ...previousNotifications]
          }
        )
      }
    }
  ])

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previousNotifications = queryClient.getQueryData<
        NotificationType[]
      >(['notifications'])

      queryClient.setQueryData<NotificationType[]>(
        ['notifications'],
        currentNotifications =>
          currentNotifications?.map(notification =>
            notification.id === id
              ? { ...notification, isRead: true }
              : notification
          )
      )

      return { previousNotifications }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        ['notifications'],
        context?.previousNotifications
      )
    }
  })

  const deleteAllNotificationsMutation = useMutation({
    mutationFn: () => deleteAllNotifications().then(() => {}),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previousNotifications = queryClient.getQueryData<
        NotificationType[]
      >(['notifications'])

      queryClient.setQueryData(['notifications'], [])

      return { previousNotifications }
    },
    onError: (_, __, context) =>
      queryClient.setQueryData(
        ['notifications'],
        context?.previousNotifications
      )
  })

  const unreadCount = notifications?.filter(
    notification => !notification.isRead
  ).length
  const hasNotifications = Boolean(notifications && notifications.length > 0)

  return {
    notifications,
    isLoading,
    unreadCount,
    hasNotifications,
    markAsRead: markAsReadMutation.mutate,
    deleteAll: deleteAllNotificationsMutation.mutate
  }
}

export default useNotifications
