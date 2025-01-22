import { ChangeEvent, useState } from 'react'

type InputProps = {
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
  className?: string
  required?: boolean
  minLength?: number
  maxLength?: number
  error?: string
}

const Input = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  className,
  required = false,
  minLength,
  maxLength,
  error
}: InputProps) => {
  const [isActive, setIsActive] = useState(!!value)

  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor={label}
        className={`absolute top-3.5 left-2 font-medium text-foreground-secondary dark:text-foreground-secondary-dark 
                    pl-5 uppercase cursor-auto transition-all duration-200 ${isActive ? 'text-[0.6rem] top-[0.5rem]' : 'text-[0.8rem]'}`}
      >
        {label}
      </label>

      <input
        id={label}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={event => {
          onChange(event)
          setIsActive(!!event.target.value.trim())
        }}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(!!value)}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className={`bg-secondary dark:bg-secondary-dark font-semibold rounded-full p-3 pl-7 w-80 shadow-md outline-none 
                    ${isActive && 'pt-5 transition-all duration-300 ease-in-out'}`}
      />

      {error && (
        <p
          className={`text-red-500 text-xs mt-4 text-center transition-all duration-300 ease-in-out
                      ${error ? 'opacity-100 visibility-visible' : 'opacity-0 visibility-hidden'}
                      break-words w-80`}
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
