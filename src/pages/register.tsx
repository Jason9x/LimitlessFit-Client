import { ChangeEvent, FormEvent, useState } from 'react'

import Input from '@/components/Input'
import SubmitButton from '@/components/SubmitBotton'
import ActionLink from '@/components/ActionLink'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <Input
          label="Nome"
          type="text"
          value={name}
          onChange={handleNameChange}
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          className="mt-5"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="mt-5"
        />

        <ActionLink introText="Già un membro?" linkText="Entra" href="/" />

        <SubmitButton label="Registrati" className="mt-6" />
      </form>
    </div>
  )
}

export default Register
