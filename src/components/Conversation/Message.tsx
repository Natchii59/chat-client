import moment from 'moment'

import { Message } from '@/stores/conversation/conversationSlice'
import ImageOptimized from '../ImageOptimized'

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
        className={`w-full py-0.5 pl-18 pr-12 hover:bg-zinc-100 hover:dark:bg-zinc-800/30 rounded-xl group ${
          showUser && 'mt-4'
        }`}
      >
        {showUser ? (
          <>
            {message.user.avatar ? (
              <ImageOptimized
                src={`${import.meta.env.VITE_CDN_URL}/${message.user.id}/${
                  message.user.avatar.key
                }`}
                blurhash={message.user.avatar.blurhash}
                width={40}
                alt='Profile'
                classNamePosition='w-10 h-10 absolute left-4 mt-1'
                classNameStyle='rounded-full'
              />
            ) : (
              <div className='w-10 h-10 rounded-full bg-zinc-400 absolute left-4 mt-1' />
            )}
            <h4 className='flex items-baseline gap-2'>
              <span className='font-bold'>{message.user.username}</span>
              <span className='text-zinc-500 text-sm'>{date}</span>
            </h4>
          </>
        ) : (
          <p className='absolute left-5 text-xs mt-1 text-zinc-500 font-medium invisible group-hover:visible select-none'>
            {hours}
          </p>
        )}
        <p className='break-words w-full min-w-0 select-text whitespace-pre-line'>
          {message.content}
        </p>
      </div>
    </div>
  )
}

export default MessageComponent
