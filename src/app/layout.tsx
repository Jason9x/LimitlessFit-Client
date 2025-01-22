import '@/styles/globals.css'

import { ReactNode } from 'react'
import { Metadata } from 'next'
import { getMessages, getLocale } from 'next-intl/server'

import Navbar from '@/components/navigation/Navbar'
import Providers from '@/providers'
import AuthCheck from '@/components/auth/AuthCheck'

export const metadata: Metadata = {
  title: 'LimitlessFit',
  description: `LimitlessFit is a fitness and wellness platform designed to help you 
                achieve your health goals through personalized workout plans, nutrition guidance, and progress tracking. 
                Stay motivated and reach your full potential with our comprehensive fitness tools.`
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html>
      <body className="bg-background dark:bg-background-dark min-w-full w-fit overflow-x-hidden">
        <Providers messages={messages} locale={locale}>
          <Navbar />
          <AuthCheck>{children}</AuthCheck>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
