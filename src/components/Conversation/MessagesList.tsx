import moment from 'moment'
import { useCallback, useContext, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import MessageComponent from './Message'
import {
  SortDirection,
  usePaginationMessageQuery,
  useReadMessagesMutation
} from '@/apollo/generated/graphql'
import { AppDispatch } from '@/stores'
import {
  readConversationMessages,
  selectConversationFirstMessageUnreadId,
  selectConversationId,
  selectConversationMessages,
  selectConversationTotalCount,
  setConversationMessages,
  setConversationTotalCount
} from '@/stores/conversation/conversationSlice'
import { setConversationsUnreadMessagesCount } from '@/stores/conversations/conversationsSlice'
import { selectUser } from '@/stores/user/userSlice'
import { MessagesListContext } from '@/utils/contexts/MessagesListContext'

function MessagesList() {
  const navigate = useNavigate()

  const { messagesListRef, setMessagesListRef } =
    useContext(MessagesListContext)

  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectUser)
  const conversationId = useSelector(selectConversationId)
  const messages = useSelector(selectConversationMessages)
  const totalCount = useSelector(selectConversationTotalCount)
  const firstUnreadMessageId = useSelector(
    selectConversationFirstMessageUnreadId
  )

  const TAKE = 50
  const SKIP = 0
  const [createdAt, setCreatedAt] = useState<Date | undefined>(undefined)

  const { data, loading } = usePaginationMessageQuery({
    variables: {
      skip: SKIP,
      take: TAKE,
      where: [
        {
          conversationId: conversationId,
          createdAt
        }
      ],
      sortBy: {
        createdAt: SortDirection.Desc
      }
    },
    skip: !conversationId,
    onError: () => {
      navigate('/', { replace: true })
    }
  })

  const [readMessages] = useReadMessagesMutation()

  const loadMore = useCallback(async () => {
    if (totalCount && messages.length >= totalCount) return

    const { createdAt } = messages[messages.length - 1]

    setCreatedAt(createdAt)
  }, [messages, totalCount])

  const handleScroll = useCallback(
    async (e: MouseEvent) => {
      const scrollTop = (e.target as any).scrollTop

      if (
        messagesListRef &&
        currentUser &&
        conversationId &&
        firstUnreadMessageId &&
        messages[0]?.unreadByIds.includes(currentUser.id) &&
        scrollTop === 0
      ) {
        await readMessages({
          variables: {
            conversationId
          }
        })
        dispatch(
          readConversationMessages({
            userId: currentUser.id
          })
        )
        dispatch(
          setConversationsUnreadMessagesCount({
            userId: currentUser.id,
            conversationId,
            unreadMessagesCount: 0
          })
        )
      }
    },
    [
      messagesListRef,
      currentUser,
      conversationId,
      firstUnreadMessageId,
      messages
    ]
  )

  useEffect(() => {
    setCreatedAt(undefined)
  }, [conversationId])

  useEffect(() => {
    if (!data?.PaginationMessage) return

    const messagesFetched = [...messages, ...data.PaginationMessage.nodes]

    dispatch(setConversationMessages(messagesFetched))

    if (!createdAt && currentUser) {
      dispatch(setConversationTotalCount(data.PaginationMessage.totalCount))
      dispatch(
        readConversationMessages({
          userId: currentUser.id
        })
      )
    }
  }, [data])

  if (loading && !createdAt) return <SkeletonLoader />

  return (
    <div
      id='messagesList'
      className='flex-auto w-full overflow-auto flex flex-col-reverse relative'
    >
      <InfiniteScroll
        ref={setMessagesListRef}
        dataLength={messages.length}
        hasMore={totalCount !== undefined && totalCount > messages.length}
        loader={<Loading />}
        inverse={true}
        next={loadMore}
        onScroll={handleScroll}
        scrollableTarget='messagesList'
        className='flex flex-col-reverse first:mb-4'
      >
        {messages.map((message, index) => (
          <MessageComponent
            key={message.id}
            message={message}
            showUser={
              message.user?.id !== messages[index + 1]?.user?.id ||
              moment(message.createdAt).diff(
                moment(messages[index + 1]?.createdAt),
                'minutes'
              ) > 10
            }
          />
        ))}
      </InfiniteScroll>
    </div>
  )
}

function Loading() {
  return (
    <div className='w-full flex items-center justify-center py-2'>
      <div className='w-1/3 h-1 bg-zinc-400 animate-pulse rounded-full' />
    </div>
  )
}

function SkeletonLoader() {
  return (
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
  )
}

export default MessagesList
