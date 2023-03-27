import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import orderBy from 'lodash/orderBy'

import { RootState } from '../index'
import { Conversation, Message } from '@/utils/graphqlTypes'

export type ConversationType = Conversation & {
  isTyping?: boolean
}

export interface UpdateConversationWithDeletedMessagePayload {
  conversationId: ConversationType['id']
  newLastMessage: Message
}

export interface ConversationsState {
  conversations: ConversationType[]
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
    addConversation: (state, action: PayloadAction<ConversationType>) => {
      state.conversations = [action.payload, ...state.conversations]
    },
    addConversationWithSort: (
      state,
      action: PayloadAction<ConversationType>
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
      action: PayloadAction<ConversationType['id']>
    ) => {
      state.conversations = state.conversations.filter(
        conversation => conversation.id !== action.payload
      )
    },
    addTypingConversation: (
      state,
      action: PayloadAction<ConversationType['id']>
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
      action: PayloadAction<ConversationType['id']>
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
    updateConversationWithDeletedMessage: (
      state,
      action: PayloadAction<UpdateConversationWithDeletedMessagePayload>
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
  updateConversationWithDeletedMessage
} = conversationsSlice.actions
export default conversationsSlice.reducer

export const selectConversations = (state: RootState) =>
  state.conversations.conversations
