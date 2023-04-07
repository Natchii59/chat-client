import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'

const client = new ApolloClient({
  link: ApolloLink.from([
    createUploadLink({
      uri: `${import.meta.env.VITE_API_URL}/graphql`,
      credentials: 'include'
    })
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'no-cache'
    },
    mutate: {
      errorPolicy: 'all'
    },
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'no-cache'
    }
  }
})

export default client
