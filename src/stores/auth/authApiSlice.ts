import { apiSlice } from '../../api/apiSlice'
import {
  AuthenticateOutput,
  SignInInput,
  SignInOutput,
  SignUpInput,
  SignUpOutput
} from '../../utils/types'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
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
                  id
                  username
                  createdAt
                }
              }
            }
          `,
          variables: payload
        }
      })
    }),
    authenticate: builder.query<AuthenticateOutput, void>({
      query: () => ({
        url: '',
        body: {
          query: `
            query {
              Profile {
                id
                username
                createdAt
              }
            }
          `
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
                  id
                  username
                  createdAt
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
