'use client'

import { useSelector } from 'react-redux'

import OrderSelection from '@/components/order/OrderSelection'
import Cart from '@/components/order/Cart'

import { RootState } from '@/store'

const Index = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items)

  return (
    <div className="flex">
      <div className="flex-1">
        <OrderSelection />
      </div>

      {cartItems.length > 0 && (
        <div>
          <Cart />
        </div>
      )}
    </div>
  )
}

export default Index
