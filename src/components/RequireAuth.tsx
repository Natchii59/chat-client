import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { AppDispatch } from '@/stores'
import { setConversations } from '@/stores/conversations/conversationsSlice'
import {
  setFriends,
  setReceivedRequests,
  setSentRequests
} from '@/stores/friends/friendsSlice'
import { useAuthenticateQuery } from '@/stores/user/authApiSlice'
import { setUser } from '@/stores/user/userSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'

function RequireAuth() {
  const location = useLocation()
  const navigate = useNavigate()

  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const routesWithoutAuth = ['/sign-in', '/sign-up']

  const {
    data: dataAuth,
    isLoading,
    isError,
    error
  } = useAuthenticateQuery({} as any, {
    skip: routesWithoutAuth.includes(location.pathname)
  })

  useEffect(() => {
    if (isError) {
      navigate('/error')
      return
    }

    if (isLoading || !dataAuth) return

    const { data, errors } = dataAuth

    if (errors?.length || !data?.Profile) {
      socket.disconnect()

      navigate('/sign-in', {
        replace: true,
        state: { from: location.pathname }
      })
      return
    } else {
      const {
        conversations,
        friends,
        receivedRequests,
        sentRequests,
        ...user
      } = data.Profile

      dispatch(setUser(user))

      if (conversations) dispatch(setConversations(conversations))
      if (friends) dispatch(setFriends(friends))
      if (receivedRequests) dispatch(setReceivedRequests(receivedRequests))
      if (sentRequests) dispatch(setSentRequests(sentRequests))

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
