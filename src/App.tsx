import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import RequireAuth from './components/RequireAuth'
import SignIn from './pages/SignIn'
import Layout from './components/Layout'
import Conversation from './pages/Conversation'

function App() {
  return (
    <Routes>
      <Route path='/' element={<RequireAuth />}>
        <Route path='sign-in' element={<SignIn />} />

        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='conversation/:id' element={<Conversation />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
