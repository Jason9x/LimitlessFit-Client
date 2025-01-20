'use client'

import OrderSelection from '@/components/order/OrderSelection'
import Cart from '@/components/order/Cart'

const Index = () => (
  <div className="flex space-x-8">
    <div className="flex-1">
      <OrderSelection />
    </div>
    <div className="flex-1">
      <Cart />
    </div>
  </div>
)

export default Index
