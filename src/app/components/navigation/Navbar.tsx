'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'

import LanguageDropdown from '@/components/navigation/LanguageDropdown'
import UserDropdown from '@/components/navigation/UserDropdown'

import { RootState } from '@/store'
import useClickOutside from '@/hooks/useClickOutside'

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuRef = useClickOutside(() => setIsMenuOpen(false))

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false)
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const NavigationItems = () => (
    <>
      <LanguageDropdown />

      <button onClick={toggleTheme} className="p-2">
        <Image
          src="/icons/sun.svg"
          width={20}
          height={20}
          alt="Theme Toggle"
          className="dark:invert"
        />
      </button>

      {isAuthenticated && <UserDropdown />}
    </>
  )

  return (
    <nav className="flex justify-between p-4 bg-secondary dark:bg-secondary-dark">
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

      <button
        className="lg:hidden text-foreground dark:text-foreground-dark"
        onClick={toggleMenu}
      >
        <Image
          src="/icons/menu.svg"
          width={22}
          height={22}
          alt="Menu"
          className="dark:invert"
        />
      </button>

      <div className="hidden lg:flex items-center space-x-4">
        <NavigationItems />
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-14 right-2 bg-background dark:bg-background-dark shadow-md
                     rounded-xl p-3 w-20 flex flex-col space-y-1 items-center justify-center"
        >
          <NavigationItems />
        </div>
      )}
    </nav>
  )
}

export default Navbar
