import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

import { RootState } from '@/store'
import { removeFromCart, updateQuantity } from '@/store/slices/cartSlice'

import SubmitButton from '@/components/SubmitBotton'
import ConfirmOrderAlert from './ConfirmOrderAlert'
import Pagination from '@/components/ui/Pagination'

const ITEMS_PER_PAGE = 3

const Cart = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const lastAddedItemIndex = useSelector(
    (state: RootState) => state.cart.lastAddedItemIndex
  )

  const dispatch = useDispatch()

  const cartTranslations = useTranslations('Cart')
  const itemsTranslations = useTranslations('OrderItem')

  const [showConfirmAlert, setShowConfirmAlert] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(cartItems.length / ITEMS_PER_PAGE)

  const handleRemoveFromCart = (itemId: number) =>
    dispatch(removeFromCart(itemId))

  const handleIncreaseQuantity = (itemId: number) =>
    dispatch(updateQuantity({ itemId, quantity: 1 }))

  const handleDecreaseQuantity = (itemId: number) =>
    dispatch(updateQuantity({ itemId, quantity: -1 }))

  const handleSubmitOrder = () => {
    setShowConfirmAlert(true)
  }

  const handleConfirmOrder = () => {
    alert('Order confirmed!')
    setShowConfirmAlert(false)
  }

  const handleCancelOrder = () => setShowConfirmAlert(false)

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = cartItems.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const totalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2)

  useEffect(() => {
    if (lastAddedItemIndex === null) return

    const newPage = Math.ceil((lastAddedItemIndex + 1) / ITEMS_PER_PAGE)
    setCurrentPage(newPage)
  }, [lastAddedItemIndex])

  return (
    <div className="flex flex-col justify-center bg-secondary dark:bg-secondary-dark px-10 h-full">
      <h2 className="text-xl font-semibold">{cartTranslations('myOrder')}</h2>

      <hr className="border-gray-300 dark:border-gray-700 my-4" />

      <ul>
        {currentItems.map(item => (
          <li
            key={item.id}
            className="flex flex-col lg:flex-row justify-between items-center p-2 rounded-md transition-all duration-300"
          >
            <div className="flex items-center mb-2 lg:mr-10">
              <Image
                src={item.imageUrl}
                alt={item.nameKey}
                width={30}
                height={30}
                className="mr-4"
              />

              <div>
                <p className="text-foreground dark:text-foreground-dark font-semibold text-sm sm:text-base">
                  {itemsTranslations(item.nameKey)}
                </p>

                <p className="text-foreground-secondary dark:text-foreground-secondary-dark text-xs sm:text-sm">
                  € {item.price}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-2">
              <div className="flex items-center space-x-2 text-foreground dark:text-foreground-dark">
                <button
                  onClick={() => handleDecreaseQuantity(item.id)}
                  className="transition-all duration-300 hover:shadow-md rounded-xl py-0 px-2 text-md"
                >
                  -
                </button>

                <span className="text-sm">{item.quantity}</span>

                <button
                  onClick={() => handleIncreaseQuantity(item.id)}
                  className="transition-all duration-300 hover:shadow-md rounded-xl py-0 px-2 text-md"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleRemoveFromCart(item.id)}
                className="transition-all duration-300 hover:shadow-md shadow-red-500 border border-red-500
                           rounded-xl p-2 flex items-center justify-center w-8 h-8"
              >
                <Image
                  width={20}
                  height={20}
                  src={'/icons/trash.svg'}
                  alt={'Trash'}
                  className="transition-all duration-300"
                />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showConfirmAlert && (
        <ConfirmOrderAlert
          totalPrice={Number(totalPrice)}
          onConfirm={handleConfirmOrder}
          onCancel={handleCancelOrder}
        />
      )}

      <SubmitButton
        label={cartTranslations('confirmOrder')}
        onClick={handleSubmitOrder}
        className="mt-4"
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default Cart
