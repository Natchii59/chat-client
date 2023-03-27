import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from '../index'
import { Image, Maybe } from '@/utils/graphqlTypes'

export interface UserStore {
  id: string
  username: string
  avatar?: Maybe<Image>
  createdAt: Date
  updatedAt: Date
}

export interface UserState {
  user?: UserStore
}

const initialState: UserState = {
  user: undefined
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserStore>) => {
      state.user = action.payload
    },
    logout: state => {
      state.user = undefined
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }
})

export const { setUser, logout } = userSlice.actions
export default userSlice.reducer

export const selectUser = (state: RootState) => state.user.user
