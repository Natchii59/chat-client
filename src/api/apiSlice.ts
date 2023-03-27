import { ApolloClient, ApolloLink, InMemoryCache, gql } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react'
import { createUploadLink } from 'apollo-upload-client'

import { logout } from '@/stores/user/userSlice'
import { Mutation } from '@/utils/graphqlTypes'
import { ErrorType, Response } from '@/utils/types'

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/graphql`,
  method: 'POST',
  prepareHeaders: headers => {
    headers.append('Content-Type', 'application/json')

    const accessToken = localStorage.getItem('accessToken')

    if (accessToken && !headers.has('Authorization')) {
      headers.append('Authorization', `Bearer ${accessToken}`)
    }

    return headers
  }
})

const queryWithUpload = async (
  args: FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
): Promise<
  QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
> => {
  const { body } = args

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('accessToken')

    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
        'Apollo-Require-Preflight': 'true'
      }
    }
  })

  const client = new ApolloClient({
    link: ApolloLink.from([
      authLink,
      createUploadLink({
        uri: `${import.meta.env.VITE_API_URL}/graphql`
      })
    ]),
    cache: new InMemoryCache(),
    defaultOptions: {
      mutate: {
        errorPolicy: 'all',
        fetchPolicy: 'no-cache'
      },
      query: {
        errorPolicy: 'all',
        fetchPolicy: 'no-cache'
      }
    }
  })

  if (api.type === 'mutation') {
    const { data, errors } = await client.mutate({
      mutation: gql`
        ${body.query}
      `,
      variables: body.variables
    })

    return {
      data: {
        data,
        errors
      }
    }
  } else if (api.type === 'query') {
    const { data, errors } = await client.query({
      query: gql`
        ${body.query}
      `,
      variables: body.variables
    })

    return {
      data: {
        data,
        errors
      }
    }
  }

  return await baseQuery(args, api, extraOptions)
}

const baseQueryWithReauth = async (
  args: FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  let result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>

  if (args.body.upload) {
    result = await queryWithUpload(args, api, extraOptions)
  } else {
    result = await baseQuery(args, api, extraOptions)
  }

  if (result.error) {
    return result
  }

  const errors = (result.data as any).errors as ErrorType[]

  const status = errors ? errors[0].statusCode : null

  if (status === 401) {
    const refreshToken = localStorage.getItem('refreshToken')

    const refreshResult = await baseQuery(
      {
        url: '',
        body: {
          query: `
            mutation {
              RefreshTokens {
                accessToken
                refreshToken
              }
            }
          `
        },
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      },
      api,
      extraOptions
    )

    const { data, errors } = refreshResult.data as Response<
      Mutation['RefreshTokens']
    >

    if (errors) {
      api.dispatch(logout())
    } else if (data?.RefreshTokens) {
      const { accessToken, refreshToken: newRefreshToken } = data.RefreshTokens

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      if (args.body.upload) {
        result = await queryWithUpload(args, api, extraOptions)
      } else {
        result = await baseQuery(args, api, extraOptions)
      }
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  keepUnusedDataFor: 0
})
