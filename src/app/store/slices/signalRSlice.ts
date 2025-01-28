import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SignalRState = {
  connections: Record<string, boolean>
}

const initialState: SignalRState = {
  connections: {}
}

const signalRSlice = createSlice({
  name: 'signalR',
  initialState,
  reducers: {
    connect: (state, action: PayloadAction<string>) => {
      state.connections[action.payload] = true
    },
    disconnect: (state, action: PayloadAction<string>) => {
      state.connections[action.payload] = false
    }
  }
})

export const { connect, disconnect } = signalRSlice.actions

export default signalRSlice.reducer
