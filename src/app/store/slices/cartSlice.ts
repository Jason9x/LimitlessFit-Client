import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Item } from '@/types/models/item'

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
    addToCart: (state, { payload: item }: PayloadAction<Item>) => {
      const existingIndex = state.items.findIndex(({ id }) => id === item.id)
      const hasItem = existingIndex !== -1

      const updatedItem = hasItem
        ? {
            ...state.items[existingIndex],
            quantity: state.items[existingIndex].quantity + 1
          }
        : { ...item, quantity: 1 }

      state.items = hasItem
        ? state.items.map((cartItem, index) =>
            index === existingIndex ? updatedItem : cartItem
          )
        : [...state.items, updatedItem]

      state.lastAddedItemIndex = hasItem ? existingIndex : state.items.length
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(({ id }) => id !== action.payload)
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ itemId: number; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload
      const item = state.items.find(({ id }) => id === itemId)

      if (item) item.quantity = Math.max(item.quantity + quantity, 1)
    },
    emptyCart: state => {
      state.items = []
      state.lastAddedItemIndex = null
    }
  }
})

export const { addToCart, removeFromCart, updateQuantity, emptyCart } =
  cartSlice.actions

export default cartSlice.reducer
