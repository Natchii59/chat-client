import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from '../index'
import { User } from '@/utils/graphqlTypes'

export interface FriendsState {
  friends: User[]
  receivedRequests: User[]
  sentRequests: User[]
}

const initialState: FriendsState = {
  friends: [],
  receivedRequests: [],
  sentRequests: []
}

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<FriendsState['friends']>) => {
      state.friends = action.payload
    },
    setReceivedRequests: (
      state,
      action: PayloadAction<FriendsState['receivedRequests']>
    ) => {
      state.receivedRequests = action.payload
    },
    setSentRequests: (
      state,
      action: PayloadAction<FriendsState['sentRequests']>
    ) => {
      state.sentRequests = action.payload
    },
    addFriend: (state, action: PayloadAction<User>) => {
      state.friends.push(action.payload)
      state.friends = state.friends.sort((a, b) =>
        a.username.localeCompare(b.username)
      )
    },
    addReceivedRequest: (state, action: PayloadAction<User>) => {
      state.receivedRequests.push(action.payload)
      state.receivedRequests = state.receivedRequests.sort((a, b) =>
        a.username.localeCompare(b.username)
      )
    },
    addSentRequest: (state, action: PayloadAction<User>) => {
      state.sentRequests.push(action.payload)
      state.sentRequests = state.sentRequests.sort((a, b) =>
        a.username.localeCompare(b.username)
      )
    },
    removeFriend: (state, action: PayloadAction<User['id']>) => {
      state.friends = state.friends.filter(
        friend => friend.id !== action.payload
      )
    },
    removeReceivedRequest: (state, action: PayloadAction<User['id']>) => {
      state.receivedRequests = state.receivedRequests.filter(
        request => request.id !== action.payload
      )
    },
    removeSentRequest: (state, action: PayloadAction<User['id']>) => {
      state.sentRequests = state.sentRequests.filter(
        request => request.id !== action.payload
      )
    }
  }
})

export const {
  setFriends,
  setReceivedRequests,
  setSentRequests,
  addFriend,
  addReceivedRequest,
  addSentRequest,
  removeFriend,
  removeReceivedRequest,
  removeSentRequest
} = friendsSlice.actions
export default friendsSlice.reducer

export const selectFriends = (state: RootState) => state.friends.friends
export const selectReceivedRequests = (state: RootState) =>
  state.friends.receivedRequests
export const selectSentRequests = (state: RootState) =>
  state.friends.sentRequests
