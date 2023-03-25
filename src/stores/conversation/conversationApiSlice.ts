import { apiSlice } from '@/api/apiSlice'
import { ErrorOutput } from '@/utils/types'
import { Conversation, Message } from './conversationSlice'

export interface FindOneConversationInput {
  id: string
}

export interface PaginationMessageWhere {
  id?: string
  createdAt?: Date | string
  conversationId?: string
}

export interface PaginationMessageSortBy {
  id?: 'ASC' | 'DESC'
  createdAt?: 'ASC' | 'DESC'
  updatedAt?: 'ASC' | 'DESC'
}

export interface PaginationMessageInput {
  skip: number
  take: number
  where?: PaginationMessageWhere
  sortBy?: PaginationMessageSortBy
}

export interface CreateMessageInput {
  content: string
  conversationId: string
}

export interface DeleteMessageInput {
  id: string
}

export interface FindOneConversationOutput {
  errors: ErrorOutput[] | null
  data: {
    FindOneConversation: Conversation
  } | null
}

export interface PaginationMessageOutput {
  errors: ErrorOutput[] | null
  data: {
    PaginationMessage: {
      totalCount: number
      nodes: Message[]
    }
  } | null
}

export interface CreateMessageOutput {
  errors: ErrorOutput[] | null
  data: {
    CreateMessage: Message
  }
}

export interface DeleteMessageOutput {
  errors: ErrorOutput[] | null
  data: {
    DeleteMessage: string
  }
}

export const callApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
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
          variables: {
            input: payload
          }
        }
      })
    }),
    deleteMessage: builder.mutation<DeleteMessageOutput, DeleteMessageInput>({
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
} = callApiSlice
