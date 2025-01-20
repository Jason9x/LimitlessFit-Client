import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { RootState } from '@/store'
import { removeFromCart, updateQuantity } from '@/store/slices/cartSlice'

import SubmitButton from '@/components/SubmitBotton'
import ConfirmOrderAlert from './ConfirmOrderAlert'

const Cart = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()
  const cartTranslations = useTranslations('Cart')
  const itemsTranslations = useTranslations('OrderItem')
  const [showConfirmAlert, setShowConfirmAlert] = useState(false)

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

  const totalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2)

  return (
    <div className="flex flex-col justify-center bg-secondary dark:bg-secondary-dark px-4 sm:px-10 h-full">
      <h2 className="text-xl font-semibold text-center sm:text-left">
        {cartTranslations('myOrder')}
      </h2>

      <hr className="border-gray-300 dark:border-gray-700 mt-4" />

      <ul>
        {cartItems.map(item => (
          <li
            key={item.id}
            className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-md mb-4 transition-all duration-300"
          >
            <div className="flex items-center mb-4 sm:mb-0">
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

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-foreground dark:text-foreground-dark">
                <button
                  onClick={() => handleDecreaseQuantity(item.id)}
                  className="transition-all duration-300 transform hover:scale-110 hover:opacity-80 p-3 text-lg sm:text-xl"
                >
                  -
                </button>

                <span className="text-sm sm:text-base">{item.quantity}</span>

                <button
                  onClick={() => handleIncreaseQuantity(item.id)}
                  className="transition-all duration-300 transform hover:scale-110 hover:opacity-80 p-3 text-lg sm:text-xl"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleRemoveFromCart(item.id)}
                className="transition-all duration-300 transform hover:scale-125 hover:rotate-45 hover:text-red-600 p-2"
              >
                <Image
                  width={20}
                  height={20}
                  src={'/icons/trash.svg'}
                  alt={'Trash'}
                  className="transition-all duration-300 transform"
                />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <SubmitButton
        label={cartTranslations('confirmOrder')}
        onClick={handleSubmitOrder}
      />

      {showConfirmAlert && (
        <ConfirmOrderAlert
          totalPrice={Number(totalPrice)}
          onConfirm={handleConfirmOrder}
          onCancel={handleCancelOrder}
        />
      )}
    </div>
  )
}

export default Cart
