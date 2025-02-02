import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRef, useState } from 'react'
import useClickOutside from '@/hooks/useClickOutside'
import { OrderStatusEnum } from '@/types/models/order'

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
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
    'bottom'
  )
  const triggerRef = useRef<HTMLDivElement>(null)
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

  const calculateDropdownPosition = (
    triggerElement: HTMLElement
  ): 'top' | 'bottom' => {
    const DROPDOWN_ESTIMATED_HEIGHT = 144 // 4 items × 36px each.
    const triggerRect = triggerElement.getBoundingClientRect()
    const spaceBelowWindow = window.innerHeight - triggerRect.bottom

    return spaceBelowWindow < DROPDOWN_ESTIMATED_HEIGHT ? 'top' : 'bottom'
  }

  const handleTriggerClick = () => {
    const willOpen = !isOpen

    if (willOpen && triggerRef.current)
      setDropdownPosition(calculateDropdownPosition(triggerRef.current))

    setIsOpen(willOpen)
  }

  const { light, dark } = statusColors[status]
  const statusText = statusLabels[status]

  const Dropdown = () => (
    <div ref={ref} className="relative">
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={`px-4 py-0.5 font-semibold text-sm text-center shadow-md
                    rounded-xl w-[130px] cursor-pointer ${light} ${dark}`}
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
          className={`absolute z-50 bg-background dark:bg-background-dark text-foreground text-sm
                      rounded-xl dark:text-foreground-dark shadow-md ${
                        dropdownPosition === 'bottom'
                          ? 'mt-2'
                          : 'mb-2 bottom-full'
                      } w-[130px]`}
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
                className="px-4 py-1 hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-700"
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
