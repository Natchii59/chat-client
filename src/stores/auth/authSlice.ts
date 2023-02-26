import { createSlice } from '@reduxjs/toolkit'
import { Socket } from 'socket.io-client'

import { RootState } from '../index'
import { User } from '../../utils/types'

export interface AuthState {
  user: User | null
}

const initialState: AuthState = {
  user: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    logout: state => {
      state.user = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer

export const selectUser = (state: RootState) => state.auth.user
