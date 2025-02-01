import { useEffect, useRef } from 'react'
import NotificationType from '@/types/models/notification'

const NotificationItem = ({
  notification,
  markAsRead
}: {
  notification: NotificationType
  markAsRead: (id: number) => void
}) => {
  const { id, isRead, messageKey, createdAt } = notification
  const itemRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isRead) markAsRead(id)
      },
      { threshold: 0.5 }
    )

    const currentItem = itemRef.current
    if (currentItem) observer.observe(currentItem)

    return () => {
      if (currentItem) observer.unobserve(currentItem)
    }
  }, [id, isRead, markAsRead])

  return (
    <li
      ref={itemRef}
      className={`p-2 cursor-pointer hover:bg-gray-100 ${
        isRead ? 'bg-gray-50' : ''
      }`}
    >
      <span className="block text-sm">{messageKey}</span>

      <span className="text-xs text-gray-500">
        {createdAt.toLocaleString()}
      </span>
    </li>
  )
}

export default NotificationItem
