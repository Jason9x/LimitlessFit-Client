type SubmitButtonProps = {
  label: string
  className?: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'thin'
}

const SubmitButton = ({
  label,
  className,
  onClick,
  disabled = false,
  variant = 'default'
}: SubmitButtonProps) => {
  const variantClasses =
    variant === 'thin' ? 'py-2 px-[2.8rem] text-xs' : 'py-3 px-[4rem] text-sm'

  return (
    <button
      type="submit"
      className={`flex justify-center bg-primary dark:bg-primary-dark shadow-[0_0_15px] shadow-primary dark:shadow-primary-dark text-foreground
                  dark:text-foreground-dark uppercase transition-all duration-300 font-bold rounded-full hover:translate-y-0.5 ${variantClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default SubmitButton
