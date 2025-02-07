import { FormEvent, useState } from 'react'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { z, ZodSchema } from 'zod'

import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'

import Input from '@/components/ui/Input'
import SubmitButton from '@/components/buttons/SubmitBotton'
import ActionLink from '@/components/buttons/ActionLink'
import Snackbar from '@/components/ui/Snackbar'

import useForm from '@/hooks/useForm'

import { registerUser, loginUser } from '@/api/services/auth'
import { setAuthState } from '@/store/slices/authSlice'
import { AxiosError } from 'axios'
import { setTokens } from '@/utils/cookieUtils'
import { jwtDecode } from 'jwt-decode'
import AuthTokenPayload from '@/types/auth-token-payload'

type AuthFormProps = {
  mode: 'register' | 'login'
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const isRegister = mode === 'register'
  const translations = useTranslations(isRegister ? 'Register' : 'Login')
  const registerTranslations = useTranslations('Register')
  const loginTranslations = useTranslations('Login')
  const dispatch = useDispatch()

  const baseSchema = z.object({
    email: z.string().email(),
    password: z.string()
  })

  const registerSchema = baseSchema.extend({
    name: z
      .string()
      .regex(/^[a-zA-Z0-9 ]{3,50}$/, registerTranslations('invalidName')),
    password: z
      .string()
      .min(8, registerTranslations('passwordLength'))
      .regex(/[A-Z]/, registerTranslations('passwordUppercase'))
      .regex(/\d/, registerTranslations('passwordNumber'))
      .regex(/[^a-zA-Z0-9]/, registerTranslations('passwordSpecial'))
  })

  const schema: ZodSchema = isRegister ? registerSchema : baseSchema

  const initialData = {
    email: '',
    password: '',
    ...(isRegister && { name: '' })
  }

  const { formData, errors, handleChange, validate } = useForm(
    schema,
    initialData
  )

  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)

  const mutation = useMutation({
    mutationFn: (data: typeof formData) =>
      isRegister ? registerUser(data) : loginUser(data),
    onSuccess: ({ accessToken, refreshToken }) => {
      if (!accessToken || !refreshToken) return

      const {
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': roleId
      } = jwtDecode<AuthTokenPayload>(String(accessToken))

      if (!roleId) return

      dispatch(setAuthState(true))

      setTokens(String(accessToken), String(refreshToken))
    },
    onError: error => {
      const { message: messageKey } = error as AxiosError

      setSnackbarMessage(translations(messageKey))
      setSnackbarOpen(true)
    }
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!validate()) {
      setSnackbarOpen(false)
      return
    }

    mutation.mutate(formData)
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-screen">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        {isRegister && (
          <Input
            label={translations('name')}
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            required
            minLength={3}
            maxLength={30}
            error={errors.name}
          />
        )}
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
          minLength={5}
          maxLength={50}
          error={errors.email}
          className="mt-4"
        />
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          required
          minLength={isRegister ? 8 : 1}
          maxLength={20}
          error={errors.password}
          className="mt-4"
        />
        <ActionLink
          introText={translations(isRegister ? 'existingUser' : 'newUser')}
          linkText={
            isRegister
              ? loginTranslations('login').toLowerCase()
              : translations('registerNow')
          }
          href={isRegister ? '/' : '/register'}
          className="mt-4"
        />
        <SubmitButton
          label={translations(isRegister ? 'register' : 'login')}
          className="mt-6"
        />

        {/* TODO: last thing: forgotten password. :) */}
        {!isRegister && (
          <Link
            href="/"
            className="mt-6 uppercase text-link dark:text-link-dark text-sm underline font-medium decoration-0"
          >
            {translations('forgottenPassword')}
          </Link>
        )}
      </form>

      <Snackbar
        message={snackbarMessage}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        variant="error"
      />
    </div>
  )
}

export const RegisterForm = () => <AuthForm mode="register" />
export const LoginForm = () => <AuthForm mode="login" />
