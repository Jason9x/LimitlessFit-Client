import { useLocale } from 'use-intl'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

import { setLocaleInCookie } from '@/utils/localeUtils'

type Language = {
  code: string
  flag: string
}

const LanguageDropdown = () => {
  const locale = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const languages: Language[] = [
    { code: 'it', flag: '/icons/flags/it.png' },
    { code: 'en', flag: '/icons/flags/en.png' }
  ]

  const currentLanguage = languages.find(({ code }) => code === locale)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClick = () => setIsOpen(!isOpen)

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        className="flex items-center justify-center w-full px-4 py-2"
        onClick={handleClick}
      >
        {currentLanguage && (
          <Image
            width={22}
            height={22}
            src={currentLanguage.flag}
            alt={`Flag for ${locale}`}
            className="mr-2"
          />
        )}

        <Image
          src="/icons/arrow-expand.svg"
          width={12}
          height={12}
          alt="Arrow expand"
          className="dark:invert"
        />
      </button>

      {isOpen && (
        <ul className="absolute z-10 translate-x-2 mt-1 w-fit rounded-md shadow-sm bg-background dark:bg-background-dark overflow-hidden">
          {languages.map(({ code, flag }) => (
            <li
              key={code}
              className="block px-4 py-2 hover:bg-secondary hover:dark:bg-secondary-dark cursor-pointer"
              onClick={async () => {
                await setLocaleInCookie(code)

                setIsOpen(false)
              }}
            >
              <div className="flex items-center justify-center">
                {' '}
                {/* Center content within the list item */}
                <Image
                  width={22}
                  height={22}
                  src={flag}
                  alt={`Flag for ${code}`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageDropdown
