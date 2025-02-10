'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

import { FormEvent, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { z } from 'zod'
import useForm from '@/hooks/useForm'

import { resetPassword } from '@/api/services/auth'

import Input from '@/components/ui/Input'
import Snackbar from '@/components/ui/Snackbar'
import SubmitButton from '@/components/buttons/SubmitBotton'

const ResetPassword = () => {
  const translations = useTranslations('ResetPassword')
  const registerTranslations = useTranslations('Register')

  const router = useRouter()

  const searchParams = new URLSearchParams(window.location.search)

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const schema = z.object({
    password: z
      .string()
      .min(8, registerTranslations('passwordLength'))
      .regex(/[A-Z]/, registerTranslations('passwordUppercase'))
      .regex(/\d/, registerTranslations('passwordNumber'))
      .regex(/[^a-zA-Z0-9]/, registerTranslations('passwordSpecial')),
    confirmPassword: z.string()
  })

  const { formData, errors, handleChange, validate, setErrors } = useForm(
    schema,
    { password: '', confirmPassword: '' }
  )
  const { password, confirmPassword } = formData

  const [snackbar, setSnackbar] = useState<{
    message: string
    open: boolean
    variant: 'success' | 'error' | 'info'
  }>({
    message: '',
    open: false,
    variant: 'error'
  })

  useEffect(() => {
    if (!token || !email) router.push('/')
  }, [token, email, router])

  const mutation = useMutation({
    mutationFn: ({
      email,
      token,
      password
    }: {
      token: string
      email: string
      password: string
    }) => resetPassword({ email, resetCode: token, newPassword: password }),
    onSuccess: messageKey => {
      setSnackbar({
        message: translations(messageKey),
        open: true,
        variant: 'success'
      })

      setTimeout(() => router.push('/'), 3000)
    },
    onError: (error: Error) =>
      setSnackbar({
        message: translations(error.message),
        open: true,
        variant: 'error'
      })
  })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!validate()) return

    if (password !== confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: translations('passwordMismatch')
      })

      return
    }

    mutation.mutate({
      token: token as string,
      email: email as string,
      password: password
    })
  }

  const handleSnackbarClose = () =>
    setSnackbar(previousState => ({ ...previousState, open: false }))

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <Input
          label={translations('newPassword')}
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          required
          minLength={6}
          maxLength={20}
          error={errors.password}
          className="mb-4"
        />

        <Input
          label={translations('confirmPassword')}
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          required
          minLength={6}
          maxLength={20}
          error={errors.confirmPassword}
        />

        <SubmitButton label={translations('resetPassword')} className="mt-8" />
      </form>

      <Snackbar {...snackbar} onClose={handleSnackbarClose} />
    </div>
  )
}

export default ResetPassword
