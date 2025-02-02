import api from '@/api'

import NotificationType from '@/types/models/notification'

export const getNotifications = async () => {
  const { data: notifications } =
    await api.get<NotificationType[]>('/Notifications')

  return notifications
}

export const markAsRead = async (id: number) =>
  await api.put(`/Notifications/${id}/read`)

export const deleteAllNotifications = async () =>
  await api.delete('/Notifications')
