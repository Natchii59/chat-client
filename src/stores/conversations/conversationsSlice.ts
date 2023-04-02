import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import orderBy from 'lodash/orderBy'

import { RootState } from '../index'
import { Maybe, Message } from '@/apollo/generated/graphql'

export type ConversationsStore = {
  id: string
  createdAt: Date
  user: {
    id: string
    username: string
    avatar?: Maybe<{
      key: string
      blurhash: string
    }>
  }
  lastMessage?: Maybe<{
    id: string
    content: string
    createdAt: Date
  }>
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
    addConversation: (state, action: PayloadAction<ConversationsStore>) => {
      state.conversations = [action.payload, ...state.conversations]
    },
    addConversationWithSort: (
      state,
      action: PayloadAction<ConversationsStore>
    ) => {
      state.conversations = orderBy(
        [action.payload, ...state.conversations],
        conversation => {
          if (conversation.lastMessage) {
            return conversation.lastMessage.createdAt
          }

          return conversation.createdAt
        },
        'desc'
      )
    },
    removeConversation: (
      state,
      action: PayloadAction<ConversationsStore['id']>
    ) => {
      state.conversations = state.conversations.filter(
        conversation => conversation.id !== action.payload
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
    },
    updateConversationWithNewMessage: (
      state,
      action: PayloadAction<Message>
    ) => {
      if (action.payload.conversation) {
        state.conversations = [
          {
            ...action.payload.conversation,
            lastMessage: action.payload
          },
          ...state.conversations.filter(
            conversation =>
              action.payload.conversation &&
              conversation.id !== action.payload.conversation.id
          )
        ]
      }
    },
    updateConversationWithUpdatedMessage: (
      state,
      action: PayloadAction<{
        conversationId: ConversationsStore['id']
        message: Message
      }>
    ) => {
      const conversation = state.conversations.find(
        conversation => conversation.id === action.payload.conversationId
      )

      if (
        conversation &&
        conversation.lastMessage?.id === action.payload.message.id
      ) {
        conversation.lastMessage = action.payload.message
      }
    },
    updateConversationWithDeletedMessage: (
      state,
      action: PayloadAction<{
        conversationId: ConversationsStore['id']
        newLastMessage: ConversationsStore['lastMessage']
      }>
    ) => {
      const conversation = state.conversations.find(
        conversation => conversation.id === action.payload.conversationId
      )
      if (conversation) {
        conversation.lastMessage = action.payload.newLastMessage
      }
    }
  }
})

export const {
  setConversations,
  addConversation,
  addConversationWithSort,
  removeConversation,
  addTypingConversation,
  removeTypingConversation,
  updateConversationWithNewMessage,
  updateConversationWithUpdatedMessage,
  updateConversationWithDeletedMessage
} = conversationsSlice.actions
export default conversationsSlice.reducer

export const selectConversations = (state: RootState) =>
  state.conversations.conversations
