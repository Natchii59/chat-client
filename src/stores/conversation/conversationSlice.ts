import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from '../index'
import { Message, User } from '@/utils/graphqlTypes'

export interface ConversationState {
  id?: string
  user?: User
  messages: Message[]
  totalCount?: number
  isTyping: boolean
  editMessageId?: string
}

const initialState: ConversationState = {
  id: undefined,
  user: undefined,
  messages: [],
  totalCount: undefined,
  isTyping: false,
  editMessageId: undefined
}

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConversationId: (
      state,
      action: PayloadAction<ConversationState['id']>
    ) => {
      state.id = action.payload
    },
    setConversationUser: (
      state,
      action: PayloadAction<ConversationState['user']>
    ) => {
      state.user = action.payload
    },
    setConversationMessages: (
      state,
      action: PayloadAction<ConversationState['messages']>
    ) => {
      state.messages = action.payload
    },
    setConversationTotalCount: (
      state,
      action: PayloadAction<ConversationState['totalCount']>
    ) => {
      state.totalCount = action.payload
    },
    setConversationIsTyping: (
      state,
      action: PayloadAction<ConversationState['isTyping']>
    ) => {
      state.isTyping = action.payload
    },
    setConversationEditMessageId: (
      state,
      action: PayloadAction<ConversationState['editMessageId']>
    ) => {
      state.editMessageId = action.payload
    },
    addConversationMessage: (state, action: PayloadAction<Message>) => {
      state.messages.splice(0, 0, action.payload)
      state.totalCount =
        state.totalCount != null ? state.totalCount + 1 : undefined
    },
    updateConversationMessage: (state, action: PayloadAction<Message>) => {
      const index = state.messages.findIndex(
        message => message.id === action.payload.id
      )
      if (index !== -1) {
        state.messages[index] = action.payload
      }
    },
    removeConversationMessage: (
      state,
      action: PayloadAction<ConversationState['id']>
    ) => {
      state.messages = state.messages.filter(
        message => message.id !== action.payload
      )
      state.totalCount =
        state.totalCount != null ? state.totalCount - 1 : undefined
    }
  }
})

export const {
  setConversationId,
  setConversationUser,
  setConversationMessages,
  setConversationTotalCount,
  setConversationIsTyping,
  setConversationEditMessageId,
  addConversationMessage,
  updateConversationMessage,
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
export const selectConversationEditMessageId = (state: RootState) =>
  state.conversation.editMessageId
