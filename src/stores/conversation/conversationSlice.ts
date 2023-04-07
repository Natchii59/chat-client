import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from '../index'
import { Maybe } from '@/apollo/generated/graphql'

interface UserConversationStore {
  id: string
  username: string
  avatar?: Maybe<{
    key: string
    blurhash: string
  }>
  firstUnreadMessageId?: Maybe<string>
  unreadMessagesCount: number
}

export interface MessageConversationStore {
  id: string
  content: string
  createdAt: Date
  isModified: boolean
  unreadByIds: string[]
  user: {
    id: string
    username: string
    avatar?: Maybe<{
      key: string
      blurhash: string
    }>
  }
  replyTo?: Maybe<{
    id: string
    content: string
    user: {
      id: string
      username: string
      avatar?: Maybe<{
        key: string
        blurhash: string
      }>
    }
  }>
}

export interface ConversationState {
  id?: string
  user?: UserConversationStore
  messages: MessageConversationStore[]
  totalCount?: number
  isTyping: boolean
  editMessageId?: string
  replyToMessage?: MessageConversationStore
  firstMessageUnreadId?: Maybe<string>
  unreadMessagesCount?: number
}

const initialState: ConversationState = {
  id: undefined,
  user: undefined,
  messages: [],
  totalCount: undefined,
  isTyping: false,
  editMessageId: undefined,
  replyToMessage: undefined,
  firstMessageUnreadId: undefined,
  unreadMessagesCount: undefined
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
    setConversationReplyToMessage: (
      state,
      action: PayloadAction<ConversationState['replyToMessage']>
    ) => {
      state.replyToMessage = action.payload
    },
    setConversationFirstMessageUnreadId: (
      state,
      action: PayloadAction<ConversationState['firstMessageUnreadId']>
    ) => {
      state.firstMessageUnreadId = action.payload
    },
    readConversationMessages: (
      state,
      action: PayloadAction<{
        userId: string
      }>
    ) => {
      state.messages = state.messages.map(message => {
        if (message.unreadByIds.some(id => id === action.payload.userId))
          message.unreadByIds = message.unreadByIds.filter(
            id => id !== action.payload.userId
          )
        return message
      })
      state.unreadMessagesCount = 0
    },
    addConversationMessage: (
      state,
      action: PayloadAction<MessageConversationStore>
    ) => {
      state.messages.splice(0, 0, action.payload)
      state.totalCount =
        state.totalCount != null ? state.totalCount + 1 : undefined
    },
    updateConversationMessage: (
      state,
      action: PayloadAction<MessageConversationStore>
    ) => {
      const message = state.messages.find(
        message => message.id === action.payload.id
      )
      if (message) {
        message.content = action.payload.content
        message.isModified = action.payload.isModified
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
  setConversationReplyToMessage,
  setConversationFirstMessageUnreadId,
  readConversationMessages,
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
export const selectConversationFirstMessageUnreadId = (state: RootState) =>
  state.conversation.firstMessageUnreadId
export const selectConversationReplyToMessage = (state: RootState) =>
  state.conversation.replyToMessage
