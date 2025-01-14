'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

import Input from '@/components/Input'
import SubmitButton from '@/components/SubmitBotton'
import ActionLink from '@/components/ActionLink'
import Snackbar from '@/components/Snackbar'

import handleFormSubmit from '@/utils/formUtils'

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  })

  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const registerTranslations = useTranslations('Register')
  const loginTranslations = useTranslations('Login')

  const schema = z.object({
    name: z
      .string()
      .min(1, registerTranslations('nameIsRequired'))
      .max(100, registerTranslations('nameIsTooLong')),
    email: z.string().email(registerTranslations('invalidEmailFormat')),
    password: z.string().min(6, registerTranslations('passwordMinLength'))
  })

  type FormData = z.infer<typeof schema>

  const handleChange =
    (field: keyof FormData) => (event: ChangeEvent<HTMLInputElement>) =>
      setFormData(previousData => ({
        ...previousData,
        [field]: event.target.value
      }))

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={(event: FormEvent) =>
          handleFormSubmit({
            event,
            schema,
            formData,
            setSnackbarMessage,
            setSnackbarOpen
          })
        }
        className="flex flex-col items-center"
      >
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
      />
    </div>
  )
}

export default Register
