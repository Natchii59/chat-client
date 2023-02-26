import { useSelector } from 'react-redux'
import { Conversation } from '../utils/types'
import { selectUser } from '../stores/auth/authSlice'
import { Link, NavLink } from 'react-router-dom'

interface ConversationSideBarItemProps {
  conversation: Conversation
}

function ConversationSideBarItem({
  conversation
}: ConversationSideBarItemProps) {
  const currentUser = useSelector(selectUser)

  const otherUser =
    conversation.user1.id === currentUser?.id
      ? conversation.user2
      : conversation.user1

  return (
    <NavLink
      to={`/conversation/${conversation.id}`}
      className={({ isActive }) =>
        `relative pr-3 py-2 pl-16 rounded-xl hover:bg-zinc-200 hover:dark:bg-zinc-800 ${
          isActive ? 'bg-zinc-200 dark:bg-zinc-800' : ''
        }`
      }
    >
      <div className='w-10 h-10 rounded-full bg-zinc-400 absolute left-3 top-1/2 transform -translate-y-1/2' />

      <h4 className='font-medium text-ellipsis overflow-hidden whitespace-nowrap'>
        {otherUser.username}
      </h4>

      <p className='text-ellipsis overflow-hidden whitespace-nowrap text-zinc-500 text-sm'>
        {conversation.lastMessage
          ? conversation.lastMessage.content
          : 'No message'}
      </p>
    </NavLink>
  )
}

export default ConversationSideBarItem
