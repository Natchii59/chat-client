import { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import SidebarItemContextMenu from './SidebarItemContextMenu'
import ImageOptimized from '../ImageOptimized'
import { ConversationsStore } from '@/stores/conversations/conversationsSlice'
import { selectFriends } from '@/stores/friends/friendsSlice'

interface SidebarItemProps {
  conversation: ConversationsStore
}

function SidebarItem({ conversation }: SidebarItemProps) {
  const friends = useSelector(selectFriends)

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
  const [targetContextMenu, setTargetContextMenu] = useState<any | null>(null)

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
              : 'bg-inherit'
          }`
        }
      >
        <div className='w-10 h-10 absolute left-3 top-1/2 transform -translate-y-1/2 bg-inherit'>
          {conversation.user.avatar ? (
            <ImageOptimized
              src={`${import.meta.env.VITE_CDN_URL}/${conversation.user.id}/${
                conversation.user.avatar.key
              }`}
              blurhash={conversation.user.avatar.blurhash}
              width={40}
              alt='Profile'
              classNameStyle='rounded-full'
            />
          ) : (
            <div className='w-10 h-10 rounded-full bg-zinc-400' />
          )}

          {friends.find(friend => friend.id === conversation.user.id)
            ?.online ? (
            <div className='w-4 h-4 rounded-full p-0.5 bg-inherit absolute right-0 bottom-0 z-20 flex items-center justify-center'>
              <div className='bg-green-500 w-full h-full rounded-full' />
            </div>
          ) : null}
        </div>

        <h4 className='font-semibold text-ellipsis overflow-hidden whitespace-nowrap'>
          {conversation.user.username}
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
        conversationId={conversation.id}
      />
    </>
  )
}

export default SidebarItem
