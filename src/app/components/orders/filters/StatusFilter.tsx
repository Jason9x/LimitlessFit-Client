import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { OrderStatusEnum } from '@/types/models/order'

type StatusFilterProps = {
  status?: OrderStatusEnum
  onStatusChange: (status: OrderStatusEnum | undefined) => void
  onReset: () => void
  isOpen: boolean
  onToggle: () => void
}

const StatusFilter = ({
  status,
  onStatusChange,
  onReset,
  isOpen,
  onToggle
}: StatusFilterProps) => {
  const translations = useTranslations('OrdersFilter')
  const orderTranslations = useTranslations('Order')
  const statusTranslations = useTranslations('OrderStatus')

  return (
    <div className="flex items-center space-x-2">
      <button onClick={onToggle} className="flex items-center">
        <Image
          src="/icons/filter/purchase-order.svg"
          width={20}
          height={20}
          alt="Status"
          className="dark:invert mr-1.5"
          priority
        />

        {translations('orderByStatus')}

        <Image
          src="/icons/arrows/arrow-expand.svg"
          width={10}
          height={10}
          alt="Arrow expand"
          className={`transition-transform duration-300 ease-out dark:invert ml-2`}
          priority
        />
      </button>

      {status && (
        <button
          onClick={onReset}
          className="ml-2 font-semibold text-[10px] text-red-500"
        >
          X
        </button>
      )}

      {isOpen && (
        <div className="absolute bg-secondary dark:bg-secondary-dark p-4 shadow-lg rounded-md z-10 w-64 mt-2 right-0 top-full">
          <div className="flex flex-col mb-4">
            <label htmlFor="status" className="mb-2 font-semibold">
              {orderTranslations('status')}
            </label>

            <select
              id="status"
              value={status || ''}
              onChange={event =>
                onStatusChange(event.target.value as unknown as OrderStatusEnum)
              }
              className="p-2 rounded-md w-full"
            >
              <option value="" disabled>
                {translations('selectStatus')}
              </option>

              <option value={OrderStatusEnum.Pending}>
                {statusTranslations('pending')}
              </option>

              <option value={OrderStatusEnum.Processing}>
                {statusTranslations('processing')}
              </option>

              <option value={OrderStatusEnum.Shipping}>
                {statusTranslations('shipping')}
              </option>

              <option value={OrderStatusEnum.Delivered}>
                {statusTranslations('delivered')}
              </option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatusFilter
