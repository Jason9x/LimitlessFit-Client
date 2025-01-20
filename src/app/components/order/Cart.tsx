import { useSelector, useDispatch } from 'react-redux'

import Image from 'next/image'

import { RootState } from '@/store'
import { removeFromCart } from '@/store/slices/cartSlice'

const Cart = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()

  const handleRemoveFromCart = (itemId: number) => {
    dispatch(removeFromCart(itemId))
  }

  return (
    <div className="cart">
      <h2 className="text-xl font-semibold">Your Cart</h2>
      <ul className="mt-4">
        {cartItems.length === 0 ? (
          <li>Your cart is empty</li>
        ) : (
          cartItems.map(item => (
            <li
              key={item.id}
              className="flex justify-between items-center p-4 bg-secondary dark:bg-secondary-dark rounded-md shadow-sm"
            >
              <div className="flex items-center">
                <Image
                  src={item.imageUrl}
                  alt={item.nameKey}
                  width={16}
                  height={16}
                  className="mr-4"
                />

                <div>
                  <p className="text-foreground dark:text-foreground-dark font-semibold">
                    {item.nameKey}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-gray-800 font-medium">{item.price} USD</p>
                <span className="text-gray-500">Qty: {item.quantity}</span>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <div className="mt-4">
        <p className="font-semibold">
          Total:{' '}
          {cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          )}{' '}
          USD
        </p>
      </div>
    </div>
  )
}

export default Cart
