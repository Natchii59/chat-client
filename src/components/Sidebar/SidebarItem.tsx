import { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import SidebarItemContextMenu from './SideBarItemContextMenu'
import ImageOptimized from '../ImageOptimized'
import { ConversationType } from '@/stores/conversations/conversationsSlice'
import { selectUser } from '@/stores/user/userSlice'

interface SidebarItemProps {
  conversation: ConversationType
}

function SidebarItem({ conversation }: SidebarItemProps) {
  const currentUser = useSelector(selectUser)

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
  const [targetContextMenu, setTargetContextMenu] = useState<any | null>(null)

  const otherUser =
    conversation.user1.id === currentUser?.id
      ? conversation.user2
      : conversation.user1

  const handleContextMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setTargetContextMenu({
      getBoundingClientRect: () => {
        return {
          x: e.clientX,
          y: e.clientY,
          width: 0,
          height: 0,
          top: e.clientY,
          right: e.clientX,
          bottom: e.clientY,
          left: e.clientX
        }
      }
    })
    setShowContextMenu(true)
  }

  const handleHideContextMenu = () => {
    setShowContextMenu(false)
  }

  return (
    <>
      <NavLink
        to={`/conversation/${conversation.id}`}
        onContextMenu={handleContextMenu}
        className={({ isActive }) =>
          `relative pr-3 py-2 pl-16 rounded-xl hover:bg-zinc-200 hover:dark:bg-zinc-700 ${
            isActive
              ? 'bg-zinc-200 dark:bg-zinc-700 ring-2 ring-offset-0 ring-zinc-300 dark:ring-zinc-500'
              : ''
          }`
        }
      >
        {otherUser.avatar ? (
          <ImageOptimized
            src={`${import.meta.env.VITE_CDN_URL}/${otherUser.id}/${
              otherUser.avatar.key
            }`}
            blurhash={otherUser.avatar.blurhash}
            width={40}
            alt='Profile'
            classNamePosition='w-10 h-10 absolute left-3 top-1/2 transform -translate-y-1/2'
            classNameStyle='rounded-full'
          />
        ) : (
          <div className='w-10 h-10 rounded-full bg-zinc-400 absolute left-3 top-1/2 transform -translate-y-1/2' />
        )}

        <h4 className='font-semibold text-ellipsis overflow-hidden whitespace-nowrap'>
          {otherUser.username}
        </h4>

        <p className='text-ellipsis overflow-hidden whitespace-nowrap text-zinc-500 dark:text-zinc-400 text-sm'>
          {conversation.isTyping
            ? 'Typing...'
            : conversation.lastMessage
            ? conversation.lastMessage.content
            : 'No message'}
        </p>
      </NavLink>

      <SidebarItemContextMenu
        target={targetContextMenu}
        show={showContextMenu}
        onHide={handleHideContextMenu}
        conversationid={conversation.id}
      />
    </>
  )
}

export default SidebarItem
