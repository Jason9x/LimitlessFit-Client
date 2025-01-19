'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useSelector } from 'react-redux'

import LanguageDropdown from '@/components/navigation/LanguageDropdown'
import UserDropdown from '@/components/navigation/UserDropdown'

import { RootState } from '@/store'

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  const toggleMenu = () => setIsMenuOpen(previousState => !previousState)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setIsMenuOpen(false)
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    }
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
    <nav className="bg-secondary dark:bg-secondary-dark">
      <div className="container mx-auto px-6 py-4 relative">
        <div className="flex justify-between items-center">
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
            className="lg:hidden flex items-center text-foreground dark:text-foreground-dark"
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
        </div>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-15 right-2 bg-background dark:bg-background-dark shadow-md rounded-xl p-3 w-20 z-10 flex flex-col space-y-1 items-center justify-center"
          >
            <NavigationItems />
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
