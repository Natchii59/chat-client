import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '../index'
import { Conversation } from '../conversation/conversationSlice'

export interface User {
  id: string
  username: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  conversations: Conversation[]
  friends: User[]
  receivedRequests: User[]
  sentRequests: User[]
}

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
