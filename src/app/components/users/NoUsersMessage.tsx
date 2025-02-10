import { useTranslations } from 'next-intl'

const NoUsersMessage = () => {
  const translations = useTranslations('UsersPanel')

  return (
    <p className="text-center text-sm text-foreground-secondary dark:text-foreground-secondary-dark">
      {translations('noUsersFound')}
    </p>
  )
}

export default NoUsersMessage
