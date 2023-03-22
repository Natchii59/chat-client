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
    return <div>Loading...</div>
  }

  return (
    <div className='flex flex-col items-start h-screen p-2'>
      <div className='w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center gap-2'>
        <p className='text-lg font-extrabold'>{userConversation?.username}</p>
      </div>

      <MessagesList />

      <MessageBoxInput />
    </div>
  )
}

export default Conversation
