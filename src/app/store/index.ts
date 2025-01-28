import { configureStore } from '@reduxjs/toolkit'

import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import signalRReducer from './slices/signalRSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    signalR: signalRReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export default store
