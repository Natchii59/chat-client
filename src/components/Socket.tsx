import { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { SocketContext } from '@/utils/contexts/SocketContext'
import { AppDispatch } from '@/stores'
import {
  addConversationMessage,
  selectConversationId,
  setConversationIsTyping
} from '@/stores/conversation/conversationSlice'
import { Message } from '@/stores/conversation/conversationSlice'
import {
  addTypingConversation,
  removeTypingConversation,
  updateConversation
} from '@/stores/conversations/conversationsSlice'
import {
  addFriend,
  addReceivedRequest,
  addSentRequest,
  removeFriend,
  removeReceivedRequest,
  removeSentRequest,
  selectReceivedRequests,
  selectSentRequests
} from '@/stores/friends/friendsSlice'

function Socket() {
  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const currentConversationId = useSelector(selectConversationId)
  const receivedRequests = useSelector(selectReceivedRequests)
  const sentRequests = useSelector(selectSentRequests)

  useEffect(() => {
    socket.on('onMessage', (message: Message) => {
      dispatch(addConversationMessage(message))
    })

    socket.on('onMessageUpdateSidebar', (message: Message) => {
      dispatch(updateConversation(message))

      // if (payload.user.id !== currentUser?.id) {
      //   showNotification()
      // }
    })

    socket.on('onTypingStart', () => {
      dispatch(setConversationIsTyping(true))
    })

    socket.on('onTypingStop', () => {
      dispatch(setConversationIsTyping(false))
    })

    socket.on('userLeave', () => {
      dispatch(setConversationIsTyping(false))
    })

    socket.on('onTypingStartConversation', ({ conversationId }) => {
      if (conversationId === currentConversationId) return
      dispatch(addTypingConversation(conversationId))
    })

    socket.on('onTypingStopConversation', ({ conversationId }) => {
      if (conversationId === currentConversationId) return
      dispatch(removeTypingConversation(conversationId))
    })

    socket.on('onFriendRequestAccepted', ({ userId }) => {
      const user =
        receivedRequests.find(user => user.id === userId) ??
        sentRequests.find(user => user.id === userId)

      if (!user) return

      dispatch(addFriend(user))
      dispatch(removeReceivedRequest(userId))
      dispatch(removeSentRequest(userId))
    })

    socket.on('onFriendRequestDeclined', ({ userId }) => {
      dispatch(removeReceivedRequest(userId))
      dispatch(removeSentRequest(userId))
    })

    socket.on('onFriendRequestCanceled', ({ userId }) => {
      dispatch(removeReceivedRequest(userId))
      dispatch(removeSentRequest(userId))
    })

    socket.on('onFriendRequestSentReceived', ({ user }) => {
      dispatch(addReceivedRequest(user))
    })

    socket.on('onFriendRequestSentSended', ({ user }) => {
      dispatch(addSentRequest(user))
    })

    socket.on('onFriendRemoved', ({ userId }) => {
      dispatch(removeFriend(userId))
    })

    return () => {
      socket.off('onMessage')
      socket.off('onTypingStart')
      socket.off('onTypingStop')
      socket.off('userLeave')
      socket.off('onTypingStartConversation')
      socket.off('onTypingStopConversation')
      socket.off('onFriendRequestAccepted')
      socket.off('onFriendRequestDeclined')
      socket.off('onFriendRequestCanceled')
      socket.off('onFriendRequestSentReceived')
      socket.off('onFriendRequestSentSended')
      socket.off('onFriendRemoved')
    }
  }, [socket, dispatch, currentConversationId, receivedRequests, sentRequests])

  return <Outlet />
}

export default Socket
