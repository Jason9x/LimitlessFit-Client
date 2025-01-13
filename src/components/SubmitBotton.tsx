import React from 'react'

type SubmitButtonProps = {
  label: string
  className?: string
  onClick?: () => void
  disabled?: boolean
}

const SubmitButton = ({
  label,
  className,
  onClick,
  disabled = false
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className={`bg-primary dark:bg-primary-dark shadow-lg shadow-primary dark:shadow-primary-dark text-sm text-foreground
                    dark:text-foreground-dark uppercase font-bold py-3 px-[4rem] rounded-full ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default SubmitButton
