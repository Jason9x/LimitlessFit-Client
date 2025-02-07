import { Role } from '@/types/models/user'

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
  roleUpdated: {
    role: Role
  }
}

export type NotificationKey = keyof NotificationDataTypes

type Notification<T extends NotificationKey> = NotificationBase & {
  messageKey: T
  additionalData: NotificationDataTypes[T]
}

export type NotificationType = {
  [K in NotificationKey]: Notification<K>
}[NotificationKey]
