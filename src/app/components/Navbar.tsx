'use client'

import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

import LanguageDropdown from '@/components/dropdowns/LanguageDropdown'
import UserDropdown from '@/components/dropdowns/UserDropdown'
import { RootState } from '@/store'
import useClickOutside from '@/hooks/useClickOutside'
import useUser from '@/hooks/useUser'

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const user = useUser()

  const translations = useTranslations('Navbar')

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuIconRef = useRef<HTMLButtonElement | null>(null)

  useClickOutside([menuRef, menuIconRef], () => setIsMenuOpen(false))

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false)
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderAuthenticatedLinks = () => (
    <>
      <Link href="/my-orders" className="flex items-center space-x-2">
        <Image
          src="/icons/navbar/cart.svg"
          width={20}
          height={20}
          alt="My orders"
          className="dark:invert"
        />

        <p className="hidden lg:block">{translations('myOrders')}</p>
      </Link>

      {user?.role === 'Admin' && (
        <Link href="/admin/orders" className="flex items-center space-x-2">
          <Image
            src="/icons/navbar/management.svg"
            width={20}
            height={20}
            alt="Orders management"
            className="dark:invert"
          />

          <p className="hidden lg:block">{translations('ordersManagement')}</p>
        </Link>
      )}
    </>
  )

  const renderMenu = () => (
    <div
      ref={menuRef}
      className="fixed top-14 right-2 shadow-md rounded-xl p-3 w-20 flex bg-background dark:bg-secondary-dark
                 flex-col space-y-3 items-center justify-center z-[9999]"
    >
      <NavigationItems />
    </div>
  )

  const NavigationItems = () => (
    <>
      {isAuthenticated && renderAuthenticatedLinks()}

      <LanguageDropdown />

      <button onClick={toggleTheme}>
        <Image
          src="/icons/navbar/sun.svg"
          width={20}
          height={20}
          alt="Theme toggle"
          className="dark:invert"
        />
      </button>

      {isAuthenticated && <UserDropdown />}
    </>
  )

  return (
    <nav className="relative flex justify-between p-4 bg-secondary dark:bg-secondary-dark">
      <Link href="/">
        <div className="flex items-center text-foreground dark:text-foreground-dark">
          <Image
            src="/icons/navbar/fitness.svg"
            width={40}
            height={40}
            alt="Fitness"
            className="dark:invert"
            priority
          />
          <span className="ml-3 font-bold uppercase text-2xl text-shadow text-shadow-blur-10 text-shadow-foreground dark:text-shadow-foreground-dark tracking-wider">
            LimitlessFit
          </span>
        </div>
      </Link>

      <button
        ref={menuIconRef}
        className="lg:hidden text-foreground dark:text-foreground-dark"
        onClick={toggleMenu}
      >
        <Image
          src="/icons/navbar/menu.svg"
          width={22}
          height={22}
          alt="Menu"
          className="dark:invert"
        />
      </button>

      <div className="hidden lg:flex items-center justify-center space-x-4">
        <NavigationItems />
      </div>

      {isMenuOpen && renderMenu()}
    </nav>
  )
}

export default Navbar
