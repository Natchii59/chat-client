import { useState } from 'react'
import { usePopper } from 'react-popper'
import { useDispatch, useSelector } from 'react-redux'

import {
  useCloseConversationMutation,
  useReadMessagesMutation
} from '@/apollo/generated/graphql'
import { useCloseContextMenu } from '@/hooks/useCloseContextMenu'
import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import {
  ConversationsStore,
  removeConversation,
  setConversationsUnreadMessagesCount
} from '@/stores/conversations/conversationsSlice'
import { selectUser } from '@/stores/user/userSlice'
import { ErrorType } from '@/utils/types'

interface SidebarItemContextMenuProps {
  target: HTMLElement | null
  show: boolean
  onHide: () => void
  conversation: ConversationsStore
}

function SidebarItemContextMenu({
  target,
  show,
  onHide,
  conversation
}: SidebarItemContextMenuProps) {
  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectUser)

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  )

  const { styles, attributes } = usePopper(target, popperElement, {
    placement: 'bottom-start'
  })

  const currentUserConversation =
    currentUser?.id === conversation.creator.id
      ? conversation.creator
      : conversation.recipient

  useCloseContextMenu({
    id: '#conversation-context-menu',
    onHide
  })

  const [readMessages, { loading: loadingReadMessages }] =
    useReadMessagesMutation()

  const [closeConversation, { loading: loadingClose }] =
    useCloseConversationMutation()

  const readMessagesHandle = async () => {
    const { data, errors: rawErrors } = await readMessages({
      variables: {
        conversationId: conversation.id
      }
    })

    const errors = rawErrors as unknown as ErrorType[]

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data?.ReadMessages || !currentUser) return

    dispatch(
      setConversationsUnreadMessagesCount({
        userId: currentUser.id,
        conversationId: conversation.id,
        unreadMessagesCount: 0
      })
    )

    onHide()
  }

  const closeConversationHandle = async () => {
    const { data, errors: rawErrors } = await closeConversation({
      variables: {
        id: conversation.id
      }
    })

    const errors = rawErrors as unknown as ErrorType[]

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data?.CloseConversation) return

    dispatch(removeConversation(data.CloseConversation.id))

    onHide()
  }

  if (!show) return null

  return (
    <div
      id='conversation-context-menu'
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      className='z-40 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl shadow-md p-1 w-screen max-w-max flex flex-col items-stretch gap-1'
    >
      <button
        onClick={readMessagesHandle}
        disabled={
          loadingReadMessages ||
          currentUserConversation.unreadMessagesCount === 0
        }
        className='text-sm font-medium py-1.5 px-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-100 dark:disabled:hover:bg-zinc-800'
      >
        Mark as read
      </button>

      <button
        onClick={closeConversationHandle}
        disabled={loadingClose}
        className='text-sm font-medium py-1.5 px-2 text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-left'
      >
        Close conversation
      </button>
    </div>
  )
}

export default SidebarItemContextMenu
