import { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
  useConversationMessagesQuery,
  useConversationQuery
} from '../stores/callApiSlice'
import { selectUser } from '../stores/auth/authSlice'
import { SocketContext } from '../utils/contexts/SocketContext'
import { Message } from '../utils/types'
import MessageComponent from '../components/Message'
import MessageBoxInput from '../components/MessageBoxInput'
import moment from 'moment'

function Conversation() {
  const { id } = useParams()

  const [messages, setMessages] = useState<Message[]>([])

  const currentUser = useSelector(selectUser)

  const socket = useContext(SocketContext)

  const messagesRef = useRef<HTMLDivElement>(null)

  const { data: dataConversation, isLoading: isLoadingConversation } =
    useConversationQuery({
      id: id || ''
    })

  const { data: dataMessages, isLoading: isLoadingMessages } =
    useConversationMessagesQuery({
      skip: 0,
      take: 100,
      where: {
        conversationId: id || ''
      },
      sortBy: {
        createdAt: 'DESC'
      }
    })

  const otherUser =
    dataConversation?.data.FindOneConversation.user1.id === currentUser?.id
      ? dataConversation?.data.FindOneConversation.user2
      : dataConversation?.data.FindOneConversation.user1

  useEffect(() => {
    socket.emit('onConversationJoin', { conversationId: id })

    socket.on('userJoin', () => {
      console.log('user join')
    })

    socket.on('userLeave', () => {
      console.log('user leave')
    })

    socket.on('onMessage', (payload: Message) => {
      setMessages(prev => [payload, ...prev])
    })

    return () => {
      socket.emit('onConversationLeave', { conversationId: id })
      socket.off('userJoin')
      socket.off('userLeave')
      socket.off('onMessage')
    }
  }, [id])

  useEffect(() => {
    if (!dataMessages) return

    setMessages(dataMessages.data.PaginationMessage.nodes)

    return () => {
      setMessages([])
    }
  }, [dataMessages])

  useEffect(() => {
    if (!messagesRef.current) return

    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages])

  if (isLoadingConversation) {
    return <div>loading...</div>
  }

  return (
    <div className='flex flex-col items-start h-screen'>
      <div className='w-full px-4 py-3 bg-zinc-200/50 dark:bg-zinc-800/50'>
        <p className='text-lg font-medium'>{otherUser?.username}</p>
      </div>

      <div
        ref={messagesRef}
        className='flex-1 min-h-0 overflow-y-scroll flex flex-col-reverse items-start w-full'
      >
        {isLoadingMessages ? (
          <div>loading...</div>
        ) : (
          messages.map((message, index) => (
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
          ))
        )}
      </div>

      <MessageBoxInput user={otherUser!} conversationId={id!} />
    </div>
  )
}

export default Conversation
