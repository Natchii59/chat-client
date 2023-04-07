import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuthenticatedUserQuery } from '@/apollo/generated/graphql'
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

  const { loading } = useAuthenticatedUserQuery({
    skip: routesWithoutAuth.includes(location.pathname),
    onError() {
      socket.disconnect()

      navigate('/sign-in', {
        replace: true,
        state: { from: location.pathname }
      })
    },
    onCompleted(data) {
      dispatch(setUser(data.Profile))

      dispatch(setConversations(data.UserConversations))
      dispatch(setFriends(data.UserFriends))
      dispatch(setReceivedRequests(data.UserReceivedRequestsFriends))
      dispatch(setSentRequests(data.UserSentRequestsFriends))

      const connectedSocket = socket.connect()

      connectedSocket.on('connect', async () => {
        if (data.UserFriends.length) {
          let res = false

          while (!res) {
            res = await connectedSocket.emitWithAck('getFriendsStatus', {
              userIds: data.UserFriends.map(friend => friend.id)
            })

            res = await connectedSocket.emitWithAck('onConnected', {
              userIds: data.UserFriends.map(friend => friend.id)
            })
          }
        }
      })
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
