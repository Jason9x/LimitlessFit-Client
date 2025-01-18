'use client'

import { ReactNode, useEffect, useState } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { AbstractIntlMessages } from 'use-intl'
import { ThemeProvider } from 'next-themes'
import { Provider } from 'react-redux'

import store from '@/store'

const Providers = ({
  children,
  messages,
  locale
}: {
  children: ReactNode
  messages: AbstractIntlMessages
  locale: string
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ThemeProvider attribute="class">
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}

export default Providers
