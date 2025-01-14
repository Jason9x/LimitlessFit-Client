import { z, Schema, ZodError } from 'zod'
import { FormEvent } from 'react'
import toSentenceCase from '@/utils/stringUtils'

type HandleFormSubmitProps = {
  event: FormEvent
  schema: Schema
  formData: z.infer<Schema>
  setSnackbarMessage: (message: string) => void
  setSnackbarOpen: (isOpen: boolean) => void
}

const handleFormSubmit = async ({
  event,
  schema,
  formData,
  setSnackbarMessage,
  setSnackbarOpen
}: HandleFormSubmitProps) => {
  event.preventDefault()

  try {
    schema.parse(formData)

    setSnackbarMessage('')
    setSnackbarOpen(false)
  } catch (error) {
    if (!(error instanceof ZodError)) return

    const errorMessages = toSentenceCase(
      error.errors.map(error => error.message).join(', ')
    )

    setSnackbarMessage(errorMessages)
    setSnackbarOpen(true)
  }
}

export default handleFormSubmit
