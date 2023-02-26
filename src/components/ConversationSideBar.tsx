import { useContext, useEffect, useState } from 'react'
import { useConversationsQuery } from '../stores/callApiSlice'
import ConversationSideBarItem from './ConversationSideBarItem'
import { SocketContext } from '../utils/contexts/SocketContext'
import { Conversation, Message } from '../utils/types'

function ConversationSideBar() {
  const [conversations, setConversations] = useState<Conversation[]>([])

  const { data, isLoading } = useConversationsQuery()

  const socket = useContext(SocketContext)

  useEffect(() => {
    if (!data) return

    setConversations(data.data.Profile.conversations)

    return () => {
      setConversations([])
    }
  }, [data])

  useEffect(() => {
    socket.on('onMessageUpdateConversationSideBar', (payload: Message) => {
      console.log('onMessageUpdateConversationSideBar', payload)
      setConversations(prev => {
        const conversation = prev.find(
          conversation => conversation.id === payload.conversation.id
        )

        if (!conversation) return prev

        return [
          {
            ...conversation,
            lastMessage: payload
          },
          ...prev.filter(
            conversation => conversation.id !== payload.conversation.id
          )
        ]
      })
    })

    return () => {
      socket.off('onMessageUpdateConversationSideBar')
    }
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='p-2 overflow-y-scroll min-h-screen bg-zinc-200/50 dark:bg-zinc-800/50'>
      <h2 className='px-4 py-2 text-xl font-semibold mb-3'>Conversation</h2>

      <div className='flex flex-col gap-1'>
        {conversations.map(conversation => (
          <ConversationSideBarItem
            key={conversation.id}
            conversation={conversation}
          />
        ))}
      </div>
    </div>
  )
}

export default ConversationSideBar
