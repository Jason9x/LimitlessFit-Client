import {
  NotificationType,
  NotificationDataTypes,
  NotificationKey
} from '@/types/models/notification'

type MessageHandlerReturn<K extends NotificationKey> = {
  translationKey: K
  translationValues: NotificationDataTypes[K]
}

const MESSAGE_HANDLERS: {
  [K in keyof NotificationDataTypes]: (
    data: NotificationDataTypes[K]
  ) => MessageHandlerReturn<K>
} = {
  orderStatusUpdate: ({ orderId, status }) => ({
    translationKey: 'orderStatusUpdate',
    translationValues: { orderId, status }
  })
}

export const getNotificationMessage = (
  notification: NotificationType
): MessageHandlerReturn<NotificationType['messageKey']> => {
  const handler = MESSAGE_HANDLERS[notification.messageKey]
  const parsedData = parseNotificationData(notification.additionalData)

  return handler(parsedData)
}

const parseNotificationData = <T extends NotificationKey>(
  additionalData?: string
): NotificationDataTypes[T] => {
  const defaultData = {} as NotificationDataTypes[T]

  if (!additionalData) return defaultData

  try {
    const parsed = JSON.parse(additionalData)

    return isValidNotificationData(parsed) ? parsed : defaultData
  } catch {
    return defaultData
  }
}

const isValidNotificationData = <T extends NotificationKey>(
  data: unknown
): data is NotificationDataTypes[T] => !!data && typeof data === 'object'
