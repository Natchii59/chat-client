import { useContext, useEffect, useRef, useState } from 'react'
import { User } from '../utils/types'
import { SocketContext } from '../utils/contexts/SocketContext'
import { FaPaperPlane } from 'react-icons/fa'
import { useCreateMessageMutation } from '../stores/callApiSlice'

interface MessageBoxInputProps {
  user: User
  conversationId: string
}

function MessageBoxInput({ user, conversationId }: MessageBoxInputProps) {
  const [message, setMessage] = useState('')

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const [createMessage, { isLoading }] = useCreateMessageMutation()

  const socket = useContext(SocketContext)

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
      <div className='m-3 flex items-start bg-zinc-200 dark:bg-zinc-700 rounded-lg'>
        <textarea
          ref={textAreaRef}
          className='flex-1 p-3 bg-transparent outline-none text-base border-none resize-none h-8'
          placeholder={`Send a message to ${user.username}`}
          value={message}
          onChange={e => setMessage(e.target.value)}
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
