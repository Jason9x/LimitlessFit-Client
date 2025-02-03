import NotificationItem from '@/components/dropdowns/notifications/NotificationItem'
import { NotificationType } from '@/types/models/notification'

type NotificationsListProps = {
  notifications: NotificationType[] | undefined
  onMarkAsRead: (id: number) => void
}

const NotificationsList = ({
  notifications,
  onMarkAsRead
}: NotificationsListProps) => (
  <ul>
    {notifications?.map(notification => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        markAsRead={onMarkAsRead}
      />
    ))}
  </ul>
)

export default NotificationsList
