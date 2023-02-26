import { useSelector } from 'react-redux'

import { selectUser } from '../stores/auth/authSlice'

function Home() {
  const currentUser = useSelector(selectUser)

  return <div>{currentUser?.username}</div>
}

export default Home
