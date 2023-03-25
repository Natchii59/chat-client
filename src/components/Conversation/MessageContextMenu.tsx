import { useState } from 'react'
import { usePopper } from 'react-popper'
import { useDispatch, useSelector } from 'react-redux'

import { useCloseContextMenu } from '@/hooks/useCloseContextMenu'
import { AppDispatch } from '@/stores'
import { initInformationDialog } from '@/stores/app/appSlice'
import { useDeleteMessageMutation } from '@/stores/conversation/conversationApiSlice'
import {
  selectConversationId,
  selectConversationUser
} from '@/stores/conversation/conversationSlice'
import { socket } from '@/utils/contexts/SocketContext'
import { selectUser } from '@/stores/user/userSlice'

interface MessageContextMenuProps {
  target: HTMLElement | null
  show: boolean
  onHide: () => void
  messageId: string
}

function MessageContextMenu({
  target,
  show,
  onHide,
  messageId
}: MessageContextMenuProps) {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  )

  const { styles, attributes } = usePopper(target, popperElement, {
    placement: 'bottom-start'
  })

  useCloseContextMenu({
    id: '#message-context-menu',
    onHide
  })

  const conversationId = useSelector(selectConversationId)
  const userConversation = useSelector(selectConversationUser)
  const currentUser = useSelector(selectUser)

  const dispatch = useDispatch<AppDispatch>()

  const [deleteMessage, { isLoading: isLoadingDeleteMessage }] =
    useDeleteMessageMutation()

  const deleteMessageHandle = async () => {
    if (!conversationId || !userConversation || !currentUser) return

    const { data, errors } = await deleteMessage({ id: messageId }).unwrap()

    if (errors) {
      const message = Array.isArray(errors[0].message)
        ? errors[0].message[0].message
        : errors[0].message

      dispatch(
        initInformationDialog({
          message: `Error: ${message} Status: ${errors[0].statusCode}. Please try again later.`,
          type: 'error'
        })
      )
      return
    }

    if (data.DeleteMessage) {
      socket.emit('deleteMessage', {
        conversationId,
        messageId: data.DeleteMessage,
        user1Id: currentUser.id,
        user2Id: userConversation.id
      })
      onHide()
    }
  }

  if (!show) return null

  return (
    <div
      id='message-context-menu'
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      className='z-40 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl shadow-md p-1 w-screen max-w-max flex flex-col items-stretch gap-1'
    >
      <button className='text-sm font-medium py-1.5 px-2 text-left hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg'>
        Edit the message
      </button>

      <button
        onClick={deleteMessageHandle}
        disabled={isLoadingDeleteMessage}
        className='text-sm font-medium py-1.5 px-2 text-left text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg'
      >
        Delete the message
      </button>
    </div>
  )
}

export default MessageContextMenu
