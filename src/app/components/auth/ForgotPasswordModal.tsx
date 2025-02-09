import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { FormEvent, useState } from 'react'

import { z } from 'zod'

import { AxiosError } from 'axios'

import Input from '@/components/ui/Input'
import Snackbar from '@/components/ui/Snackbar'

import SubmitButton from '@/components/buttons/SubmitBotton'

import useForm from '@/hooks/useForm'

import { useMutation } from '@tanstack/react-query'

import { forgotPassword } from '@/api/services/auth'

type ForgotPasswordModalProps = {
  onClose: () => void
}

const ForgotPasswordModal = ({ onClose }: ForgotPasswordModalProps) => {
  const translations = useTranslations('Login')

  const forgottenPasswordSchema = z.object({
    email: z.string().email()
  })

  const { formData, errors, handleChange, validate } = useForm(
    forgottenPasswordSchema,
    {
      email: ''
    }
  )

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    variant: 'error' | 'info' | 'success'
  }>({ open: false, message: '', variant: 'info' })

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => forgotPassword(email),
    onSuccess: messageKey => {
      console.log({ messageKey })

      setSnackbar({
        open: true,
        message: translations(messageKey),
        variant: 'success'
      })

      setTimeout(() => onClose(), 3000)
    },
    onError: error => {
      const { message: messageKey } = error as AxiosError

      setSnackbar({
        open: true,
        message: translations(messageKey),
        variant: 'error'
      })

      setTimeout(() => onClose(), 3000)
    }
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!validate()) {
      setSnackbar({ ...snackbar, open: false })
      return
    }

    if (formData.email) forgotPasswordMutation.mutate(formData.email)
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-secondary dark:bg-secondary-dark p-6 px-12 rounded-3xl shadow-lg max-w-md w-full relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:bg-gray-100
                   dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <Image
            src="/icons/close.svg"
            alt="Close modal"
            width={15}
            height={15}
            className="dark:invert opacity-70"
          />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mt-5 mb-10">
            {translations('forgottenPassword')}
          </h2>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            required
            error={errors.email}
            variant="outline"
          />

          <SubmitButton
            label={translations('submit')}
            variant="thin"
            className="w-full my-5"
          />
        </form>

        <Snackbar
          message={snackbar.message}
          open={snackbar.open}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant={snackbar.variant}
        />
      </div>
    </div>
  )
}

export default ForgotPasswordModal
