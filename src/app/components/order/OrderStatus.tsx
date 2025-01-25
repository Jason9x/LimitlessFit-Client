import { useTranslations } from 'next-intl'

import { OrderStatusEnum } from '@/types/order'

type OrderStatusProps = {
  status: OrderStatusEnum
}

const OrderStatus = ({ status }: OrderStatusProps) => {
  const translations = useTranslations('OrderStatus')

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

  const statusLabels = {
    [OrderStatusEnum.Pending]: translations('pending'),
    [OrderStatusEnum.Processing]: translations('processing'),
    [OrderStatusEnum.Shipping]: translations('shipping'),
    [OrderStatusEnum.Delivered]: translations('delivered')
  }

  const { light, dark } = statusColors[status]
  const statusText = statusLabels[status]

  return (
    <div
      className={`px-4 py-0.5 font-semibold w-[110px] text-sm text-center shadow-md rounded-xl ${light} ${dark}`}
    >
      {statusText}
    </div>
  )
}

export default OrderStatus
