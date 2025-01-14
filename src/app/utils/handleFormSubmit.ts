import { ZodError } from 'zod'
import {FormEvent} from "react";

type HandleFormSubmitProps = {
    event: FormEvent
    registrationSchema: any
    formData: any
    setSnackbarMessage: (message: string) => void
    setSnackbarOpen: (isOpen: boolean) => void
}

export const handleFormSubmit = async ({
                                           registrationSchema,
                                           formData,
                                           setSnackbarMessage,
                                           setSnackbarOpen
                                       }: HandleFormSubmitProps) => {
    event.preventDefault()

    try {
        registrationSchema.parse(formData)

        setSnackbarMessage('')
        setSnackbarOpen(false)
    } catch (error) {
        if (!(error instanceof ZodError)) return

        const errorMessages = error.errors
            .map((error, index) =>
                index === 0
                    ? error.message.charAt(0).toUpperCase() + error.message.slice(1)
                    : error.message.toLowerCase()
            )
            .join(', ') + '.'

        setSnackbarMessage(errorMessages)
        setSnackbarOpen(true)
    }
}
