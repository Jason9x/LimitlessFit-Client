import { useTranslations } from 'next-intl'

type ConfirmOrderAlertProps = {
  totalPrice: number
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}

const ConfirmOrderAlert = ({
  totalPrice,
  onConfirm,
  onCancel,
  isLoading = false
}: ConfirmOrderAlertProps) => {
  const translations = useTranslations('ConfirmOrderAlert')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-secondary dark:bg-secondary-dark py-7 px-10 rounded-3xl shadow-lg max-w-[90vw]">
        <h3 id="confirm-dialog-title" className="text-lg font-semibold mb-2">
          {translations('title')}
        </h3>

        <p className="text-foreground-secondary dark:text-foreground-secondary-dark mb-7">
          {translations('description')} € {totalPrice.toFixed(2)}
        </p>

        <div className="flex justify-end space-x-4 font-semibold text-sm">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={`py-1.5 px-4 rounded-xl shadow-md transition-all duration-300 
                        bg-background dark:bg-background-dark shadow-background dark:shadow-background-dark`}
          >
            {translations('cancel')}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 bg-primary dark:bg-primary-dark py-1.5 px-4 
                        rounded-xl shadow-md shadow-primary dark:shadow-primary-dark transition-all duration-300`}
          >
            {translations('confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmOrderAlert
