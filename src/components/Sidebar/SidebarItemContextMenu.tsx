import { useState } from 'react'
import { usePopper } from 'react-popper'
import { useDispatch } from 'react-redux'

import { useCloseContextMenu } from '@/hooks/useCloseContextMenu'
import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import { useCloseConversationMutation } from '@/stores/conversations/conversationsApiSlice'
import { removeConversation } from '@/stores/conversations/conversationsSlice'

interface SidebarItemContextMenuProps {
  target: HTMLElement | null
  show: boolean
  onHide: () => void
  conversationid: string
}

function SidebarItemContextMenu({
  target,
  show,
  onHide,
  conversationid
}: SidebarItemContextMenuProps) {
  const dispatch = useDispatch<AppDispatch>()

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  )

  const { styles, attributes } = usePopper(target, popperElement, {
    placement: 'bottom-start'
  })

  useCloseContextMenu({
    id: '#conversation-context-menu',
    onHide
  })

  const [closeConversation, { isLoading: isLoadingCloseConversation }] =
    useCloseConversationMutation()

  const closeConversationHandle = async () => {
    const { data, errors } = await closeConversation({
      id: conversationid
    }).unwrap()

    // onHide()

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data?.CloseConversation) return

    dispatch(removeConversation(data.CloseConversation.id))
    // navigate('/')
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
        onClick={closeConversationHandle}
        disabled={isLoadingCloseConversation}
        className='text-sm font-medium py-1.5 px-2 text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg'
      >
        Close conversation
      </button>
    </div>
  )
}

export default SidebarItemContextMenu
