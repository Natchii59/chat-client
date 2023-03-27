import { apiSlice } from '@/api/apiSlice'
import {
  Mutation,
  MutationAcceptFriendRequestArgs,
  MutationCancelFriendRequestArgs,
  MutationDeclineFriendRequestArgs,
  MutationRemoveFriendArgs,
  MutationSendFriendRequestArgs
} from '@/utils/graphqlTypes'
import { Response } from '@/utils/types'

export const friendsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    sendFriendRequest: builder.mutation<
      Response<Mutation['SendFriendRequest']>,
      MutationSendFriendRequestArgs
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
    acceptFriendRequest: builder.mutation<
      Response<Mutation['AcceptFriendRequest']>,
      MutationAcceptFriendRequestArgs
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
      Response<Mutation['DeclineFriendRequest']>,
      MutationDeclineFriendRequestArgs
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
      Response<Mutation['CancelFriendRequest']>,
      MutationCancelFriendRequestArgs
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
    removeFriend: builder.mutation<
      Response<Mutation['RemoveFriend']>,
      MutationRemoveFriendArgs
    >({
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
} = friendsApiSlice
