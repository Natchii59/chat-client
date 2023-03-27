import { apiSlice } from '@/api/apiSlice'
import {
  Mutation,
  MutationSignInArgs,
  MutationSignUpArgs,
  Query
} from '@/utils/graphqlTypes'
import { Response } from '@/utils/types'

const userFieldOutput = `
id
username
createdAt
avatar {
  key
  blurhash
}
conversations {
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
friends {
  id
  username
  avatar {
    key
    blurhash
  }
}
receivedRequests {
  id
  username
  avatar {
    key
    blurhash
  }
}
sentRequests {
  id
  username
  avatar {
    key
    blurhash
  }
}
`

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    authenticate: builder.query<Response<Query['Profile']>, void>({
      query: () => ({
        url: '',
        body: {
          query: `
            query {
              Profile {
                ${userFieldOutput}
              }
            }
          `
        }
      })
    }),
    signIn: builder.mutation<Response<Mutation['SignIn']>, MutationSignInArgs>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($username: String!, $password: String!) {
              SignIn(username: $username, password: $password) {
                accessToken
                refreshToken
                user {
                  ${userFieldOutput}
                }
              }
            }
          `,
          variables: payload
        }
      })
    }),
    signup: builder.mutation<Response<Mutation['SignUp']>, MutationSignUpArgs>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($input: CreateUserInput!) {
              SignUp(input: $input) {
                accessToken
                refreshToken
                user {
                  id
                  username
                  createdAt
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
    })
  })
})

export const { useSignInMutation, useAuthenticateQuery, useSignupMutation } =
  authApiSlice
