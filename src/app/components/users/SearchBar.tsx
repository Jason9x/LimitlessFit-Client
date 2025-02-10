import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { ChangeEvent, useRef } from 'react'

type SearchBarProps = {
  searchTerm: string
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClearSearch: () => void
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  onClearSearch
}: SearchBarProps) => {
  const translations = useTranslations('UsersPanel')
  const searchInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative w-fit">
      <input
        ref={searchInputRef}
        type="search"
        placeholder={translations('searchPlaceholder')}
        value={searchTerm}
        onChange={onSearchChange}
        className="pl-4 pr-10 py-2 rounded-full border bg-secondary dark:bg-secondary-dark border-none text-sm focus:shadow-md focus:outline-none focus:ring-0 transition-all [-webkit-appearance:none] [&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
        {searchTerm ? (
          <button
            type="button"
            onClick={onClearSearch}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Image
              src="/icons/close.svg"
              alt={translations('clearSearch')}
              width={20}
              height={20}
              className="dark:invert opacity-70"
            />
          </button>
        ) : (
          <Image
            src="/icons/search.svg"
            alt="Search"
            width={20}
            height={20}
            className="dark:invert opacity-70"
          />
        )}
      </div>
    </div>
  )
}
