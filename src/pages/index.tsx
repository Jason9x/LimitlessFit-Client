import { ChangeEvent, FormEvent, useState } from 'react'

import Input from '@/components/Input'
import SubmitButton from '@/components/SubmitBotton'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="mt-5"
        />

        <p className="text-xs uppercase text-text-secondary mt-4">
          Nuovo utente?{' '}
          <a className="text-link font-medium" href="/register">
            Registrati
          </a>
        </p>

        <SubmitButton label="Login" className="mt-8" />

        <a
          href="/forgotten-password"
          className="mt-5 uppercase text-link text-sm underline font-medium decoration-0"
        >
          Password dimenticata?
        </a>
      </form>
    </div>
  )
}

export default LoginPage
