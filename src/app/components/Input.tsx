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
}

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  className
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
        className={`bg-secondary dark:bg-secondary-dark font-semibold rounded-full p-3 pl-7 w-80 shadow-md outline-none ${
          isActive && 'pt-5 transition-all duration-300 ease-in-out'
        } `}
      />
    </div>
  )
}

export default Input
