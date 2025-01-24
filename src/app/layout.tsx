import '@/styles/globals.css'

import { ReactNode } from 'react'
import { Metadata } from 'next'
import { getMessages, getLocale } from 'next-intl/server'

import Navbar from '@/components/Navbar'
import Providers from '@/providers'
import AuthCheck from '@/components/auth/AuthCheck'

export const metadata: Metadata = {
  title: 'LimitlessFit',
  description: `LimitlessFit is an online shop offering a wide range of fitness and wellness products to 
                support your health journey. From high-quality workout gear to supplements and recovery tools, 
                our carefully curated collection helps you achieve your fitness goals. 
                Explore our products and elevate your wellness routine.`
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
