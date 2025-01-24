import Link from 'next/link'
import { useTranslations } from 'next-intl'

const NotFound = () => {
  const translations = useTranslations('NotFound')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark">
        {translations('title')}
      </h1>

      <p className="mt-2 text-sm text-foreground-secondary dark:text-foreground-secondary-dark">
        {translations('message')}
      </p>

      <Link
        href="/"
        className="mt-4 px-3 py-1 text-white bg-primary dark:bg-primary-dark text-sm rounded-md shadow-md
                   transition hover:bg-primary-hover dark:hover:bg-primary-dark-hover hover:shadow-lg dark:hover:shadow-lg"
      >
        {translations('button')}
      </Link>
    </div>
  )
}

export default NotFound
