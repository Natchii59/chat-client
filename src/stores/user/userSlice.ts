import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '../index'
import { Conversation } from '../conversation/conversationSlice'

export interface Image {
  id: string
  createdAt: Date
  updatedAt: Date
  key: string
  blurhash: string
}

export interface User {
  id: string
  username: string
  avatar?: Image
  createdAt: Date
  updatedAt: Date
  conversations: Conversation[]
  friends: User[]
  receivedRequests: User[]
  sentRequests: User[]
}

export interface UserState {
  user: User | null
}

const initialState: UserState = {
  user: null
}

export const userSlice = createSlice({
  name: 'user',
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

export const { setUser, logout } = userSlice.actions
export default userSlice.reducer

export const selectUser = (state: RootState) => state.user.user
