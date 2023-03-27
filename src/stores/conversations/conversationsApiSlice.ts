import { apiSlice } from '@/api/apiSlice'
import {
  Mutation,
  MutationCloseConversationArgs,
  MutationCreateConversationArgs
} from '@/utils/graphqlTypes'
import { Response } from '@/utils/types'

export const conversationsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createConversation: builder.mutation<
      Response<Mutation['CreateConversation']>,
      MutationCreateConversationArgs
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
          variables: payload
        }
      })
    }),
    closeConversation: builder.mutation<
      Response<Mutation['CloseConversation']>,
      MutationCloseConversationArgs
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
  conversationsApiSlice
