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

  const { data: dataMessages } = useConversationMessagesQuery({
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

export default MessagesList
