import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import orderBy from 'lodash/orderBy'

import { RootState } from '../index'
import { Maybe } from '@/apollo/generated/graphql'

export type ConversationsStore = {
  id: string
  createdAt: Date
  lastMessageSentAt?: Maybe<Date>
  creator: {
    id: string
    username: string
    avatar?: Maybe<{
      key: string
      blurhash: string
    }>
    unreadMessagesCount: number
  }
  recipient: {
    id: string
    username: string
    avatar?: Maybe<{
      key: string
      blurhash: string
    }>
    unreadMessagesCount: number
  }
  isTyping?: boolean
}

export interface ConversationsState {
  conversations: ConversationsStore[]
}

const initialState: ConversationsState = {
  conversations: []
}

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversations: (
      state,
      action: PayloadAction<ConversationsState['conversations']>
    ) => {
      state.conversations = action.payload
    },
    setConversationsUnreadMessagesCount: (
      state,
      action: PayloadAction<{
        userId: string
        conversationId: string
        unreadMessagesCount: number
      }>
    ) => {
      const conversation = state.conversations.find(
        conversation => conversation.id === action.payload.conversationId
      )
      if (conversation) {
        const user =
          conversation.creator.id === action.payload.userId
            ? conversation.creator
            : conversation.recipient

        user.unreadMessagesCount = action.payload.unreadMessagesCount
      }
    },
    addConversation: (state, action: PayloadAction<ConversationsStore>) => {
      state.conversations = [action.payload, ...state.conversations]
    },
    addConversationWithOrderBy: (
      state,
      action: PayloadAction<ConversationsStore>
    ) => {
      state.conversations = orderBy(
        [action.payload, ...state.conversations],
        conversation =>
          conversation.lastMessageSentAt ?? conversation.createdAt,
        'desc'
      )
    },
    addTypingConversation: (
      state,
      action: PayloadAction<ConversationsStore['id']>
    ) => {
      const conversation = state.conversations.find(
        conversation => conversation.id === action.payload
      )
      if (conversation) {
        conversation.isTyping = true
      }
    },
    updateConversationToTop: (
      state,
      action: PayloadAction<ConversationsStore>
    ) => {
      state.conversations = [
        action.payload,
        ...state.conversations.filter(conv => conv.id !== action.payload.id)
      ]
    },
    removeConversation: (
      state,
      action: PayloadAction<ConversationsStore['id']>
    ) => {
      state.conversations = state.conversations.filter(
        conversation => conversation.id !== action.payload
      )
    },
    removeTypingConversation: (
      state,
      action: PayloadAction<ConversationsStore['id']>
    ) => {
      const conversation = state.conversations.find(
        conversation => conversation.id === action.payload
      )
      if (conversation) {
        conversation.isTyping = false
      }
    }
  }
})

export const {
  setConversations,
  setConversationsUnreadMessagesCount,
  addConversation,
  addConversationWithOrderBy,
  addTypingConversation,
  updateConversationToTop,
  removeConversation,
  removeTypingConversation
} = conversationsSlice.actions
export default conversationsSlice.reducer

export const selectConversations = (state: RootState) =>
  state.conversations.conversations
