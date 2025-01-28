import { useTranslations } from 'next-intl'

type OrderTableHeaderProps = {
  isMyOrders: boolean
}

const OrdersTableHeader = ({ isMyOrders }: OrderTableHeaderProps) => {
  const translations = useTranslations('OrdersTableHeader')
  const orderTranslations = useTranslations('Order')

  return (
    <thead>
      <tr className="text-left border-b-[1px] border-gray-300 dark:border-gray-600">
        <th className="pb-4 pt-6 px-8 font-semibold">Id</th>

        <th className="pb-4 pt-6 px-8 font-semibold">
          {isMyOrders ? orderTranslations('date') : translations('client')}
        </th>

        {!isMyOrders && (
          <th className="pb-4 pt-6 px-8 font-semibold">
            {translations('created')}
          </th>
        )}

        <th className="pb-4 pt-6 px-8 font-semibold">
          {orderTranslations('total')}
        </th>

        <th className="pb-4 pt-6 px-8 font-semibold">
          {orderTranslations('status')}
        </th>
      </tr>
    </thead>
  )
}

export default OrdersTableHeader
