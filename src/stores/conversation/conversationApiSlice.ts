import { apiSlice } from '@/api/apiSlice'
import {
  Mutation,
  MutationCreateMessageArgs,
  MutationDeleteMessageArgs,
  Query,
  QueryFindOneConversationArgs,
  QueryPaginationMessageArgs
} from '@/utils/graphqlTypes'
import { Response } from '@/utils/types'

export const conversationApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    conversation: builder.query<
      Response<Query['FindOneConversation']>,
      QueryFindOneConversationArgs
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
              }
            }
          `,
          variables: payload
        }
      })
    }),
    conversationMessages: builder.query<
      Response<Query['PaginationMessage']>,
      QueryPaginationMessageArgs
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
                    avatar {
                      key
                      blurhash
                    }
                  }
                }
              }
            }
          `,
          variables: payload
        }
      })
    }),
    createMessage: builder.mutation<
      Response<Mutation['CreateMessage']>,
      MutationCreateMessageArgs
    >({
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
                  avatar {
                    key
                    blurhash
                  }
                }
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
                }
              }
            }
          `,
          variables: payload
        }
      })
    }),
    deleteMessage: builder.mutation<
      Response<Mutation['DeleteMessage']>,
      MutationDeleteMessageArgs
    >({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($id: ID!) {
              DeleteMessage(id: $id)
            }
          `,
          variables: payload
        }
      })
    })
  })
})

export const {
  useConversationQuery,
  useConversationMessagesQuery,
  useCreateMessageMutation,
  useDeleteMessageMutation
} = conversationApiSlice
