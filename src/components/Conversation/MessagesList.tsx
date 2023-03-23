import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useConversationMessagesQuery } from '@/stores/conversation/conversationApiSlice'
import { AppDispatch } from '@/stores'
import {
  selectConversationId,
  selectConversationMessages,
  selectConversationTotalCount,
  setConversationMessages,
  setConversationTotalCount
} from '@/stores/conversation/conversationSlice'
import MessageComponent from './Message'

function MessagesList() {
  const navigate = useNavigate()

  const TAKE = 50
  const SKIP = 0
  const [createdAt, setCreatedAt] = useState<Date | undefined>(undefined)

  const dispatch = useDispatch<AppDispatch>()

  const conversationId = useSelector(selectConversationId)
  const messages = useSelector(selectConversationMessages)
  const totalCount = useSelector(selectConversationTotalCount)

  const { data: dataMessages, isLoading } = useConversationMessagesQuery({
    skip: SKIP,
    take: TAKE,
    where: {
      conversationId: conversationId ?? '',
      createdAt
    },
    sortBy: {
      createdAt: 'DESC'
    }
  })

  useEffect(() => {
    if (!dataMessages) return

    const { errors, data } = dataMessages

    if (errors?.length || !data?.PaginationMessage) {
      navigate('/', { replace: true })
      return
    }

    const messagesFetched = [...messages, ...data.PaginationMessage.nodes]

    if (!createdAt) {
      dispatch(setConversationTotalCount(data.PaginationMessage.totalCount))
    }

    dispatch(setConversationMessages(messagesFetched))
  }, [dataMessages])

  const loadMore = useCallback(() => {
    if (totalCount && messages.length >= totalCount) return

    const { createdAt } = messages[messages.length - 1]

    setCreatedAt(createdAt)
  }, [messages, totalCount])

  if (isLoading) return <SkeletonLoader />

  return (
    <div
      id='messagesList'
      className='flex-auto w-full overflow-auto flex flex-col-reverse'
    >
      <InfiniteScroll
        dataLength={messages.length}
        hasMore={totalCount !== null && totalCount > messages.length}
        loader={<Loading />}
        inverse={true}
        next={loadMore}
        scrollableTarget='messagesList'
        className='flex flex-col-reverse first:mb-4'
      >
        {messages.map((message, index) => (
          <MessageComponent
            key={message.id}
            message={message}
            showUser={
              message.user.id !== messages[index + 1]?.user.id ||
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
