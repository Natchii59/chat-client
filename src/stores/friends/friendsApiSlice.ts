import { apiSlice } from '@/api/apiSlice'
import { ErrorOutput } from '@/utils/types'
import { User } from '../user/userSlice'

export interface FriendRequestInput {
  id: string
}

export interface SendFriendRequestInput {
  username: string
}

export interface AcceptFriendRequestOutput {
  errors: ErrorOutput[] | null
  data: {
    AcceptFriendRequest: User
  }
}

export interface DeclineFriendRequestOutput {
  errors: ErrorOutput[] | null
  data: {
    DeclineFriendRequest: User
  }
}

export interface CancelFriendRequestOutput {
  errors: ErrorOutput[] | null
  data: {
    CancelFriendRequest: User
  }
}

export interface SendFriendRequestOutput {
  errors: ErrorOutput[] | null
  data: {
    SendFriendRequest: User
  }
}

export interface RemoveFriendOutput {
  errors: ErrorOutput[] | null
  data: {
    RemoveFriend: User
  }
}

export const callApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    acceptFriendRequest: builder.mutation<
      AcceptFriendRequestOutput,
      FriendRequestInput
    >({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($id: ID!) {
              AcceptFriendRequest(id: $id) {
                id
              }
            }
          `,
          variables: payload
        }
      })
    }),
    declineFriendRequest: builder.mutation<
      DeclineFriendRequestOutput,
      FriendRequestInput
    >({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($id: ID!) {
              DeclineFriendRequest(id: $id) {
                id
              }
            }
          `,
          variables: payload
        }
      })
    }),
    cancelFriendRequest: builder.mutation<
      CancelFriendRequestOutput,
      FriendRequestInput
    >({
      query: payload => ({
        url: '',
        body: {
          query: `
              mutation($id: ID!) {
                CancelFriendRequest(id: $id) {
                  id
                }
              }
            `,
          variables: payload
        }
      })
    }),
    sendFriendRequest: builder.mutation<
      SendFriendRequestOutput,
      SendFriendRequestInput
    >({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($username: String!) {
              SendFriendRequest(username: $username) {
                id
                username
                avatar {
                  key
                  blurhash
                }
              }
            }
          `,
          variables: payload
        }
      })
    }),
    removeFriend: builder.mutation<RemoveFriendOutput, FriendRequestInput>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($id: ID!) {
              RemoveFriend(id: $id) {
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

export const {
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useCancelFriendRequestMutation,
  useSendFriendRequestMutation,
  useRemoveFriendMutation
} = callApiSlice
