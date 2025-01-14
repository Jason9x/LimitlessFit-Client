'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import Input from '@/components/Input'
import SubmitButton from '@/components/SubmitBotton'
import ActionLink from '@/components/ActionLink'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginTranslations = useTranslations('Login')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value)

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value)

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="mt-5"
        />

        <ActionLink
          introText={loginTranslations('newUser')}
          linkText={loginTranslations('registerNow')}
          href="/register"
        />

        <SubmitButton label={loginTranslations('login')} className="mt-6" />

        <Link
          href="/"
          className="mt-5 uppercase text-link dark:text-link-dark text-sm underline font-medium decoration-0"
        >
          {loginTranslations('forgottenPassword')}
        </Link>
      </form>
    </div>
  )
}

export default Login
