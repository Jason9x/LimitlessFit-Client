import { useLocale } from 'use-intl'

import { ChangeEvent } from 'react'

import { setLocaleInCookie } from '@/utils/localeUtils'

type Language = {
  code: string
  name: string
}

const LanguageSelector = () => {
  const locale = useLocale()

  const languages: Language[] = [
    { code: 'it', name: 'Italy' },
    { code: 'en', name: 'English' }
  ]

  return (
    <div className="relative inline-block text-left">
      <select
        value={locale}
        onChange={async (event: ChangeEvent<HTMLSelectElement>) =>
          await setLocaleInCookie(event.target.value)
        }
        className="inline-flex justify-center w-full rounded-md border border-gray-300
                   shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700
                   hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {languages.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSelector
