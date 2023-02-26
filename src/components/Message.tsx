import moment from 'moment'
import { Message } from '../utils/types'

interface MessageProps {
  message: Message
  showUser: boolean
}

function MessageComponent({ message, showUser }: MessageProps) {
  const date = moment(message.createdAt).calendar()
  const hours = moment(message.createdAt).format('HH:mm')

  return (
    <div className='relative w-full'>
      <div
        className={`w-full py-0.5 pl-18 pr-12 hover:bg-zinc-100 hover:dark:bg-zinc-800/30 group ${
          showUser && 'mt-4'
        }`}
      >
        {showUser ? (
          <>
            <div className='w-10 h-10 rounded-full bg-zinc-400 absolute left-4 mt-0.5' />
            <h4 className='flex items-baseline gap-2'>
              <span className='font-medium'>{message.user.username}</span>
              <span className='text-zinc-500 text-sm'>{date}</span>
            </h4>
          </>
        ) : (
          <p className='absolute left-5 text-xs mt-1 text-zinc-500 font-medium invisible group-hover:visible'>
            {hours}
          </p>
        )}
        <p className='break-words w-full min-w-0 select-text'>
          {message.content}
        </p>
      </div>
    </div>
  )
}

export default MessageComponent
