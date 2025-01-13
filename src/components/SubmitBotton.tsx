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
      className={`bg-primary shadow-lg shadow-primary text-sm text-text-primary 
                    uppercase font-bold py-3 px-[4rem] rounded-full ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default SubmitButton
