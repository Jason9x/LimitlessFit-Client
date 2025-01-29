import { FormEvent, useState } from 'react'
import { z, ZodSchema } from 'zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'

import Input from '@/components/ui/Input'
import SubmitButton from '@/components/buttons/SubmitBotton'
import ActionLink from '@/components/buttons/ActionLink'
import Snackbar from '@/components/ui/Snackbar'

import useForm from '@/hooks/useForm'

import { registerUser, loginUser } from '@/services/api/auth'

import { setAuthState } from '@/store/slices/authSlice'
import { AxiosError } from 'axios'

type AuthFormProps = {
  isRegister: boolean
}

const AuthForm = ({ isRegister }: AuthFormProps) => {
  const translations = useTranslations(isRegister ? 'Register' : 'Login')
  const loginTranslations = useTranslations('Login')

  const dispatch = useDispatch()
  const router = useRouter()

  const baseSchema = z.object({
    email: z.string().email(),
    password: z.string()
  })

  const registerSchema = baseSchema.extend({
    name: isRegister
      ? z.string().regex(/^[a-zA-Z0-9 ]{3,50}$/, translations('invalidName'))
      : z.string(),
    password: isRegister
      ? z
          .string()
          .min(8, translations('passwordLength'))
          .regex(/[A-Z]/, translations('passwordUppercase'))
          .regex(/\d/, translations('passwordNumber'))
          .regex(/[^a-zA-Z0-9]/, translations('passwordSpecial'))
      : z.string()
  })

  const schema: ZodSchema<any> = isRegister ? registerSchema : baseSchema

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!validate()) {
      setSnackbarOpen(false)
      return
    }

    const apiAction = isRegister ? registerUser : loginUser

    try {
      const { token } = await apiAction(formData)

      dispatch(setAuthState(true))

      Cookies.set('jwtToken', String(token), {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      })

      router.push('/')
    } catch (error) {
      const messageKey = (error as AxiosError).message

      setSnackbarMessage(translations(messageKey))
      setSnackbarOpen(true)
    }
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
          minLength={8}
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

export const RegisterForm = () => <AuthForm isRegister={true} />
export const LoginForm = () => <AuthForm isRegister={false} />
