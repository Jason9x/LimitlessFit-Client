import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Item } from '@/types/items'

type CartItem = Omit<Item, 'descriptionKey'> & {
  quantity: number
}

type CartState = {
  items: CartItem[]
  lastAddedItemIndex: number | null
}

const initialState: CartState = {
  items: [],
  lastAddedItemIndex: null
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Item>) => {
      const item = action.payload
      const existingItem = state.items.find(cartItem => cartItem.id === item.id)

      const updatedItem = existingItem
        ? { ...existingItem, quantity: existingItem.quantity + 1 }
        : { ...item, quantity: 1 }

      state.items = existingItem
        ? state.items.map(cartItem =>
            cartItem.id === item.id ? updatedItem : cartItem
          )
        : [...state.items, updatedItem]

      state.lastAddedItemIndex = state.items.findIndex(
        cartItem => cartItem.id === updatedItem.id
      )
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ itemId: number; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload
      const item = state.items.find(cartItem => cartItem.id === itemId)

      if (item) item.quantity = Math.max(item.quantity + quantity, 1)
    }
  }
})

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions

export default cartSlice.reducer
