import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useProfileQuery } from '@/apollo/generated/graphql'
import { AppDispatch } from '@/stores'
import { setConversations } from '@/stores/conversations/conversationsSlice'
import {
  setFriends,
  setReceivedRequests,
  setSentRequests
} from '@/stores/friends/friendsSlice'
import { setUser } from '@/stores/user/userSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'

function RequireAuth() {
  const location = useLocation()
  const navigate = useNavigate()

  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const routesWithoutAuth = ['/sign-in', '/sign-up']

  const { loading } = useProfileQuery({
    skip: routesWithoutAuth.includes(location.pathname),
    fetchPolicy: 'no-cache',
    onError() {
      socket.disconnect()

      navigate('/sign-in', {
        replace: true,
        state: { from: location.pathname }
      })
    },
    onCompleted(data) {
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

      if (friends?.length) {
        socket.emit('getFriendsStatus', {
          userIds: friends.map(friend => friend.id)
        })
        socket.emit('onConnected', {
          userIds: friends.map(friend => friend.id)
        })
      }
    }
  })

  if (loading)
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
