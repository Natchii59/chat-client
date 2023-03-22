import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '../index'
import { User } from '../user/userSlice'

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
    setFriends: (state, action) => {
      state.friends = action.payload
    },
    setReceivedRequests: (state, action) => {
      state.receivedRequests = action.payload
    },
    setSentRequests: (state, action) => {
      state.sentRequests = action.payload
    },
    addFriend: (state, action) => {
      state.friends.push(action.payload)
      state.friends = state.friends.sort((a, b) =>
        a.username.localeCompare(b.username)
      )
    },
    addReceivedRequest: (state, action) => {
      state.receivedRequests.push(action.payload)
      state.receivedRequests = state.receivedRequests.sort((a, b) =>
        a.username.localeCompare(b.username)
      )
    },
    addSentRequest: (state, action) => {
      state.sentRequests.push(action.payload)
      state.sentRequests = state.sentRequests.sort((a, b) =>
        a.username.localeCompare(b.username)
      )
    },
    removeFriend: (state, action) => {
      state.friends = state.friends.filter(
        friend => friend.id !== action.payload
      )
    },
    removeReceivedRequest: (state, action) => {
      state.receivedRequests = state.receivedRequests.filter(
        request => request.id !== action.payload
      )
    },
    removeSentRequest: (state, action) => {
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
