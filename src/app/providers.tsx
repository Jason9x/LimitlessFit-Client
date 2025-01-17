'use client'

import { ReactNode } from 'react'
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
}) => (
  <NextIntlClientProvider messages={messages} locale={locale}>
    <ThemeProvider attribute="class">
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  </NextIntlClientProvider>
)

export default Providers
