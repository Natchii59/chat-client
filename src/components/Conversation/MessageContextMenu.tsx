import { useState } from 'react'
import { usePopper } from 'react-popper'
import { useDispatch, useSelector } from 'react-redux'

import { useCloseContextMenu } from '@/hooks/useCloseContextMenu'
import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import { useDeleteMessageMutation } from '@/stores/conversation/conversationApiSlice'
import {
  selectConversationId,
  selectConversationUser
} from '@/stores/conversation/conversationSlice'
import { selectUser } from '@/stores/user/userSlice'
import { socket } from '@/utils/contexts/SocketContext'

interface MessageContextMenuProps {
  target: HTMLElement | null
  show: boolean
  onHide: () => void
  messageId: string
  ownMessage: boolean
}

function MessageContextMenu({
  target,
  show,
  onHide,
  messageId,
  ownMessage
}: MessageContextMenuProps) {
  const dispatch = useDispatch<AppDispatch>()

  const conversationId = useSelector(selectConversationId)
  const userConversation = useSelector(selectConversationUser)
  const currentUser = useSelector(selectUser)

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

  const [deleteMessage, { isLoading: isLoadingDeleteMessage }] =
    useDeleteMessageMutation()

  const deleteMessageHandle = async () => {
    if (!conversationId || !userConversation || !currentUser) return

    const { data, errors } = await deleteMessage({ id: messageId }).unwrap()

    onHide()

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data.DeleteMessage) return

    socket.emit('deleteMessage', {
      conversationId,
      messageId: data.DeleteMessage,
      user1Id: currentUser.id,
      user2Id: userConversation.id
    })
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
      {ownMessage ? (
        <button className='text-sm font-medium py-1.5 px-2 text-left hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg'>
          Edit the message
        </button>
      ) : null}

      {ownMessage ? (
        <button
          onClick={deleteMessageHandle}
          disabled={isLoadingDeleteMessage}
          className='text-sm font-medium py-1.5 px-2 text-left text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg'
        >
          Delete the message
        </button>
      ) : null}
    </div>
  )
}

export default MessageContextMenu
