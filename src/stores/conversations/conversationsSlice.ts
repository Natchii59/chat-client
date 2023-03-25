import { createSlice } from '@reduxjs/toolkit'
import orderBy from 'lodash/orderBy'

import { RootState } from '../index'
import { Conversation } from '../conversation/conversationSlice'

export interface ConversationsState {
  conversations: Conversation[]
}

const initialState: ConversationsState = {
  conversations: []
}

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload
    },
    addConversation: (state, action) => {
      state.conversations = [action.payload, ...state.conversations]
    },
    addConversationWithSort: (state, action) => {
      state.conversations = orderBy(
        [action.payload, ...state.conversations],
        (conversation: Conversation) => {
          if (conversation.lastMessage) {
            return conversation.lastMessage.createdAt
          }

          return conversation.createdAt
        },
        'desc'
      )
    },
    removeConversation: (state, action) => {
      state.conversations = state.conversations.filter(
        conversation => conversation.id !== action.payload
      )
    },
    addTypingConversation: (state, action) => {
      const conversation = state.conversations.find(
        conversation => conversation.id === action.payload
      )
      if (conversation) {
        conversation.isTyping = true
      }
    },
    removeTypingConversation: (state, action) => {
      const conversation = state.conversations.find(
        conversation => conversation.id === action.payload
      )
      if (conversation) {
        conversation.isTyping = false
      }
    },
    updateConversationWithNewMessage: (state, action) => {
      state.conversations = [
        {
          ...action.payload.conversation,
          lastMessage: action.payload
        },
        ...state.conversations.filter(
          conversation => conversation.id !== action.payload.conversation.id
        )
      ]
    },
    updateConversationWithDeletedMessage: (state, action) => {
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
