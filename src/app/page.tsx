'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

import Input from '@/components/Input'
import SubmitButton from '@/components/SubmitBotton'
import ActionLink from '@/components/ActionLink'
import Snackbar from '@/components/Snackbar'  // Import Snackbar

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })

  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const loginTranslations = useTranslations('Login')
  const registerTranslations = useTranslations('Register')

  const loginSchema = z.object({
    email: z.string().email(registerTranslations('invalidEmailFormat')),
    password: z.string().min(6, registerTranslations('passwordMinLength'))
  })

  type FormData = z.infer<typeof loginSchema>

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) =>
      setFormData((prevData) => ({ ...prevData, email: event.target.value }))

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) =>
      setFormData((prevData) => ({ ...prevData, password: event.target.value }))

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      loginSchema.parse(formData)

      setSnackbarMessage('')
      setSnackbarOpen(false)
    } catch (error) {
      if (!(error instanceof z.ZodError)) return

      const errorMessages = error.errors
          .map((error, index) => index === 0
              ? error.message.charAt(0).toUpperCase() + error.message.slice(1)
              : error.message.toLowerCase())
          .join(', ') + '.'
      setSnackbarMessage(errorMessages)
      setSnackbarOpen(true)
    }
  }

  return (
      <div className="flex items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleEmailChange}
          />

          <Input
              label="Password"
              type="password"
              value={formData.password}
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

        <Snackbar
            message={snackbarMessage}
            open={snackbarOpen}
            onClose={() => setSnackbarOpen(false)}
        />
      </div>
  )
}

export default Login
