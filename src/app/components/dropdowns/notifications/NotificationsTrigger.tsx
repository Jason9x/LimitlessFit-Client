import Image from 'next/image'

type NotificationsTriggerProps = {
  unreadCount: number
  onToggle: () => void
}

const NotificationsTrigger = ({
  unreadCount,
  onToggle
}: NotificationsTriggerProps) => (
  <button className="flex relative" onClick={onToggle}>
    <Image
      src="/icons/navbar/notification/notification.svg"
      width={20}
      height={20}
      alt=""
      className="dark:invert"
      priority
    />

    {unreadCount > 0 && (
      <span
        className="absolute right-0.5 px-1 text-[10px] font-bold transform
                   translate-x-1/2 -translate-y-1/2 bg-primary dark:bg-primary-dark rounded-full"
      >
        {unreadCount}
      </span>
    )}
  </button>
)

export default NotificationsTrigger
