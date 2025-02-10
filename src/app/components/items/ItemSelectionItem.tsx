import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { useDispatch } from 'react-redux'

import { Item } from '@/types/models/item'

import { addToCart } from '@/store/slices/cartSlice'

type OrderItemProps = {
  item: Item
}

const ItemSelectionItem = ({ item }: OrderItemProps) => {
  const { imageUrl, nameKey, descriptionKey, price } = item

  const translations = useTranslations('Items')
  const dispatch = useDispatch()

  return (
    <li>
      <button
        onClick={() => dispatch(addToCart(item))}
        className="min-w-full bg-secondary dark:bg-secondary-dark border rounded-2xl shadow-sm hover:shadow-md transition-shadow border-none"
      >
        <div className="relative flex flex-col items-center px-5 pt-10 pb-6">
          <Image
            src={imageUrl}
            alt={nameKey}
            width={100}
            height={100}
            className="absolute -top-10"
            priority
          />

          <p className="text-foreground dark:text-foreground-dark font-semibold mt-6">
            {translations(nameKey)}
          </p>

          <p className="text-foreground dark:text-foreground-dark my-2">
            € {price}
          </p>

          <p className="text-foreground-secondary dark:text-foreground-secondary-dark text-sm">
            {translations(descriptionKey)}
          </p>
        </div>
      </button>
    </li>
  )
}

export default ItemSelectionItem
