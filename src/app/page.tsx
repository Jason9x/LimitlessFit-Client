'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

import Input from '@/components/Input'
import SubmitButton from '@/components/SubmitBotton'
import ActionLink from '@/components/ActionLink'
import Snackbar from '@/components/Snackbar'

import { loginUser } from '@/services/api/auth'

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarVariant, setSnackbarVariant] = useState<'success' | 'error'>(
    'error'
  )

  const loginTranslations = useTranslations('Login')

  const schema = z.object({
    email: z.string(),
    password: z.string()
  })

  type FormData = z.infer<typeof schema>

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const result = schema.safeParse(formData)

    if (!result.success) {
      const newErrors: { [key: string]: string } = {}

      result.error.errors.forEach(
        error => (newErrors[error.path[0]] = error.message)
      )

      setErrors(newErrors)
      setSnackbarOpen(false)
      return
    }

    const { email, password } = formData
    const { success, messageKey, token } = await loginUser({
      email,
      password
    })

    setSnackbarMessage(loginTranslations(messageKey))
    setSnackbarVariant(success ? 'success' : 'error')

    if (success && token) localStorage.setItem('authToken', token)

    setSnackbarOpen(true)
  }

  const handleChange =
    (field: keyof FormData) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormData(previousData => ({
        ...previousData,
        [field]: event.target.value
      }))

      setErrors(previousErrors => ({
        ...previousErrors,
        [field]: ''
      }))
    }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
          minLength={5}
          maxLength={50}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          className="mt-5"
          required
          minLength={8}
          maxLength={20}
          error={errors.password}
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
        variant={snackbarVariant}
      />
    </div>
  )
}

export default Login
