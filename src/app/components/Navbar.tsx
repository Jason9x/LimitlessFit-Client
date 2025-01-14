'use client'

import { useTheme } from 'next-themes'

import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDumbbell, faSun } from '@fortawesome/free-solid-svg-icons'

import LanguageSelector from '@/components/LanguageSelector'

const Navbar = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <nav className="bg-secondary dark:bg-secondary-dark">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center text-foreground dark:text-foreground-dark">
              <FontAwesomeIcon
                icon={faDumbbell}
                className="sm:text-sm md:text-xl lg:text-xl xl:text-xl 2xl:text-xl"
              />

              <span
                className="ml-3 font-bold uppercase sm:text-md md:text-xl lg:text-xl xl:text-2xl
                2xl:text-2xl text-shadow text-shadow-blur-10
              text-shadow-foreground dark:text-shadow-foreground-dark tracking-wider"
              >
                LimitlessFit
              </span>
            </div>
          </Link>

          <div className="sm:text-md md:text-lg lg:text-lg xl:text-lg 2xl:text-lg">
            <LanguageSelector />

            <button className="ml-5" onClick={toggleTheme}>
              <FontAwesomeIcon
                icon={faSun}
                className="text-foreground dark:text-foreground-dark"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
