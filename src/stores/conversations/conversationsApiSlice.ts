import { apiSlice } from '@/api/apiSlice'
import { ErrorOutput } from '@/utils/types'
import { Conversation } from '../conversation/conversationSlice'

export interface CreateConversationInput {
  userId: string
}

export interface CloseConversationInput {
  id: string
}

export interface CreateConversationOutput {
  errors: ErrorOutput[] | null
  data: {
    CreateConversation: {
      created: boolean
      conversation: Conversation
    }
  }
}

export interface CloseConversationOutput {
  errors: ErrorOutput[] | null
  data: {
    CloseConversation: Conversation
  }
}

export const callApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createConversation: builder.mutation<
      CreateConversationOutput,
      CreateConversationInput
    >({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($input: CreateConversationInput!) {
              CreateConversation(input: $input) {
                created
                conversation {
                  id
                  createdAt
                  user1 {
                    id
                    username
                    avatar {
                      key
                      blurhash
                    }
                  }
                  user2 {
                    id
                    username
                    avatar {
                      key
                      blurhash
                    }
                  }
                  lastMessage {
                    id
                    content
                    createdAt
                  }
                }
              }
            }
          `,
          variables: {
            input: payload
          }
        }
      })
    }),
    closeConversation: builder.mutation<
      CloseConversationOutput,
      CloseConversationInput
    >({
      query: payload => ({
        url: '',
        body: {
          query: `
              mutation($id: ID!) {
                CloseConversation(id: $id) {
                  id
                }
              }
            `,
          variables: payload
        }
      })
    })
  })
})

export const { useCreateConversationMutation, useCloseConversationMutation } =
  callApiSlice
