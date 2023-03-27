import { PropsWithChildren, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch } from '@/stores'
import {
  addConversationMessage,
  removeConversationMessage,
  selectConversationId,
  setConversationIsTyping
} from '@/stores/conversation/conversationSlice'
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
import { SocketContext } from '@/utils/contexts/SocketContext'
import { Conversation, Message, User } from '@/utils/graphqlTypes'

function SocketProvider({ children }: PropsWithChildren) {
  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const currentConversationId = useSelector(selectConversationId)
  const receivedRequests = useSelector(selectReceivedRequests)
  const sentRequests = useSelector(selectSentRequests)

  useEffect(() => {
    socket.on('onMessageCreated', ({ message }: { message: Message }) => {
      dispatch(addConversationMessage(message))
    })

    socket.on(
      'onMessageCreatedSidebar',
      ({ message }: { message: Message }) => {
        dispatch(updateConversationWithNewMessage(message))
      }
    )

    socket.on(
      'onMessageDeleted',
      ({ messageId }: { messageId: Message['id'] }) => {
        dispatch(removeConversationMessage(messageId))
      }
    )

    socket.on(
      'onMessageDeletedSidebar',
      ({
        conversationId,
        newLastMessage
      }: {
        conversationId: Conversation['id']
        newLastMessage: Message
      }) => {
        dispatch(
          updateConversationWithDeletedMessage({
            conversationId,
            newLastMessage
          })
        )
      }
    )

    socket.on('onTypingStart', () => {
      dispatch(setConversationIsTyping(true))
    })

    socket.on('onTypingStop', () => {
      dispatch(setConversationIsTyping(false))
    })

    socket.on('userLeave', () => {
      dispatch(setConversationIsTyping(false))
    })

    socket.on(
      'onTypingStartConversation',
      ({ conversationId }: { conversationId: Conversation['id'] }) => {
        if (conversationId === currentConversationId) return
        dispatch(addTypingConversation(conversationId))
      }
    )

    socket.on(
      'onTypingStopConversation',
      ({ conversationId }: { conversationId: Conversation['id'] }) => {
        if (conversationId === currentConversationId) return
        dispatch(removeTypingConversation(conversationId))
      }
    )

    socket.on(
      'onFriendRequestAccepted',
      ({ userId }: { userId: User['id'] }) => {
        const user =
          receivedRequests.find(user => user.id === userId) ??
          sentRequests.find(user => user.id === userId)

        if (!user) return

        dispatch(addFriend(user))
        dispatch(removeReceivedRequest(userId))
        dispatch(removeSentRequest(userId))
      }
    )

    socket.on(
      'onFriendRequestDeclined',
      ({ userId }: { userId: User['id'] }) => {
        dispatch(removeReceivedRequest(userId))
        dispatch(removeSentRequest(userId))
      }
    )

    socket.on(
      'onFriendRequestCanceled',
      ({ userId }: { userId: User['id'] }) => {
        dispatch(removeReceivedRequest(userId))
        dispatch(removeSentRequest(userId))
      }
    )

    socket.on('onFriendRequestSentReceived', ({ user }: { user: User }) => {
      dispatch(addReceivedRequest(user))
    })

    socket.on('onFriendRequestSentSended', ({ user }: { user: User }) => {
      dispatch(addSentRequest(user))
    })

    socket.on('onFriendRemoved', ({ userId }: { userId: User['id'] }) => {
      dispatch(removeFriend(userId))
    })

    socket.on('onConversationCreated', (conversation: Conversation) => {
      dispatch(addConversation(conversation))
    })

    return () => {
      socket.off('onMessageCreated')
      socket.off('onMessageCreatedSidebar')
      socket.off('onMessageDeleted')
      socket.off('onMessageDeletedSidebar')
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
    }
  }, [socket, dispatch, currentConversationId, receivedRequests, sentRequests])

  return <>{children}</>
}

export default SocketProvider
