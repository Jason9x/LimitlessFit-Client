import { useEffect } from 'react'

type SnackbarProps = {
    message: string
    open: boolean
    onClose: () => void
}

const Snackbar = ({ message, open, onClose }: SnackbarProps) => {
    useEffect(() => {
        if (!open) return

        const timer = setTimeout(() => onClose(), 3000)

        return () => clearTimeout(timer)
    }, [open, onClose])

    return (
        <div
            className={`fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between
                        transition-all duration-300 ease-out transform ${open ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
            <span className="mr-2">{message}</span>

            <button
                onClick={onClose}
                className="text-white font-bold text-2xl rounded-full p-1"
                aria-label="Close"
            >
                ×
            </button>
        </div>
    )
}

export default Snackbar
