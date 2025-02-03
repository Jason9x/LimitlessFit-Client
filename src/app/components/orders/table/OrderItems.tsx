import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { useState } from 'react'

import Pagination from '@/components/ui/Pagination'

import { OrderItem } from '@/types/models/order'

type OrderItemsProps = {
  items: OrderItem[]
}

const MAX_ITEMS_PER_PAGE = 3

const OrderItems = ({ items }: OrderItemsProps) => {
  const translations = useTranslations('OrderItems')
  const registerTranslations = useTranslations('Register')
  const itemsTranslations = useTranslations('Items')

  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / MAX_ITEMS_PER_PAGE)

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber)

  const paginatedItems = items.slice(
    (currentPage - 1) * MAX_ITEMS_PER_PAGE,
    currentPage * MAX_ITEMS_PER_PAGE
  )

  const headerCellClass =
    'px-6 py-3 font-semibold text-left border-b-[1px] border-gray-300 dark:border-gray-600'

  return (
    <div>
      <table className="w-[90%] mx-auto">
        <thead>
          <tr>
            <th className={`${headerCellClass} w-1/12`}>Id</th>
            <th className={`${headerCellClass} w-2/12`}>
              {translations('image')}
            </th>

            <th className={`${headerCellClass} w-3/12`}>
              {registerTranslations('name')}
            </th>

            <th className={`${headerCellClass} w-2/12`}>
              {translations('price')}
            </th>

            <th className={`${headerCellClass} w-6/12`}>
              {translations('description')}
            </th>

            <th className={`${headerCellClass} w-1/6`}>
              {translations('quantity')}
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedItems.map((item, key) => (
            <tr key={key}>
              <td className="px-6 py-2 text-foreground-secondary dark:text-foreground-secondary-dark text-left">
                {item.id}
              </td>

              <td className="px-6 py-2 text-left">
                <Image
                  src={item.imageUrl}
                  alt={item.nameKey}
                  width={30}
                  height={30}
                  priority
                />
              </td>

              <td className="px-6 py-2 text-foreground-secondary dark:text-foreground-secondary-dark text-left">
                {itemsTranslations(item.nameKey)}
              </td>

              <td className="px-6 py-2 text-foreground-secondary dark:text-foreground-secondary-dark text-left">
                € {item.price}
              </td>

              <td className="px-6 py-2 text-foreground-secondary dark:text-foreground-secondary-dark text-left break-words">
                {itemsTranslations(item.descriptionKey)}
              </td>

              <td className="px-6 py-2 text-foreground-secondary dark:text-foreground-secondary-dark text-left">
                {item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        bgClasses="bg-background dark:bg-background-dark"
      />
    </div>
  )
}

export default OrderItems
