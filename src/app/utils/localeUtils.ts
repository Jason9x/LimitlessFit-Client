'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const COOKIE_NAME = 'NEXT_LOCALE'
const DEFAULT_LOCALE = 'en'

export const getLocaleFromCookie = async () => {
  const cookiesInstance = await cookies()

  return cookiesInstance.get(COOKIE_NAME)?.value ?? DEFAULT_LOCALE
}

export const setLocaleInCookie = async (locale: string) => {
  const cookiesInstance = await cookies()

  cookiesInstance.set(COOKIE_NAME, locale)
  revalidatePath('/app')
}
