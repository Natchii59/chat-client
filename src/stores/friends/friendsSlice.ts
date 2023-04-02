import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from '../index'
import { Maybe } from '@/apollo/generated/graphql'

export interface UserFriendsStore {
  id: string
  username: string
  avatar?: Maybe<{
    key: string
    blurhash: string
  }>
  online?: boolean
}

export interface FriendsState {
  friends: UserFriendsStore[]
  receivedRequests: UserFriendsStore[]
  sentRequests: UserFriendsStore[]
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
    addFriend: (state, action: PayloadAction<UserFriendsStore>) => {
      state.friends.push(action.payload)
      state.friends = state.friends.sort((a, b) =>
        a.username.localeCompare(b.username)
      )
    },
    addReceivedRequest: (state, action: PayloadAction<UserFriendsStore>) => {
      state.receivedRequests.push(action.payload)
      state.receivedRequests = state.receivedRequests.sort((a, b) =>
        a.username.localeCompare(b.username)
      )
    },
    addSentRequest: (state, action: PayloadAction<UserFriendsStore>) => {
      state.sentRequests.push(action.payload)
      state.sentRequests = state.sentRequests.sort((a, b) =>
        a.username.localeCompare(b.username)
      )
    },
    removeFriend: (state, action: PayloadAction<UserFriendsStore['id']>) => {
      state.friends = state.friends.filter(
        friend => friend.id !== action.payload
      )
    },
    removeReceivedRequest: (
      state,
      action: PayloadAction<UserFriendsStore['id']>
    ) => {
      state.receivedRequests = state.receivedRequests.filter(
        request => request.id !== action.payload
      )
    },
    removeSentRequest: (
      state,
      action: PayloadAction<UserFriendsStore['id']>
    ) => {
      state.sentRequests = state.sentRequests.filter(
        request => request.id !== action.payload
      )
    },
    setFriendsStatus: (state, action: PayloadAction<string[]>) => {
      state.friends.forEach(friend => {
        const isOnline = action.payload.some(id => id === friend.id)
        friend.online = isOnline
      })
    },
    addFriendOnline: (state, action: PayloadAction<string>) => {
      const friend = state.friends.find(friend => friend.id === action.payload)
      if (friend) friend.online = true
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
  removeSentRequest,
  setFriendsStatus,
  addFriendOnline
} = friendsSlice.actions
export default friendsSlice.reducer

export const selectFriends = (state: RootState) => state.friends.friends
export const selectReceivedRequests = (state: RootState) =>
  state.friends.receivedRequests
export const selectSentRequests = (state: RootState) =>
  state.friends.sentRequests
