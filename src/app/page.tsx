'use client'

import React, { useState } from 'react'

const OrderSelection = () => {
  // Internal state for selected order ID
  const [selectedOrderId, setSelectedOrderId] = useState<string>('')

  // Handle selection change
  const handleSelect = (orderId: string) => {
    setSelectedOrderId(orderId)
  }

  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Select an Order</h2>
      <ul>
        <li
          className={`p-2 cursor-pointer ${selectedOrderId === '1' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => handleSelect('1')}
        >
          Order 1
        </li>
        <li
          className={`p-2 cursor-pointer ${selectedOrderId === '2' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => handleSelect('2')}
        >
          Order 2
        </li>
      </ul>
    </div>
  )
}

export default OrderSelection
