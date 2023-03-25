import { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { SocketContext } from '@/utils/contexts/SocketContext'
import { AppDispatch } from '@/stores'
import {
  Conversation,
  addConversationMessage,
  removeConversationMessage,
  selectConversationId,
  setConversationIsTyping
} from '@/stores/conversation/conversationSlice'
import { Message } from '@/stores/conversation/conversationSlice'
import {
  addConversation,
  addTypingConversation,
  removeTypingConversation,
  updateConversationWithDeletedMessage,
  updateConversationWithNewMessage
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
    socket.on('onMessageCreated', (message: Message) => {
      dispatch(addConversationMessage(message))
    })

    socket.on('onMessageCreatedSidebar', (message: Message) => {
      dispatch(updateConversationWithNewMessage(message))
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

    socket.on('onConversationCreated', (conversation: Conversation) => {
      dispatch(addConversation(conversation))
    })

    socket.on('onMessageDeleted', ({ messageId }) => {
      dispatch(removeConversationMessage(messageId))
    })

    socket.on(
      'onMessageDeletedSidebar',
      ({ conversationId, newLastMessage }) => {
        dispatch(
          updateConversationWithDeletedMessage({
            conversationId,
            newLastMessage
          })
        )
      }
    )

    return () => {
      socket.off('onMessageCreated')
      socket.off('onMessageUpdateSidebar')
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
      socket.off('onConversationCreated')
      socket.off('onMessageDeleted')
      socket.off('onMessageDeletedSidebar')
    }
  }, [socket, dispatch, currentConversationId, receivedRequests, sentRequests])

  return <Outlet />
}

export default Socket
