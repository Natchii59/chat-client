import { useContext, useEffect, useRef } from 'react'
import { FaArrowDown } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useFindOneConversationQuery,
  useReadMessagesMutation
} from '@/apollo/generated/graphql'
import Button from '@/components/Button'
import ConversationPopoverOptions from '@/components/Conversation/ConversationPopoverOptions'
import MessageInput from '@/components/Conversation/MessageInput'
import MessagesList from '@/components/Conversation/MessagesList'
import { AppDispatch } from '@/stores'
import {
  readConversationMessages,
  selectConversationFirstMessageUnreadId,
  selectConversationId,
  selectConversationMessages,
  selectConversationUser,
  setConversationFirstMessageUnreadId,
  setConversationId,
  setConversationIsTyping,
  setConversationMessages,
  setConversationTotalCount,
  setConversationUser
} from '@/stores/conversation/conversationSlice'
import {
  removeTypingConversation,
  setConversationsUnreadMessagesCount
} from '@/stores/conversations/conversationsSlice'
import { selectFriends } from '@/stores/friends/friendsSlice'
import { selectUser } from '@/stores/user/userSlice'
import { MessageInputContext } from '@/utils/contexts/MessageInputContext'
import { MessagesListContext } from '@/utils/contexts/MessagesListContext'
import { SocketContext } from '@/utils/contexts/SocketContext'

function Conversation() {
  const { id } = useParams()

  const navigate = useNavigate()

  const { socket } = useContext(SocketContext)
  const { messagesListRef } = useContext(MessagesListContext)

  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectUser)
  const userConversation = useSelector(selectConversationUser)
  const friends = useSelector(selectFriends)
  const conversationId = useSelector(selectConversationId)
  const firstUnreadMessageId = useSelector(
    selectConversationFirstMessageUnreadId
  )
  const messages = useSelector(selectConversationMessages)

  const messageInputRef = useRef<HTMLTextAreaElement>(null)

  const { data, loading } = useFindOneConversationQuery({
    variables: {
      id: id ?? ''
    },
    skip: !id,
    onError: () => {
      navigate('/', { replace: true })
    }
  })

  const [readMessages, { loading: loadingReadMessages }] =
    useReadMessagesMutation()

  const handleNewMessagesClick = async () => {
    if (conversationId && currentUser) {
      await readMessages({
        variables: {
          conversationId: conversationId
        }
      })
      dispatch(
        readConversationMessages({
          userId: currentUser.id
        })
      )
      dispatch(setConversationFirstMessageUnreadId(undefined))
      dispatch(
        setConversationsUnreadMessagesCount({
          userId: currentUser.id,
          conversationId,
          unreadMessagesCount: 0
        })
      )
      messagesListRef?.getScrollableTarget()?.scrollTo({
        top: 0
      })
    }
  }

  useEffect(() => {
    if (!data?.FindOneConversation) return

    const { creator, recipient } = data.FindOneConversation
    const currentUserConversation =
      currentUser?.id === creator.id ? creator : recipient
    const otherUserConversation =
      currentUser?.id === creator.id ? recipient : creator

    dispatch(setConversationId(data.FindOneConversation.id))
    dispatch(setConversationUser(otherUserConversation))
    dispatch(setConversationIsTyping(false))
    dispatch(removeTypingConversation(data.FindOneConversation.id))
    dispatch(
      setConversationFirstMessageUnreadId(
        currentUserConversation.firstUnreadMessageId
      )
    )
    dispatch(
      setConversationsUnreadMessagesCount({
        userId: currentUserConversation.id,
        conversationId: data.FindOneConversation.id,
        unreadMessagesCount: 0
      })
    )

    socket.emit('onConversationJoin', { conversationId: id })

    messageInputRef?.current?.focus()

    if (currentUserConversation.firstUnreadMessageId) {
      readMessages({
        variables: {
          conversationId: data.FindOneConversation.id
        }
      })
    }

    return () => {
      dispatch(setConversationId(undefined))
      dispatch(setConversationUser(undefined))
      dispatch(setConversationMessages([]))
      dispatch(setConversationTotalCount(undefined))
      dispatch(setConversationFirstMessageUnreadId(undefined))

      socket.emit('onConversationLeave', { conversationId: id })
    }
  }, [data])

  useEffect(() => {
    if (!conversationId) return

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Escape' && firstUnreadMessageId) {
        dispatch(setConversationFirstMessageUnreadId(undefined))

        if (
          conversationId &&
          currentUser &&
          messages[0]?.unreadByIds.includes(currentUser.id)
        ) {
          await readMessages({
            variables: {
              conversationId: conversationId
            }
          })
          dispatch(readConversationMessages({ userId: currentUser.id }))
          dispatch(
            setConversationsUnreadMessagesCount({
              userId: currentUser.id,
              conversationId,
              unreadMessagesCount: 0
            })
          )
        }
      }
    }

    console.log('firstUnreadMessageId', firstUnreadMessageId)

    if (firstUnreadMessageId) window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [conversationId, firstUnreadMessageId, messages, currentUser])

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <MessageInputContext.Provider value={{ messageInputRef }}>
      <div className='flex flex-col items-start h-screen p-2'>
        <div className='w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-between relative'>
          <div className='flex items-center gap-2'>
            <p className='text-lg font-extrabold'>
              {userConversation?.username}
            </p>

            {friends.find(friend => friend.id === userConversation?.id)
              ?.online ? (
              <div className='w-3 h-3 rounded-full bg-green-500' />
            ) : null}
          </div>

          <ConversationPopoverOptions />

          {firstUnreadMessageId &&
          currentUser &&
          messages[0]?.unreadByIds.includes(currentUser.id) &&
          messagesListRef?.getScrollableTarget()?.scrollTop !== 0 ? (
            <div className='absolute -bottom-10 inset-x-0 z-10 flex items-center justify-center'>
              <Button
                buttonSize='xs'
                buttonType='primary'
                icon={<FaArrowDown />}
                isLoading={loadingReadMessages}
                onClick={handleNewMessagesClick}
              >
                New messages
              </Button>
            </div>
          ) : null}
        </div>

        <MessagesList />

        <MessageInput messageInputRef={messageInputRef} />
      </div>
    </MessageInputContext.Provider>
  )
}

function SkeletonLoader() {
  return (
    <div className='flex flex-col items-start h-screen p-2'>
      <div className='w-full px-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center h-11'>
        <div className='w-32 h-3 bg-zinc-400 animate-pulse rounded-full' />
      </div>

      <div className='flex-auto w-full overflow-auto flex flex-col-reverse'>
        {[...Array(20)].map((_, i) => (
          <div key={i} className='relative w-full'>
            <div className='w-full py-0.5 pl-18 pr-12 rounded-xl mt-3'>
              <div className='w-10 h-10 rounded-full bg-zinc-400 absolute left-4 mt-1 animate-pulse' />

              <div className='w-32 h-3 my-2 rounded-full bg-zinc-400 animate-pulse' />

              <div className='w-1/3 h-3 my-2 rounded-full bg-zinc-400 animate-pulse' />
            </div>
          </div>
        ))}
      </div>

      <div className='w-full py-6 bg-zinc-100 dark:bg-zinc-800 rounded-xl' />
    </div>
  )
}

export default Conversation
