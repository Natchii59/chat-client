import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

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

  const [createdAt, setCreatedAt] = useState<Date | undefined>(undefined)
  const TAKE = 50
  const SKIP = 0

  const dispatch = useDispatch<AppDispatch>()

  const conversationId = useSelector(selectConversationId)
  const messages = useSelector(selectConversationMessages)
  const totalCount = useSelector(selectConversationTotalCount)

  const messagesRef = useRef<HTMLDivElement>(null)
  const refreshRef = useRef<HTMLDivElement>(null)

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

    dispatch(
      setConversationMessages([
        ...data.PaginationMessage.nodes.slice().reverse(),
        ...messages
      ])
    )

    if (!createdAt) {
      dispatch(setConversationTotalCount(data.PaginationMessage.totalCount))
    }
  }, [dataMessages])

  useEffect(() => {
    if (!messagesRef.current || createdAt) return

    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight
    })
  }, [messages])

  useEffect(() => {
    if (
      !messagesRef.current ||
      !refreshRef.current ||
      totalCount === messages.length ||
      isLoading
    )
      return

    const handleScroll = () => {
      if (!refreshRef.current || !messagesRef.current) return

      const { top, bottom } = refreshRef.current.getBoundingClientRect()
      const messagesHeight = messagesRef.current.scrollHeight

      if (top < messagesHeight && bottom >= 0) {
        setCreatedAt(messages[0]?.createdAt)
      }
    }

    messagesRef.current.addEventListener('scroll', handleScroll)

    return () => {
      messagesRef.current?.removeEventListener('scroll', handleScroll)
    }
  }, [messages, isLoading])

  return (
    <div
      ref={messagesRef}
      className='flex-auto w-full overflow-x-hidden overflow-y-scroll'
    >
      {[
        ...Array(
          (totalCount && totalCount > 0 ? totalCount : 0) - messages.length
        )
      ].map((_, index) => (
        <div
          key={index}
          className='animate-pulse flex items-center space-x-3 mt-4 mx-4'
        >
          <div className='rounded-full bg-zinc-300 dark:bg-zinc-600 h-10 w-10'></div>

          <div className='flex-1 space-y-2 py-1'>
            <div className='grid grid-cols-3 gap-4'>
              <div className='h-2 bg-zinc-300 dark:bg-zinc-600 rounded col-span-2'></div>
            </div>
            <div className='grid grid-cols-3 gap-4'>
              <div className='h-2 bg-zinc-300 dark:bg-zinc-600 rounded col-span-1'></div>
            </div>
          </div>
        </div>
      ))}

      {messages.length > 0 && <div ref={refreshRef} />}

      {messages.map((message, index) => (
        <MessageComponent
          key={message.id}
          message={message}
          showUser={
            message.user.id !== messages[index - 1]?.user.id ||
            moment(message.createdAt).diff(
              moment(messages[index - 1]?.createdAt),
              'minutes'
            ) > 10
          }
        />
      ))}
    </div>
  )
}

export default MessagesList
