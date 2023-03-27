import { apiSlice } from '@/api/apiSlice'
import { Mutation, MutationUpdateUserArgs } from '@/utils/graphqlTypes'
import { Response } from '@/utils/types'

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    updateUser: builder.mutation<
      Response<Mutation['UpdateUser']>,
      MutationUpdateUserArgs
    >({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($input: UpdateUserInput!) {
              UpdateUser(input: $input) {
                id
                username
                createdAt
                avatar {
                  key
                  blurhash
                }
              }
            }
          `,
          variables: payload,
          upload: true
        }
      })
    })
  })
})

export const { useUpdateUserMutation } = userApiSlice
