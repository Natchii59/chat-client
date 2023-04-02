import { ApolloProvider } from '@apollo/client'
import { PropsWithChildren } from 'react'
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
import { SocketContext, socket } from './utils/contexts/SocketContext'

function Providers({ children }: PropsWithChildren) {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <SocketContext.Provider value={{ socket }}>
          <SocketProvider>
            <InformationDialog>{children}</InformationDialog>
          </SocketProvider>
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
