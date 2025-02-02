import { formatDistanceToNow } from 'date-fns'
import { it, enUS } from 'date-fns/locale'

export const formatRelativeDate = (date: string, locale: string) => {
  const utcDate = new Date(date.endsWith('Z') ? date : `${date}Z`)

  return formatDistanceToNow(utcDate, {
    addSuffix: true,
    locale: locale === 'it' ? it : enUS
  })
}
