import { useTranslations } from 'next-intl'

import LoadingSpinner from '@/components/ui/LoadingSpinner'

import NotificationsHeader from '@/components/dropdowns/notifications/NotificationsHeader'
import NotificationsEmptyState from '@/components/dropdowns/notifications/NotificationsEmptyState'

import { NotificationType } from '@/types/models/notification'
import NotificationItem from '@/components/dropdowns/notifications/NotificationItem'

type NotificationsPanelProps = {
  isLoading: boolean
  hasNotifications: boolean
  translations: ReturnType<typeof useTranslations<'NotificationsDropdown'>>
  notifications: NotificationType[] | undefined
  onDeleteAll: () => void
  onMarkAsRead: (id: number) => void
}

const NotificationsPanel = ({
  isLoading,
  hasNotifications,
  translations,
  notifications,
  onDeleteAll,
  onMarkAsRead
}: NotificationsPanelProps) => (
  <div
    className={`absolute right-0 mt-2 w-64 bg-background dark:bg-background-dark rounded-2xl 
                shadow-lg z-10 overflow-y-auto ${hasNotifications ? 'max-h-72' : 'h-72'}`}
  >
    {isLoading ? (
      <div className="px-6 py-4 h-64 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    ) : (
      <div className="px-6 py-4">
        <NotificationsHeader
          translations={translations}
          hasNotifications={hasNotifications}
          onDeleteAll={onDeleteAll}
        />

        {hasNotifications ? (
          <ul>
            {notifications?.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                markAsRead={onMarkAsRead}
              />
            ))}
          </ul>
        ) : (
          <NotificationsEmptyState translations={translations} />
        )}
      </div>
    )}
  </div>
)

export default NotificationsPanel
