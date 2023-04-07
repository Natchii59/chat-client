import { PropsWithChildren, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Message, useReadMessagesMutation } from '@/apollo/generated/graphql'
import { AppDispatch } from '@/stores'
import {
  MessageConversationStore,
  addConversationMessage,
  removeConversationMessage,
  selectConversationId,
  setConversationFirstMessageUnreadId,
  setConversationIsTyping,
  updateConversationMessage
} from '@/stores/conversation/conversationSlice'
import {
  ConversationsStore,
  addConversation,
  addTypingConversation,
  removeTypingConversation,
  updateConversationToTop
} from '@/stores/conversations/conversationsSlice'
import {
  UserFriendsStore,
  addFriend,
  addFriendOnline,
  addReceivedRequest,
  addSentRequest,
  removeFriend,
  removeFriendOnline,
  removeReceivedRequest,
  removeSentRequest,
  selectReceivedRequests,
  selectSentRequests,
  setFriendsStatus
} from '@/stores/friends/friendsSlice'
import { selectUser } from '@/stores/user/userSlice'
import { MessagesListContext } from '@/utils/contexts/MessagesListContext'
import { SocketContext } from '@/utils/contexts/SocketContext'

function SocketProvider({ children }: PropsWithChildren) {
  const { socket } = useContext(SocketContext)
  const { messagesListRef } = useContext(MessagesListContext)

  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectUser)
  const currentConversationId = useSelector(selectConversationId)
  const receivedRequests = useSelector(selectReceivedRequests)
  const sentRequests = useSelector(selectSentRequests)

  const [readMessages] = useReadMessagesMutation()

  useEffect(() => {
    socket.on('onMessageCreated', async ({ message }: { message: Message }) => {
      dispatch(addConversationMessage(message))

      if (currentConversationId && messagesListRef) {
        if (
          message.user.id !== currentUser?.id &&
          messagesListRef.getScrollableTarget()?.scrollTop === 0
        ) {
          await readMessages({
            variables: {
              conversationId: currentConversationId
            }
          })
          dispatch(setConversationFirstMessageUnreadId(undefined))
        } else if (currentUser) {
          const currentUserConversation =
            message.conversation.creator.id === currentUser.id
              ? message.conversation.creator
              : message.conversation.recipient

          dispatch(
            setConversationFirstMessageUnreadId(
              currentUserConversation.firstUnreadMessageId
            )
          )
        }
      }
    })

    socket.on(
      'onMessageCreatedSidebar',
      ({ message }: { message: Message }) => {
        if (
          message.conversation.id === currentConversationId &&
          currentUser &&
          messagesListRef &&
          messagesListRef.getScrollableTarget()?.scrollTop === 0
        ) {
          const currentUserConversation =
            message.conversation.creator.id === currentUser.id
              ? 'creator'
              : 'recipient'

          dispatch(
            updateConversationToTop({
              ...message.conversation,
              [currentUserConversation]: {
                ...message.conversation[currentUserConversation],
                unreadMessagesCount: 0
              }
            })
          )
        } else dispatch(updateConversationToTop(message.conversation))
      }
    )

    socket.on(
      'onMessageUpdated',
      ({ message }: { message: MessageConversationStore }) => {
        dispatch(updateConversationMessage(message))
      }
    )

    socket.on('onMessageDeleted', ({ messageId }: { messageId: string }) => {
      dispatch(removeConversationMessage(messageId))
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

    socket.on(
      'onTypingStartConversation',
      ({ conversationId }: { conversationId: string }) => {
        if (conversationId === currentConversationId) return
        dispatch(addTypingConversation(conversationId))
      }
    )

    socket.on(
      'onTypingStopConversation',
      ({ conversationId }: { conversationId: string }) => {
        if (conversationId === currentConversationId) return
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

    socket.on(
      'onFriendsStatusDisconnected',
      ({ userId }: { userId: string }) => {
        dispatch(removeFriendOnline(userId))
      }
    )

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
      socket.off('onFriendsStatusDisconnected')
    }
  }, [
    socket,
    dispatch,
    currentUser,
    currentConversationId,
    receivedRequests,
    sentRequests,
    messagesListRef
  ])

  return <>{children}</>
}

export default SocketProvider
