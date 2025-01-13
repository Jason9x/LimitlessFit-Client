import { ChangeEvent, useState } from 'react'

interface InputProps {
  label: string
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'time'
    | 'tel'
    | 'search'
    | 'url'
    | 'file'
  placeholder?: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="bg-secondary rounded-full p-2 pl-8"
        required
      />

      <label
        htmlFor={label}
        className={`absolute top-2 left-3 font-medium text-text-secondary uppercase
                     ${isFocused ? 'text-[0.6rem] top-1' : 'text-xs'}`}
      >
        {label}
      </label>
    </div>
  )
}

export default Input
