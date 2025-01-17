'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSelector } from 'react-redux'

import LanguageDropdown from '@/components/navigation/LanguageDropdown'

import { RootState } from '@/store'

const Navbar = () => {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')

    router.refresh()
  }

  return (
    <nav className="bg-secondary dark:bg-secondary-dark">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between">
          <Link href="/">
            <div className="flex items-center text-foreground dark:text-foreground-dark">
              <Image
                src="/icons/fitness.svg"
                width={40}
                height={40}
                alt="Fitness"
                className="dark:invert"
                priority
              />

              <span
                className="ml-3 font-bold uppercase text-2xl text-shadow text-shadow-blur-10
                        text-shadow-foreground dark:text-shadow-foreground-dark tracking-wider"
              >
                LimitlessFit
              </span>
            </div>
          </Link>

          <div className="flex items-center">
            <LanguageDropdown />

            <button className="ml-2" onClick={toggleTheme}>
              <Image
                src="/icons/sun.svg"
                width={20}
                height={20}
                alt="Sun"
                className="dark:invert"
              />
            </button>

            {isAuthenticated && (
              <div className="ml-6 flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-primary-dark text-white">
                J
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
