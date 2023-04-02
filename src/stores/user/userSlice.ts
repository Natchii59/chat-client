import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from '../index'
import { Maybe } from '@/apollo/generated/graphql'

export interface UserStore {
  id: string
  username: string
  avatar?: Maybe<{
    key: string
    blurhash: string
  }>
  createdAt: Date
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
    setUser: (state, action: PayloadAction<UserStore | undefined>) => {
      state.user = action.payload
    }
  }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer

export const selectUser = (state: RootState) => state.user.user
