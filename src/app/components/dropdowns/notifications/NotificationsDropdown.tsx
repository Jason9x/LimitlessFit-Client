import { useTranslations } from 'next-intl'

import { useState, useCallback, useRef } from 'react'

import useNotifications from '@/hooks/useNotifications'
import useClickOutside from '@/hooks/useClickOutside'

import NotificationsPanel from '@/components/dropdowns/notifications/NotificationPanel'
import NotificationsTrigger from '@/components/dropdowns/notifications/NotificationsTrigger'

const NotificationsDropdown = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const translations = useTranslations('NotificationsDropdown')
  const {
    notifications,
    isLoading,
    unreadCount,
    hasNotifications,
    markAsRead,
    deleteAll
  } = useNotifications()

  useClickOutside([notificationsRef], () => setIsPanelOpen(false))

  const toggleNotificationsPanel = useCallback(
    () => setIsPanelOpen(isOpen => !isOpen),
    []
  )

  return (
    <div className="relative" ref={notificationsRef}>
      <NotificationsTrigger
        unreadCount={unreadCount}
        onToggle={toggleNotificationsPanel}
      />

      {isPanelOpen && (
        <NotificationsPanel
          isLoading={isLoading}
          hasNotifications={hasNotifications}
          translations={translations}
          notifications={notifications}
          onDeleteAll={deleteAll}
          onMarkAsRead={markAsRead}
        />
      )}
    </div>
  )
}

export default NotificationsDropdown
