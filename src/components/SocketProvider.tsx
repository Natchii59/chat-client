import { PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Message } from '@/apollo/generated/graphql'
import { AppDispatch } from '@/stores'
import {
  MessageConversationStore,
  addConversationMessage,
  removeConversationMessage,
  selectConversationId,
  setConversationIsTyping,
  updateConversationMessage
} from '@/stores/conversation/conversationSlice'
import {
  ConversationsStore,
  addConversation,
  addTypingConversation,
  removeTypingConversation,
  updateConversationWithDeletedMessage,
  updateConversationWithNewMessage,
  updateConversationWithUpdatedMessage
} from '@/stores/conversations/conversationsSlice'
import {
  UserFriendsStore,
  addFriend,
  addFriendOnline,
  addReceivedRequest,
  addSentRequest,
  removeFriend,
  removeReceivedRequest,
  removeSentRequest,
  selectFriends,
  selectReceivedRequests,
  selectSentRequests,
  setFriendsStatus
} from '@/stores/friends/friendsSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'

function SocketProvider({ children }: PropsWithChildren) {
  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const currentConversationId = useSelector(selectConversationId)
  const receivedRequests = useSelector(selectReceivedRequests)
  const sentRequests = useSelector(selectSentRequests)
  const friends = useSelector(selectFriends)

  const [intervalFriendsStatus, setIntervalFriendsStatus] =
    useState<NodeJS.Timeout>()

  useEffect(() => {
    socket.on(
      'onMessageCreated',
      ({ message }: { message: MessageConversationStore }) => {
        dispatch(addConversationMessage(message))
      }
    )

    socket.on(
      'onMessageCreatedSidebar',
      ({ message }: { message: Message }) => {
        dispatch(updateConversationWithNewMessage(message))
      }
    )

    socket.on(
      'onMessageUpdated',
      ({ message }: { message: MessageConversationStore }) => {
        dispatch(updateConversationMessage(message))
      }
    )

    socket.on(
      'onMessageUpdatedSidebar',
      ({
        conversationId,
        message
      }: {
        conversationId: string
        message: Message
      }) => {
        dispatch(
          updateConversationWithUpdatedMessage({
            conversationId,
            message
          })
        )
      }
    )

    socket.on('onMessageDeleted', ({ messageId }: { messageId: string }) => {
      dispatch(removeConversationMessage(messageId))
    })

    socket.on(
      'onMessageDeletedSidebar',
      ({
        conversationId,
        newLastMessage
      }: {
        conversationId: string
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
      ({ conversationId }: { conversationId: string }) => {
        if (conversationId === currentConversationId) return
        console.log('onTypingStartConversation')
        dispatch(addTypingConversation(conversationId))
      }
    )

    socket.on(
      'onTypingStopConversation',
      ({ conversationId }: { conversationId: string }) => {
        if (conversationId === currentConversationId) return
        console.log('onTypingStopConversation')
        dispatch(removeTypingConversation(conversationId))
      }
    )

    socket.on('onFriendRequestAccepted', ({ userId }: { userId: string }) => {
      const user =
        receivedRequests.find(user => user.id === userId) ??
        sentRequests.find(user => user.id === userId)

      if (!user) return

      dispatch(addFriend(user))
      dispatch(removeReceivedRequest(userId))
      dispatch(removeSentRequest(userId))
    })

    socket.on('onFriendRequestDeclined', ({ userId }: { userId: string }) => {
      dispatch(removeReceivedRequest(userId))
      dispatch(removeSentRequest(userId))
    })

    socket.on('onFriendRequestCanceled', ({ userId }: { userId: string }) => {
      dispatch(removeReceivedRequest(userId))
      dispatch(removeSentRequest(userId))
    })

    socket.on(
      'onFriendRequestSentReceived',
      ({ user }: { user: UserFriendsStore }) => {
        dispatch(addReceivedRequest(user))
      }
    )

    socket.on(
      'onFriendRequestSentSended',
      ({ user }: { user: UserFriendsStore }) => {
        dispatch(addSentRequest(user))
      }
    )

    socket.on('onFriendRemoved', ({ userId }: { userId: string }) => {
      dispatch(removeFriend(userId))
    })

    socket.on(
      'onConversationCreated',
      ({ conversation }: { conversation: ConversationsStore }) => {
        dispatch(addConversation(conversation))
      }
    )

    socket.on(
      'onFriendsStatus',
      ({ friendsStatusIds }: { friendsStatusIds: string[] }) => {
        dispatch(setFriendsStatus(friendsStatusIds))
      }
    )

    socket.on('onFriendsStatusConnected', ({ userId }: { userId: string }) => {
      dispatch(addFriendOnline(userId))
    })

    return () => {
      socket.off('onMessageCreated')
      socket.off('onMessageCreatedSidebar')
      socket.off('onMessageUpdated')
      socket.off('onMessageUpdatedSidebar')
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
      socket.off('onFriendsStatus')
      socket.off('onFriendsStatusConnected')
    }
  }, [socket, dispatch, currentConversationId, receivedRequests, sentRequests])

  useEffect(() => {
    clearInterval(intervalFriendsStatus)
    if (!friends.length) return

    const interval = setInterval(() => {
      socket.emit('getFriendsStatus', {
        userIds: friends.map(friend => friend.id)
      })
    }, 10000)

    setIntervalFriendsStatus(interval)

    return () => {
      clearInterval(intervalFriendsStatus)
    }
  }, [friends])

  return <>{children}</>
}

export default SocketProvider
