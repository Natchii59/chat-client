import { Link, useLocation } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

import ConversationsList from './ConversationsList'
import UserProfile from './UserProfile'
import NewConversationDialog from './NewConversationDialog'

function Sidebar() {
  const location = useLocation()

  return (
    <div className='p-2 pr-0 h-screen'>
      <div className='flex flex-col items-start rounded-xl h-full bg-zinc-100 dark:bg-zinc-800'>
        <div className='px-4 py-2 w-full flex items-center justify-between'>
          {location.pathname === '/' ? (
            <h2 className='text-xl font-extrabold'>Conversations</h2>
          ) : (
            <Link
              to='/'
              className='text-xl font-extrabold flex items-center gap-2 hover:underline hover:underline-offset-2'
            >
              <FaArrowLeft className='w-4 h-4' />
              Conversations
            </Link>
          )}

          <NewConversationDialog />
        </div>

        <ConversationsList />

        <UserProfile />
      </div>
    </div>
  )
}

export default Sidebar
