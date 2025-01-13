import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

import Navbar from '@/components/Navbar'

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <div className="bg-background dark:bg-background-dark">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  )
}

export default App
