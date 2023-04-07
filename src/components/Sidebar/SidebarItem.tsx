import { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import SidebarItemContextMenu from './SidebarItemContextMenu'
import ImageOptimized from '../ImageOptimized'
import { ConversationsStore } from '@/stores/conversations/conversationsSlice'
import { selectFriends } from '@/stores/friends/friendsSlice'
import { selectUser } from '@/stores/user/userSlice'

interface SidebarItemProps {
  conversation: ConversationsStore
}

function SidebarItem({ conversation }: SidebarItemProps) {
  const currentUser = useSelector(selectUser)
  const friends = useSelector(selectFriends)

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
  const [targetContextMenu, setTargetContextMenu] = useState<any | null>(null)

  const currentUserConversation =
    conversation.creator.id === currentUser?.id
      ? conversation.creator
      : conversation.recipient

  const otherUserConversation =
    conversation.creator.id === currentUser?.id
      ? conversation.recipient
      : conversation.creator

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
          `px-2 py-1.5 rounded-xl flex items-center justify-between ${
            isActive
              ? 'bg-zinc-200 dark:bg-zinc-700 ring-2 ring-offset-0 ring-zinc-300 dark:ring-zinc-500'
              : showContextMenu
              ? 'bg-zinc-200 dark:bg-zinc-700'
              : 'bg-inherit hover:bg-zinc-200 hover:dark:bg-zinc-700'
          }`
        }
      >
        <div className='flex items-center gap-2 bg-inherit'>
          <div className='w-10 h-10 relative bg-inherit'>
            {otherUserConversation.avatar ? (
              <ImageOptimized
                src={`${import.meta.env.VITE_CDN_URL}/${
                  otherUserConversation.id
                }/${otherUserConversation.avatar.key}`}
                blurhash={otherUserConversation.avatar.blurhash}
                width={40}
                alt='Profile'
                classNameStyle='rounded-full'
              />
            ) : (
              <div className='w-10 h-10 rounded-full bg-zinc-400' />
            )}

            {friends.find(friend => friend.id === otherUserConversation.id)
              ?.online ? (
              <div className='w-4 h-4 rounded-full p-0.5 bg-inherit absolute right-0 bottom-0 z-20 flex items-center justify-center'>
                <div className='bg-green-500 w-full h-full rounded-full' />
              </div>
            ) : null}
          </div>

          <div className='flex flex-col items-start justify-between'>
            <h4 className='font-semibold text-ellipsis overflow-hidden whitespace-nowrap'>
              {otherUserConversation.username}
            </h4>

            <p className='text-ellipsis overflow-hidden whitespace-nowrap text-zinc-500 dark:text-zinc-400 text-xs'>
              {conversation.isTyping ? 'Typing...' : null}
            </p>
          </div>
        </div>

        {currentUserConversation.unreadMessagesCount > 0 ? (
          <div className='flex items-center justify-center w-6 h-6 rounded-full bg-blue-400 text-zinc-50 text-xs font-semibold'>
            {currentUserConversation.unreadMessagesCount}
          </div>
        ) : null}
      </NavLink>

      <SidebarItemContextMenu
        target={targetContextMenu}
        show={showContextMenu}
        onHide={handleHideContextMenu}
        conversation={conversation}
      />
    </>
  )
}

export default SidebarItem
