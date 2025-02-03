import { useTranslations } from 'next-intl'

const NotificationsHeader = ({
  translations,
  hasNotifications,
  onDeleteAll
}: {
  translations: ReturnType<typeof useTranslations<'NotificationsDropdown'>>
  hasNotifications: boolean
  onDeleteAll: () => void
}) => (
  <div className="flex justify-between font-semibold mb-6">
    <h3 className="text-base">{translations('notifications')}</h3>

    {hasNotifications && (
      <button
        onClick={onDeleteAll}
        className="text-red-500 text-xs hover:text-red-700 transition-colors"
      >
        {translations('deleteAll')}
      </button>
    )}
  </div>
)

export default NotificationsHeader
