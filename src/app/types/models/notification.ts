type NotificationBase = {
  id: number
  messageKey: string
  isRead: boolean
  createdAt: string
  additionalData?: string
}

export type NotificationDataTypes = {
  orderStatusUpdate: {
    orderId?: number
    status?: string
  }
}

export type NotificationKey = keyof NotificationDataTypes

type Notification<T extends NotificationKey> = NotificationBase & {
  messageKey: T
  additionalData: string
}

export type NotificationType = {
  [K in NotificationKey]: Notification<K>
}[NotificationKey]
