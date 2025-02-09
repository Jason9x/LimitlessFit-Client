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

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(20, { message: 'Password must be at most 20 characters long' }),
  confirmPassword: z.string()
})

const ResetPassword = () => {
  const translations = useTranslations('ResetPassword')
  const router = useRouter()

  const searchParams = new URLSearchParams(window.location.search)

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const { formData, errors, handleChange, validate, setErrors } = useForm(
    resetPasswordSchema,
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
    onSuccess: messageKey =>
      setSnackbar({
        message: translations(messageKey),
        open: true,
        variant: 'success'
      }),
    onError: ({ message: messageKey }: Error) =>
      setSnackbar({
        message: translations(messageKey),
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
        confirmPassword: "Passwords don't match"
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
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="New Password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          required
          minLength={6}
          maxLength={20}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          required
          minLength={6}
          maxLength={20}
          error={errors.confirmPassword}
        />

        <SubmitButton label="Reset password" className="mt-6" />
      </form>

      <Snackbar
        message={snackbar.message}
        open={snackbar.open}
        onClose={handleSnackbarClose}
        variant={snackbar.variant}
      />
    </div>
  )
}

export default ResetPassword
