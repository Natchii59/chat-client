import { useContext, useEffect, useState } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

import { useCreateMessageMutation } from '@/apollo/generated/graphql'
import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import {
  selectConversationId,
  selectConversationIsTyping,
  selectConversationMessages,
  selectConversationUser,
  setConversationEditMessageId
} from '@/stores/conversation/conversationSlice'
import { selectUser } from '@/stores/user/userSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import { ErrorType } from '@/utils/types'

interface MessageInputProps {
  messageInputRef: React.RefObject<HTMLTextAreaElement> | null
}

function MessageInput({ messageInputRef }: MessageInputProps) {
  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectUser)
  const conversationId = useSelector(selectConversationId)
  const conversationUser = useSelector(selectConversationUser)
  const isTyping = useSelector(selectConversationIsTyping)
  const messages = useSelector(selectConversationMessages)

  const [message, setMessage] = useState('')

  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>()
  const [isTypingStatus, setIsTypingStatus] = useState<boolean>(false)

  const [createMessage, { loading, data }] = useCreateMessageMutation()

  const handleSendMessage = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault()

    if (
      !conversationId ||
      message.trim().length === 0 ||
      !currentUser ||
      !conversationUser ||
      loading
    )
      return

    const { data, errors: rawErrors } = await createMessage({
      variables: {
        input: {
          content: message.trim(),
          conversationId
        }
      }
    })

    const errors = rawErrors as unknown as ErrorType[]

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data?.CreateMessage) return

    socket.emit('createMessage', {
      message: data.CreateMessage,
      conversationId,
      user1Id: currentUser.id,
      user2Id: conversationUser.id
    })

    setMessage('')
  }

  const sendTypingStatus = () => {
    if (!isTypingStatus) {
      socket.emit('onTypingStart', {
        conversationId,
        userId: conversationUser?.id
      })
      setIsTypingStatus(true)
    }

    clearTimeout(timer)
    setTimer(
      setTimeout(() => {
        socket.emit('onTypingStop', {
          conversationId,
          userId: conversationUser?.id
        })
        setIsTypingStatus(false)
      }, 2000)
    )
  }

  useEffect(() => {
    if (messageInputRef?.current) {
      messageInputRef.current.style.height = '0'

      const textAreaHeight = messageInputRef.current.scrollHeight
      messageInputRef.current.style.height = `${textAreaHeight}px`
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement === messageInputRef?.current &&
        e.key === 'ArrowUp'
      ) {
        e.preventDefault()
        dispatch(setConversationEditMessageId(messages[0].id))
      }
    }

    if (message.length === 0 && messages[0])
      window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [messageInputRef, message, messages])

  useEffect(() => {
    if (data?.CreateMessage && messageInputRef?.current) {
      messageInputRef.current.focus()
    }
  }, [data, messageInputRef])

  return (
    <form onSubmit={handleSendMessage} className='relative w-full'>
      {isTyping && (
        <div className='px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-sm rounded-t-xl border-2 border-b-0 border-zinc-300 dark:border-zinc-600'>
          {`${conversationUser?.username} is typing...`}
        </div>
      )}

      <div
        className={`flex items-start bg-zinc-100 dark:bg-zinc-800 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 text-base ${
          isTyping && 'rounded-t-none border-t-0'
        }`}
      >
        <textarea
          ref={messageInputRef}
          autoFocus
          className='flex-1 p-3 bg-transparent outline-none text-base border-none resize-none h-8 max-h-40'
          placeholder={`Send a message to ${conversationUser?.username}`}
          value={message}
          disabled={loading}
          onChange={e => {
            if (e.target.value.trim().length > 0) {
              sendTypingStatus()
            }
            setMessage(e.target.value)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              handleSendMessage(e)
            }
          }}
        />

        <div className='flex items-center'>
          <button
            type='submit'
            className='text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 w-12 h-12 flex items-center justify-center'
          >
            <FaPaperPlane className='w-5 h-5' />
          </button>
        </div>
      </div>
    </form>
  )
}

export default MessageInput
