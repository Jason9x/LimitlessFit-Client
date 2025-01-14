'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

import Input from '@/components/Input'
import SubmitButton from '@/components/SubmitBotton'
import ActionLink from '@/components/ActionLink'
import Snackbar from '@/components/Snackbar'

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  })

  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const registerTranslations = useTranslations('Register')
  const loginTranslations = useTranslations('Login')

  const registrationSchema = z.object({
    name: z.string().min(1, registerTranslations('nameIsRequired')).max(100, registerTranslations('nameIsTooLong')),
    email: z.string().email(registerTranslations('invalidEmailFormat')),
    password: z.string().min(6, registerTranslations('passwordMinLength'))
  })

  type FormData = z.infer<typeof registrationSchema>

  const handleChange = (field: keyof FormData) => (event: ChangeEvent<HTMLInputElement>) =>
    setFormData(previousData => ({
      ...previousData,
      [field]: event.target.value,
    }))

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      registrationSchema.parse(formData)

      setSnackbarMessage('')
      setSnackbarOpen(false)
    } catch (error) {
      if (!(error instanceof z.ZodError)) return

      const errorMessages = error.errors.map(error => error.message).join(', ')
      setSnackbarMessage(errorMessages)
      setSnackbarOpen(true)
    }
  }

  return (
      <div className="flex items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <Input
              label={registerTranslations('name')}
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
          />

          <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              className="mt-5"
          />

          <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              className="mt-5"
          />

          <ActionLink
              introText={registerTranslations('existingUser')}
              linkText={loginTranslations('login')}
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
        />
      </div>
  )
}

export default Register
