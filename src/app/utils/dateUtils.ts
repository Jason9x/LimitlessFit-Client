import { formatDistanceToNow } from 'date-fns'
import { it, enUS } from 'date-fns/locale'
import { toZonedTime } from 'date-fns-tz'

export const formatRelativeDate = (date: Date, locale: string) => {
  const localeTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localDate = toZonedTime(date, localeTimeZone)

  return formatDistanceToNow(localDate, {
    addSuffix: true,
    locale: locale === 'it' ? it : enUS
  })
}
