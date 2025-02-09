import { ChangeEvent, useId, useState } from 'react'

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
  variant?: 'default' | 'outline'
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
  error,
  variant = 'default'
}: InputProps) => {
  const [isActive, setIsActive] = useState(!!value)
  const id = useId()

  const textSize = isActive
    ? variant === 'outline'
      ? 'text-[0.5rem]'
      : 'text-[0.6rem]'
    : variant === 'outline'
      ? 'text-[0.7rem]'
      : 'text-[0.8rem]'

  const topPosition = isActive ? 'top-[0.4rem]' : 'top-3'

  const handleFocus = () => setIsActive(true)
  const handleBlur = () => setIsActive(!!value)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event)
    setIsActive(!!event.target.value.trim())
  }

  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor={id}
        className={`absolute left-2 font-medium text-foreground-secondary dark:text-foreground-secondary-dark 
                    pl-5 uppercase cursor-auto transition-all duration-200 ${textSize} ${topPosition}`}
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className={`font-semibold pl-7 shadow-md outline-none transition-all duration-300 ease-in-out text-sm
                    ${
                      variant === 'default'
                        ? 'w-80 p-3 rounded-full bg-secondary dark:bg-secondary-dark'
                        : 'w-[25em] p-2.5 rounded-xl border border-gray-400 dark:border-gray-600 bg-transparent'
                    }
                    ${isActive && 'pt-4'}`}
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
