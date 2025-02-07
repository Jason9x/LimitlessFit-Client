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
  }),
  roleUpdated: ({ role }) => ({
    translationKey: 'roleUpdated',
    translationValues: { role }
  })
}

export const getNotificationMessage = <K extends NotificationKey>(
  notification: Extract<NotificationType, { messageKey: K }>
): MessageHandlerReturn<K> => {
  const handler = MESSAGE_HANDLERS[notification.messageKey] as (
    data: NotificationDataTypes[K]
  ) => MessageHandlerReturn<K>

  return handler(
    parseNotificationData(notification.additionalData, notification.messageKey)
  )
}

const parseNotificationData = <K extends NotificationKey>(
  additionalData: string,
  key: K
): NotificationDataTypes[K] => {
  if (!additionalData) return {} as NotificationDataTypes[K]

  try {
    const parsed = JSON.parse(additionalData)

    return isValidNotificationData(parsed, key)
      ? parsed
      : ({} as NotificationDataTypes[K])
  } catch {
    return {} as NotificationDataTypes[K]
  }
}

const isValidNotificationData = <K extends NotificationKey>(
  data: unknown,
  key: K
): data is NotificationDataTypes[K] =>
  !!data &&
  typeof data === 'object' &&
  {
    orderStatusUpdate: ['orderId', 'status'],
    roleUpdated: ['role']
  }[key].every(field => field in data)
