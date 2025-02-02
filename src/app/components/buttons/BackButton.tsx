'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const BackButton = () => {
  const router = useRouter()
  const translations = useTranslations('BackButton')

  const handleBack = () => router.back()

  return (
    <button
      onClick={handleBack}
      className="m-10 flex items-center space-x-1.5 font-semibold text-sm text-foreground dark:text-foreground-dark"
    >
      <Image
        src="/icons/arrows/arrow-back.svg"
        alt="Back"
        width={10}
        height={10}
        className="dark:invert"
        priority
      />

      <span>{translations('back')}</span>
    </button>
  )
}

export default BackButton
