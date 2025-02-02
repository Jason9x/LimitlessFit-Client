import { formatDistanceToNow } from 'date-fns'
import { it, enUS } from 'date-fns/locale'
import { toZonedTime } from 'date-fns-tz'

export const formatRelativeDate = (dateString: string, locale: string) => {
  const localeTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const utcDate = new Date(dateString + 'Z')
  const localDate = toZonedTime(utcDate, localeTimeZone)

  return formatDistanceToNow(localDate, {
    addSuffix: true,
    locale: locale === 'it' ? it : enUS
  })
}
