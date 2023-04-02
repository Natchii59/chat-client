import { useState } from 'react'
import { usePopper } from 'react-popper'
import { useDispatch } from 'react-redux'

import { useCloseConversationMutation } from '@/apollo/generated/graphql'
import { useCloseContextMenu } from '@/hooks/useCloseContextMenu'
import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import { removeConversation } from '@/stores/conversations/conversationsSlice'
import { ErrorType } from '@/utils/types'

interface SidebarItemContextMenuProps {
  target: HTMLElement | null
  show: boolean
  onHide: () => void
  conversationId: string
}

function SidebarItemContextMenu({
  target,
  show,
  onHide,
  conversationId
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

  const [closeConversation, { loading }] = useCloseConversationMutation()

  const closeConversationHandle = async () => {
    const { data, errors: rawErrors } = await closeConversation({
      variables: {
        id: conversationId
      }
    })

    const errors = rawErrors as unknown as ErrorType[]

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data?.CloseConversation) return

    dispatch(removeConversation(data.CloseConversation.id))
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
        disabled={loading}
        className='text-sm font-medium py-1.5 px-2 text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg'
      >
        Close conversation
      </button>
    </div>
  )
}

export default SidebarItemContextMenu
