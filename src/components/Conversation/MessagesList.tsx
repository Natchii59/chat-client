import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Virtuoso } from 'react-virtuoso'

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
  const [firstItemIndex, setFirstItemIndex] = useState<number>(0)
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

    const messagesFetched = [
      ...data.PaginationMessage.nodes.slice().reverse(),
      ...messages
    ]

    if (!createdAt) {
      setFirstItemIndex(
        data.PaginationMessage.totalCount - messagesFetched.length
      )
      dispatch(setConversationTotalCount(data.PaginationMessage.totalCount))
    } else if (totalCount) {
      setFirstItemIndex(totalCount - messagesFetched.length)
    }

    dispatch(setConversationMessages(messagesFetched))
  }, [dataMessages])

  const prependMessages = useCallback(() => {
    if (totalCount && messages.length >= totalCount) return

    const { createdAt } = messages[0]

    setCreatedAt(createdAt)
  }, [messages, totalCount])

  return (
    <Virtuoso
      className='flex-auto w-full'
      firstItemIndex={firstItemIndex}
      initialTopMostItemIndex={TAKE}
      data={messages}
      startReached={prependMessages}
      followOutput
      itemContent={(_index, message) => (
        <MessageComponent
          key={message.id}
          message={message}
          showUser={
            message.user.id !==
              messages[messages.indexOf(message) - 1]?.user.id ||
            moment(message.createdAt).diff(
              moment(messages[messages.indexOf(message) - 1]?.createdAt),
              'minutes'
            ) > 10
          }
        />
      )}
      components={{
        Header:
          totalCount !== null && messages.length < totalCount
            ? () => (
                <div className='flex items-center justify-center w-full h-8'>
                  <div className='w-1/3 h-1 rounded-full bg-zinc-400 animate-pulse' />
                </div>
              )
            : undefined
      }}
    />
  )
}

export default MessagesList
