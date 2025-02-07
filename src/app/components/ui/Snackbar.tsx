import { useEffect, useState } from 'react'

type SnackbarProps = {
  message: string
  open: boolean
  onClose: () => void
  variant?: 'success' | 'error' | 'info'
}

const Snackbar = ({
  message,
  open,
  onClose,
  variant = 'error'
}: SnackbarProps) => {
  const [isVisible, setIsVisible] = useState(open)

  useEffect(() => {
    if (!open) return

    setIsVisible(true)

    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 2000)

    return () => clearTimeout(timer)
  }, [open, onClose])

  const variantStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }

  if (!open) return

  return (
    <div
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white 
                  flex items-center justify-between transition-all duration-300 transform
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        ${variantStyles[variant]}`}
    >
      <span className="mr-2">{message}</span>

      <button
        onClick={() => setIsVisible(false)}
        className="text-white font-bold text-2xl rounded-full p-1"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  )
}

export default Snackbar
