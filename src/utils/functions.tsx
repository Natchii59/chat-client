import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  InMemoryCache,
  gql
} from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'

export async function mutationWithFile(query: string, variables: any) {
  const client = new ApolloClient({
    link: ApolloLink.from([
      createUploadLink({
        uri: `${import.meta.env.VITE_API_URL}/graphql`
      })
    ]),
    cache: new InMemoryCache()
  })

  let result: FetchResult<any>

  try {
    result = await client.mutate({
      mutation: gql`
        ${query}
      `,
      variables,
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    })

    return result
  } catch (err) {
    const refreshResult = await client.query({
      query: gql`
        query {
          RefreshTokens {
            accessToken
            refreshToken
          }
        }
      `,
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('refreshToken')}`
        }
      }
    })

    if (refreshResult.data) {
      const { accessToken, refreshToken: newRefreshToken } =
        refreshResult.data.RefreshTokens

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      result = await client.mutate({
        mutation: gql`
          ${query}
        `,
        variables,
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      })

      return result
    } else {
      return null
    }
  }
}
