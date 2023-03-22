import { PropsWithChildren } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'

import Home from './pages/Home'
import RequireAuth from './components/RequireAuth'
import SignIn from './pages/SignIn'
import Layout from './components/Layout'
import Conversation from './pages/Conversation'
import SocketProvider from './components/Socket'
import SignUp from './pages/SignUp'
import { SocketContext, socket } from './utils/contexts/SocketContext'
import { store } from './stores'
import InformationDialog from './components/InformationDialog'
import Error from './pages/Error'

function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <SocketContext.Provider value={{ socket }}>
        <InformationDialog>{children}</InformationDialog>
      </SocketContext.Provider>
    </Provider>
  )
}

function App() {
  return (
    <Providers>
      <Routes>
        <Route path='/' element={<RequireAuth />}>
          <Route path='sign-in' element={<SignIn />} />
          <Route path='sign-up' element={<SignUp />} />

          <Route path='/' element={<SocketProvider />}>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='conversation/:id' element={<Conversation />} />
            </Route>
          </Route>
        </Route>

        <Route path='error' element={<Error />} />
        <Route path='*' element={<Navigate replace to='/' />} />
      </Routes>
    </Providers>
  )
}

export default App
