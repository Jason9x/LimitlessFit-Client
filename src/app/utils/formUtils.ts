import { z, Schema } from 'zod'
import { FormEvent } from 'react'

import { loginUser } from '@/services/api/auth'

type HandleFormSubmitProps = {
  event: FormEvent
  schema: Schema
  formData: z.infer<Schema>
  setSnackbarOpen: (isOpen: boolean) => void
  setSnackbarMessage: (message: string) => void
}

const handleFormSubmit = async ({
  event,
  schema,
  formData,
  setSnackbarOpen,
  setSnackbarMessage
}: HandleFormSubmitProps) => {
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

export default handleFormSubmit
