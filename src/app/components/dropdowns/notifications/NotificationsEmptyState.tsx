import { useTranslations } from 'next-intl'
import Image from 'next/image'

const NotificationsEmptyState = ({
  translations
}: {
  translations: ReturnType<typeof useTranslations<'NotificationsDropdown'>>
}) => (
  <div className="flex flex-col items-center mt-10">
    <Image
      width={130}
      height={130}
      quality={100}
      src="/icons/navbar/notification/notification-bubbles.png"
      alt="No notifications"
    />

    <p className="font-semibold text-sm text-center mt-[-0.2rem]">
      {translations('noNotificationsFound')}
    </p>
  </div>
)

export default NotificationsEmptyState
