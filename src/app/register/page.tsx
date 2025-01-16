'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

import Input from '@/components/Input'
import SubmitButton from '@/components/SubmitBotton'
import ActionLink from '@/components/ActionLink'
import Snackbar from '@/components/Snackbar'

import { registerUser } from '@/services/api/auth'

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarVariant, setSnackbarVariant] = useState<'success' | 'error'>(
    'error'
  )

  const registerTranslations = useTranslations('Register')
  const loginTranslations = useTranslations('Login')

  const schema = z.object({
    name: z
      .string()
      .regex(/^[a-zA-Z\s'-]+$/, registerTranslations('nameInvalid')),
    email: z.string(),
    password: z
      .string()
      .regex(/[A-Z]/, registerTranslations('passwordUppercase'))
      .regex(/\d/, registerTranslations('passwordNumber'))
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

    const { name, email, password } = formData
    const { success, messageKey, token } = await registerUser({
      name,
      email,
      password
    })

    setSnackbarMessage(registerTranslations(messageKey))
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
          label={registerTranslations('name')}
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          required
          minLength={3}
          maxLength={30}
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          className="mt-5"
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
          introText={registerTranslations('existingUser')}
          linkText={loginTranslations('login').toLowerCase()}
          href="/"
        />

        <SubmitButton
          label={registerTranslations('register')}
          className="mt-6"
        />
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

export default Register
