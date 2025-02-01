import { useLocale } from 'use-intl'
import { useRef, useState } from 'react'
import Image from 'next/image'

import useClickOutside from '@/hooks/useClickOutside'

import { setLocaleInCookie } from '@/utils/localeUtils'

type Language = {
  code: string
  flag: string
}

const LanguageDropdown = () => {
  const locale = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  const ref = useRef<HTMLDivElement | null>(null)

  useClickOutside([ref], () => setIsOpen(false))

  const languages: Language[] = [
    { code: 'it', flag: '/icons/flags/it.png' },
    { code: 'en', flag: '/icons/flags/en.png' }
  ]

  const currentLanguage = languages.find(({ code }) => code === locale)
  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center justify-center w-full"
        onClick={toggleMenu}
      >
        {currentLanguage && (
          <Image
            width={20}
            height={20}
            src={currentLanguage.flag}
            alt={`Flag for ${locale}`}
            className="mr-2"
          />
        )}

        <Image
          src="/icons/arrows/arrow-expand.svg"
          width={10}
          height={10}
          alt="Arrow expand"
          className={`transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          } ease-out dark:invert`}
        />
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-2 w-fit rounded-xl bg-background dark:bg-background-dark overflow-hidden
                      lg:shadow-md shadow-none"
        >
          {languages.map(({ code, flag }) => (
            <li
              key={code}
              className="block p-2 hover:bg-secondary hover:dark:bg-secondary-dark cursor-pointer"
              onClick={async () => {
                await setLocaleInCookie(code)
                setIsOpen(false)
              }}
            >
              <div className="flex items-center justify-center">
                <Image
                  width={28}
                  height={28}
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
