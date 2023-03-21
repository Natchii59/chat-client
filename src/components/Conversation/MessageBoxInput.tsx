import { useContext, useEffect, useRef, useState } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import { useSelector } from 'react-redux'

import { SocketContext } from '@/utils/contexts/SocketContext'
import { useCreateMessageMutation } from '@/stores/conversation/conversationApiSlice'
import {
  selectConversationId,
  selectConversationIsTyping,
  selectConversationUser
} from '@/stores/conversation/conversationSlice'

function MessageBoxInput() {
  const [message, setMessage] = useState('')

  const conversationId = useSelector(selectConversationId)
  const conversationUser = useSelector(selectConversationUser)
  const isTyping = useSelector(selectConversationIsTyping)

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const [createMessage, { isLoading }] = useCreateMessageMutation()

  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>()
  const [isTypingStatus, setIsTypingStatus] = useState<boolean>(false)

  const { socket } = useContext(SocketContext)

  const handleSendMessage = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault()

    if (!conversationId || message.trim().length === 0) return

    const { data, errors } = await createMessage({
      content: message,
      conversationId
    }).unwrap()

    if (errors) {
      console.log(errors)
      return
    }

    if (!data) return

    socket.emit('createMessage', data.CreateMessage)
    setMessage('')
    textAreaRef.current?.focus()
  }

  const sendTypingStatus = () => {
    if (!isTypingStatus) {
      socket.emit('onTypingStart', { conversationId })
      setIsTypingStatus(true)
    }

    clearTimeout(timer)
    setTimer(
      setTimeout(() => {
        socket.emit('onTypingStop', { conversationId })
        setIsTypingStatus(false)
      }, 2000)
    )
  }

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '0'

      const textAreaHeight = textAreaRef.current.scrollHeight
      textAreaRef.current.style.height = `${textAreaHeight}px`
    }
  }, [message])

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
          ref={textAreaRef}
          autoFocus
          className='flex-1 p-3 bg-transparent outline-none text-base border-none resize-none h-8 max-h-40'
          placeholder={`Send a message to ${conversationUser?.username}`}
          value={message}
          disabled={isLoading}
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

export default MessageBoxInput
