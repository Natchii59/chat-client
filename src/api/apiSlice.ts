import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react'

import { ErrorOutput } from '@/utils/types'
import { logout } from '@/stores/auth/authSlice'

export interface RefreshTokensOutput {
  errors: ErrorOutput[] | null
  data: {
    RefreshTokens: {
      accessToken: string
      refreshToken: string
    }
  }
}

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

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions)

  const errors = (result.data as any).errors as ErrorOutput[]

  const status = errors ? errors[0].statusCode : null

  if (status === 401) {
    const refreshToken = localStorage.getItem('refreshToken')

    const refreshResult = await baseQuery(
      {
        url: '',
        body: {
          query: `
            query {
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

    const refreshData = refreshResult.data as RefreshTokensOutput

    if (refreshData.data) {
      const { accessToken, refreshToken: newRefreshToken } =
        refreshData.data.RefreshTokens

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  keepUnusedDataFor: 0
})
