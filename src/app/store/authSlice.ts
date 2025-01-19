import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

type AuthState = {
  isAuthenticated: boolean
}

const initialState: AuthState = {
  isAuthenticated: !!Cookies.get('jwtToken')
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    }
  }
})

export const { setAuthState } = authSlice.actions

export default authSlice.reducer
