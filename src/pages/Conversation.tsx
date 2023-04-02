import { useContext, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { useFindOneConversationQuery } from '@/apollo/generated/graphql'
import ConversationPopoverOptions from '@/components/Conversation/ConversationPopoverOptions'
import MessageInput from '@/components/Conversation/MessageInput'
import MessagesList from '@/components/Conversation/MessagesList'
import { AppDispatch } from '@/stores'
import {
  selectConversationUser,
  setConversationId,
  setConversationIsTyping,
  setConversationMessages,
  setConversationTotalCount,
  setConversationUser
} from '@/stores/conversation/conversationSlice'
import { removeTypingConversation } from '@/stores/conversations/conversationsSlice'
import { MessageInputContext } from '@/utils/contexts/MessageInputContext'
import { SocketContext } from '@/utils/contexts/SocketContext'

function Conversation() {
  const { id } = useParams()

  const navigate = useNavigate()

  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const userConversation = useSelector(selectConversationUser)

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

  useEffect(() => {
    if (!data?.FindOneConversation) return

    dispatch(setConversationId(data.FindOneConversation.id))
    dispatch(setConversationUser(data.FindOneConversation.user))
    dispatch(setConversationIsTyping(false))
    dispatch(removeTypingConversation(data.FindOneConversation.id))

    socket.emit('onConversationJoin', { conversationId: id })

    messageInputRef?.current?.focus()

    return () => {
      dispatch(setConversationId(undefined))
      dispatch(setConversationUser(undefined))
      dispatch(setConversationMessages([]))
      dispatch(setConversationTotalCount(undefined))

      socket.emit('onConversationLeave', { conversationId: id })
    }
  }, [data])

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <MessageInputContext.Provider value={{ messageInputRef }}>
      <div className='flex flex-col items-start h-screen p-2'>
        <div className='w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-between'>
          <p className='text-lg font-extrabold'>{userConversation?.username}</p>

          <ConversationPopoverOptions />
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
