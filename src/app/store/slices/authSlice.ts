import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getAccessToken } from '@/utils/cookieUtils'

type AuthState = {
  isAuthenticated: boolean
}

const initialState: AuthState = {
  isAuthenticated: !!getAccessToken()
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
