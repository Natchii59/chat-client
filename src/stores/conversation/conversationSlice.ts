import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '../index'
import { User } from '../user/userSlice'

export interface Conversation {
  id: string
  createdAt: Date
  updatedAt: Date
  user1: User
  user2: User
  messages: Message[]
  lastMessage: Message
  isTyping?: boolean
}

export interface Message {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  conversation: Conversation
  user: User
}

export interface ConversationState {
  id: string | null
  user: User | null
  messages: Message[]
  totalCount: number | null
  isTyping: boolean
}

const initialState: ConversationState = {
  id: null,
  user: null,
  messages: [],
  totalCount: null,
  isTyping: false
}

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConversationId: (state, action) => {
      state.id = action.payload
    },
    setConversationUser: (state, action) => {
      state.user = action.payload
    },
    setConversationMessages: (state, action) => {
      state.messages = action.payload
    },
    setConversationTotalCount: (state, action) => {
      state.totalCount = action.payload
    },
    setConversationIsTyping: (state, action) => {
      state.isTyping = action.payload
    },
    addConversationMessage: (state, action) => {
      state.messages.push(action.payload)
      state.totalCount = state.totalCount != null ? state.totalCount + 1 : null
    },
    removeConversationMessage: (state, action) => {
      state.messages = state.messages.filter(
        message => message.id !== action.payload
      )
    }
  }
})

export const {
  setConversationId,
  setConversationUser,
  setConversationMessages,
  setConversationTotalCount,
  setConversationIsTyping,
  addConversationMessage,
  removeConversationMessage
} = conversationSlice.actions
export default conversationSlice.reducer

export const selectConversationId = (state: RootState) => state.conversation.id
export const selectConversationUser = (state: RootState) =>
  state.conversation.user
export const selectConversationMessages = (state: RootState) =>
  state.conversation.messages
export const selectConversationTotalCount = (state: RootState) =>
  state.conversation.totalCount
export const selectConversationIsTyping = (state: RootState) =>
  state.conversation.isTyping
