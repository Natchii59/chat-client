import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { useConversationQuery } from '@/stores/conversation/conversationApiSlice'
import { selectUser } from '@/stores/user/userSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import MessageBoxInput from '@/components/Conversation/MessageBoxInput'
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
import MessagesList from '@/components/Conversation/MessagesList'
import ConversationPopoverOptions from '@/components/Conversation/ConversationPopoverOptions'

function Conversation() {
  const { id } = useParams()

  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectUser)
  const userConversation = useSelector(selectConversationUser)

  const { socket } = useContext(SocketContext)

  const { data: dataConversation, isLoading } = useConversationQuery({
    id: id ?? ''
  })

  useEffect(() => {
    socket.emit('onConversationJoin', { conversationId: id })

    return () => {
      socket.emit('onConversationLeave', { conversationId: id })
    }
  }, [id])

  useEffect(() => {
    if (!dataConversation) return

    const { errors, data } = dataConversation

    if (errors?.length || !data?.FindOneConversation) {
      navigate('/', { replace: true })
      return
    }

    dispatch(setConversationId(data.FindOneConversation.id))
    dispatch(
      setConversationUser(
        data.FindOneConversation.user1.id === currentUser?.id
          ? data.FindOneConversation.user2
          : data.FindOneConversation.user1
      )
    )
    dispatch(setConversationIsTyping(false))
    dispatch(removeTypingConversation(data.FindOneConversation.id))

    return () => {
      dispatch(setConversationId(null))
      dispatch(setConversationUser(null))
      dispatch(setConversationMessages([]))
      dispatch(setConversationTotalCount(null))
    }
  }, [dataConversation])

  if (isLoading) {
    return <SkeletonLoader />
  }

  return (
    <div className='flex flex-col items-start h-screen p-2'>
      <div className='w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-between'>
        <p className='text-lg font-extrabold'>{userConversation?.username}</p>

        <ConversationPopoverOptions />
      </div>

      <MessagesList />

      <MessageBoxInput />
    </div>
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
