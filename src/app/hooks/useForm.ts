import { ChangeEvent, SetStateAction, useState } from 'react'
import { ZodSchema } from 'zod'

type UseFormReturn<T> = {
  formData: T
  errors: Record<keyof T, string>
  handleChange: (
    field: keyof T
  ) => (event: ChangeEvent<HTMLInputElement>) => void
  validate: () => boolean
  setErrors: (value: SetStateAction<Record<keyof T, string>>) => void
}

const useForm = <T extends Record<string, any>>(
  schema: ZodSchema<T>,
  initialData: T
): UseFormReturn<T> => {
  const [formData, setFormData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  )

  const validate = (): boolean => {
    const result = schema.safeParse(formData)

    if (result.success) return true

    setErrors(
      result.error.errors.reduce(
        (accumulator, { path, message }) => {
          accumulator[path[0] as keyof T] = message
          return accumulator
        },
        {} as Record<keyof T, string>
      )
    )

    return false
  }

  const handleChange =
    (field: keyof T) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormData(previousData => ({
        ...previousData,
        [field]: event.target.value
      }))

      setErrors(previousErrors => ({
        ...previousErrors,
        [field]: ''
      }))
    }

  return { formData, errors, handleChange, validate, setErrors }
}

export default useForm
