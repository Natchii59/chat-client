import { useSelector } from 'react-redux'

import SidebarItem from './SidebarItem'
import { selectConversations } from '@/stores/conversations/conversationsSlice'

function ConversationsList() {
  const conversations = useSelector(selectConversations)

  return (
    <div className='flex-auto w-full overflow-auto flex flex-col gap-1 p-2'>
      {conversations.length ? (
        conversations.map(conversation => (
          <SidebarItem key={conversation.id} conversation={conversation} />
        ))
      ) : (
        <div className='flex flex-col items-center justify-center h-full'>
          <h2 className='text-xl font-extrabold'>No conversations</h2>

          <p className='text-center text-gray-500'>
            You can start a conversation by clicking on the{' '}
            <span className='font-black text-xl leading-none'>+</span> button.
          </p>
        </div>
      )}
    </div>
  )
}

export default ConversationsList
