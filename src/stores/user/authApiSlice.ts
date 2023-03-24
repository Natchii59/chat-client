import { apiSlice } from '@/api/apiSlice'
import { User } from './userSlice'
import { ErrorOutput } from '@/utils/types'

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

export interface SignInInput {
  username: string
  password: string
}

export interface SignUpInput {
  username: string
  password: string
}

export interface SignInOutput {
  errors: ErrorOutput[] | null
  data: {
    SignIn: {
      accessToken: string
      refreshToken: string
      user: User
    }
  } | null
}

export interface SignUpOutput {
  errors: ErrorOutput[] | null
  data: {
    SignUp: {
      accessToken: string
      refreshToken: string
      user: User
    }
  }
}

export interface AuthenticateOutput {
  errors: ErrorOutput[] | null
  data: {
    Profile: User
  } | null
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    authenticate: builder.query<AuthenticateOutput, void>({
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
    signIn: builder.mutation<SignInOutput, SignInInput>({
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
    signup: builder.mutation<SignUpOutput, SignUpInput>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($input: CreateUserInput!) {
              SignUp(input: $input) {
                accessToken
                refreshToken
                user {
                  ${userFieldOutput}
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

export const { useSignInMutation, useAuthenticateQuery, useSignupMutation } =
  authApiSlice
