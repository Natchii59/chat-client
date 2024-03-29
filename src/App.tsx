import { ApolloProvider } from '@apollo/client'
import { PropsWithChildren, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Provider } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'

import client from './apollo/client'
import InformationDialog from './components/InformationDialog'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import SocketProvider from './components/SocketProvider'
import Conversation from './pages/Conversation'
import Error from './pages/Error'
import Home from './pages/Home'
import Settings from './pages/Settings'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { store } from './stores'
import { MessagesListContext } from './utils/contexts/MessagesListContext'
import { SocketContext, socket } from './utils/contexts/SocketContext'

function Providers({ children }: PropsWithChildren) {
  const [messagesListRef, setMessagesListRef] = useState<InfiniteScroll | null>(
    null
  )

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <SocketContext.Provider value={{ socket }}>
          <MessagesListContext.Provider
            value={{ messagesListRef, setMessagesListRef }}
          >
            <InformationDialog>
              <SocketProvider>{children}</SocketProvider>
            </InformationDialog>
          </MessagesListContext.Provider>
        </SocketContext.Provider>
      </Provider>
    </ApolloProvider>
  )
}

function App() {
  return (
    <Providers>
      <Routes>
        <Route path='/' element={<RequireAuth />}>
          <Route path='sign-in' element={<SignIn />} />
          <Route path='sign-up' element={<SignUp />} />

          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='conversation/:id' element={<Conversation />} />
          </Route>

          <Route path='settings' element={<Settings />} />
        </Route>

        <Route path='error' element={<Error />} />
        <Route path='*' element={<Navigate replace to='/' />} />
      </Routes>
    </Providers>
  )
}

export default App
