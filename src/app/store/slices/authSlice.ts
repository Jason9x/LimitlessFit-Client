import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getAccessToken } from '@/utils/cookieUtils'
import { Role } from '@/types/models/user'

type AuthState = {
  isAuthenticated: boolean
  role: Role | null
}

const initialState: AuthState = {
  isAuthenticated: !!getAccessToken(),
  role: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    },
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload
    }
  }
})

export const { setAuthState, setRole } = authSlice.actions

export default authSlice.reducer
