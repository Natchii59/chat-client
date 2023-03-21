import { createSlice } from '@reduxjs/toolkit'

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
      state.conversations.push(action.payload)
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
    updateConversation: (state, action) => {
      const conversation = state.conversations.find(
        conversation => conversation.id === action.payload.conversation.id
      )

      if (conversation)
        state.conversations = [
          {
            ...conversation,
            lastMessage: action.payload
          } as Conversation,
          ...state.conversations.filter(
            conversation => conversation.id !== action.payload.conversation.id
          )
        ]
    }
  }
})

export const {
  setConversations,
  addConversation,
  removeConversation,
  addTypingConversation,
  removeTypingConversation,
  updateConversation
} = conversationsSlice.actions
export default conversationsSlice.reducer

export const selectConversations = (state: RootState) =>
  state.conversations.conversations
