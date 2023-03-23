import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuthenticateQuery } from '@/stores/user/authApiSlice'
import { AppDispatch } from '@/stores'
import { setUser } from '@/stores/user/userSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import { setConversations } from '@/stores/conversations/conversationsSlice'
import {
  setFriends,
  setReceivedRequests,
  setSentRequests
} from '@/stores/friends/friendsSlice'

function RequireAuth() {
  const location = useLocation()
  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>()

  const { data: dataAuth, isLoading, isError, error } = useAuthenticateQuery()

  const { socket } = useContext(SocketContext)

  const routesWithoutAuth = ['/sign-in', '/sign-up']

  useEffect(() => {
    if (isError) {
      navigate('/error')
      return
    }

    if (isLoading || !dataAuth) return

    const { data, errors } = dataAuth

    if (
      (errors?.length || !data?.Profile) &&
      !routesWithoutAuth.includes(location.pathname)
    ) {
      socket.disconnect()

      navigate('/sign-in', {
        replace: true,
        state: { from: location.pathname }
      })
      return
    } else {
      if (!data?.Profile) return

      const {
        conversations,
        friends,
        receivedRequests,
        sentRequests,
        ...user
      } = data.Profile
      dispatch(setUser(user))
      dispatch(setConversations(conversations))
      dispatch(setFriends(friends))
      dispatch(setReceivedRequests(receivedRequests))
      dispatch(setSentRequests(sentRequests))

      socket.connect()
    }
  }, [dataAuth, error])

  if (isLoading)
    return (
      <div className='w-full h-screen flex justify-center items-center'>
        <div className='flex flex-col w-1/3 relative'>
          <div className='h-2 bg-zinc-400 animate-bar absolute rounded-full' />
        </div>
      </div>
    )

  return <Outlet />
}

export default RequireAuth
