import { useTranslations } from 'next-intl'

type ConfirmOrderAlertProps = {
  totalPrice: number
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmOrderAlert = ({
  totalPrice,
  onConfirm,
  onCancel
}: ConfirmOrderAlertProps) => {
  const translations = useTranslations('ConfirmOrderAlert')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-secondary dark:bg-secondary-dark py-10 px-[50px] rounded-3xl shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{translations('title')}</h3>

        <p className="text-foreground-secondary dark:text-foreground-secondary-dark mb-7">
          {translations('description')} € {totalPrice}.
        </p>

        <div className="flex justify-end space-x-4 font-semibold">
          <button
            onClick={onCancel}
            className="bg-background dark:bg-background-dark py-1.5 px-4 rounded-xl shadow-md transition-all duration-500
                        shadow-background dark:shadow-background-dark ease-in-out transform hover:scale-105 hover:bg-opacity-90 hover:shadow-xl"
          >
            {translations('cancel')}
          </button>

          <button
            onClick={onConfirm}
            className="bg-primary dark:bg-primary-dark py-1.5 px-4 rounded-xl shadow-md shadow-primary dark:shadow-primary-dark
                        transition-all duration-500 ease-in-out transform hover:scale-105 hover:bg-opacity-90 hover:shadow-lg"
          >
            {translations('confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmOrderAlert
