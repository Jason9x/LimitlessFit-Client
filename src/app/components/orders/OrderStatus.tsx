import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { useRef, useState } from 'react'

import useClickOutside from '@/hooks/useClickOutside'

import { OrderStatusEnum } from '@/types/order'

type OrderStatusProps = {
  status: OrderStatusEnum
  isDropdown?: boolean
  onChange?: (status: OrderStatusEnum) => void
}

const OrderStatus = ({
  status,
  isDropdown = false,
  onChange
}: OrderStatusProps) => {
  const translations = useTranslations('OrderStatus')
  const [isOpen, setIsOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useClickOutside([ref], () => setIsOpen(false))

  const statusColors = {
    [OrderStatusEnum.Pending]: {
      light:
        'bg-order-status-pending-background text-order-status-pending-text shadow-order-status-pending-background',
      dark: 'dark:bg-order-status-pending-background-dark dark:text-order-status-pending-text-dark dark:shadow-order-status-pending-background-dark'
    },
    [OrderStatusEnum.Processing]: {
      light:
        'bg-order-status-processing-background text-order-status-processing-text shadow-order-status-processing-background',
      dark: 'dark:bg-order-status-processing-background-dark dark:text-order-status-processing-text-dark dark:shadow-order-status-processing-background-dark'
    },
    [OrderStatusEnum.Shipping]: {
      light:
        'bg-order-status-shipping-background text-order-status-shipping-text shadow-order-status-shipping-background',
      dark: 'dark:bg-order-status-shipping-background-dark dark:text-order-status-shipping-text-dark dark:shadow-order-status-shipping-background-dark'
    },
    [OrderStatusEnum.Delivered]: {
      light:
        'bg-order-status-delivered-background text-order-status-delivered-text shadow-order-status-delivered-background',
      dark: 'dark:bg-order-status-delivered-background-dark dark:text-order-status-delivered-text-dark dark:shadow-order-status-delivered-background-dark'
    }
  }

  const statusLabels: Record<OrderStatusEnum, string> = {
    [OrderStatusEnum.Pending]: translations('pending'),
    [OrderStatusEnum.Processing]: translations('processing'),
    [OrderStatusEnum.Shipping]: translations('shipping'),
    [OrderStatusEnum.Delivered]: translations('delivered')
  }

  const { light, dark } = statusColors[status]
  const statusText = statusLabels[status]

  const Dropdown = () => (
    <div ref={ref} className="relative">
      <div
        onClick={() => setIsOpen(previousState => !previousState)}
        className={`px-4 py-0.5 font-semibold text-sm text-center shadow-md rounded-xl 
                    w-[130px] cursor-pointer ${light} ${dark}`}
      >
        {statusLabels[status]}

        <Image
          src="/icons/arrows/arrow-expand.svg"
          width={10}
          height={10}
          alt="Arrow expand"
          className={`inline-block ml-2 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </div>

      {isOpen && (
        <ul
          className="absolute z-10 bg-background dark:bg-background-dark text-foreground text-sm
                    dark:text-foreground-dark rounded-xl shadow-md mt-2"
        >
          {Object.entries(OrderStatusEnum)
            .filter(([, value]) => isNaN(Number(value)))
            .map(([key]) => (
              <li
                key={key}
                onClick={() => {
                  onChange?.(key as unknown as OrderStatusEnum)
                  setIsOpen(false)
                }}
                className="px-4 py-1 hover:bg-gray-200 cursor-pointer"
              >
                {statusLabels[key as unknown as OrderStatusEnum]}
              </li>
            ))}
        </ul>
      )}
    </div>
  )

  if (isDropdown) return <Dropdown />

  return (
    <div
      className={`px-4 py-0.5 font-semibold w-[110px] text-sm text-center shadow-md rounded-xl ${light} ${dark}`}
    >
      {statusText}
    </div>
  )
}

export default OrderStatus
