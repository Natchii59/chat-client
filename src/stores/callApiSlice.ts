import { apiSlice } from '../api/apiSlice'
import {
  CreateMessageInput,
  CreateMessageOutput,
  FindOneConversationInput,
  FindOneConversationOutput,
  GetConversationsOutput,
  PaginationMessageInput,
  PaginationMessageOutput
} from '../utils/types'

export const callApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    conversations: builder.query<GetConversationsOutput, void>({
      query: () => ({
        url: '',
        body: {
          query: `
            query {
              Profile {
                conversations {
                  id
                  user1 {
                    id
                    username
                  }
                  user2 {
                    id
                    username
                  }
                  lastMessage {
                    id
                    content
                    createdAt
                  }
                }
              }
            }
          `
        }
      })
    }),
    conversation: builder.query<
      FindOneConversationOutput,
      FindOneConversationInput
    >({
      query: payload => ({
        url: '',
        body: {
          query: `
            query($id: ID!) {
              FindOneConversation(id: $id) {
                id
                user1 {
                  id
                  username
                }
                user2 {
                  id
                  username
                }
              }
            }
          `,
          variables: payload
        }
      })
    }),
    conversationMessages: builder.query<
      PaginationMessageOutput,
      PaginationMessageInput
    >({
      query: payload => ({
        url: '',
        body: {
          query: `
            query($skip: Int!, $take: Int!, $where: [PaginationMessageWhere], $sortBy: PaginationSortBy) {
              PaginationMessage(skip: $skip, take: $take, where: $where, sortBy: $sortBy) {
                totalCount
                nodes {
                  id
                  content
                  createdAt
                  user {
                    id
                    username
                  }
                }
              }
            }
          `,
          variables: payload
        }
      })
    }),
    createMessage: builder.mutation<CreateMessageOutput, CreateMessageInput>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($input: CreateMessageInput!) {
              CreateMessage(input: $input) {
                id
                content
                createdAt
                user {
                  id
                  username
                }
                conversation {
                  id
                  user1 {
                    id
                  }
                  user2 {
                    id
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
    })
  })
})

export const {
  useConversationsQuery,
  useConversationQuery,
  useConversationMessagesQuery,
  useCreateMessageMutation
} = callApiSlice
