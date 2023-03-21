import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

import SidebarItem from './SidebarItem'
import { selectConversations } from '@/stores/conversations/conversationsSlice'
// import { sendNotification, showNotification } from '../utils/functions'

function Sidebar() {
  const location = useLocation()

  const conversations = useSelector(selectConversations)

  return (
    <div className='p-2 pr-0 h-screen'>
      <div className='px-2 rounded-xl h-full overflow-y-auto bg-zinc-100 dark:bg-zinc-800'>
        {location.pathname === '/' ? (
          <h2 className='px-4 py-3 text-xl font-extrabold sticky top-0 inset-x-0 z-10 bg-zinc-100 dark:bg-zinc-800'>
            Conversations
          </h2>
        ) : (
          <Link
            to='/'
            className='px-4 py-3 text-xl font-extrabold sticky top-0 inset-x-0 z-10 bg-zinc-100 dark:bg-zinc-800 flex items-center gap-2 hover:underline hover:underline-offset-2'
          >
            <FaArrowLeft className='w-4 h-4' />
            Conversations
          </Link>
        )}

        <div className='flex flex-col gap-1 py-2'>
          {conversations.map(conversation => (
            <SidebarItem key={conversation.id} conversation={conversation} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
