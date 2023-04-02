import { Popover } from '@headlessui/react'
import { useState } from 'react'
import { FaEllipsisV } from 'react-icons/fa'
import { usePopper } from 'react-popper'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Button from '../Button'
import { useCloseConversationMutation } from '@/apollo/generated/graphql'
import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import { selectConversationId } from '@/stores/conversation/conversationSlice'
import { removeConversation } from '@/stores/conversations/conversationsSlice'
import { ErrorType } from '@/utils/types'

function ConversationPopoverOptions() {
  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>()

  const conversationId = useSelector(selectConversationId)

  const [referenceElement, setReferenceElement] = useState<any>()
  const [popperElement, setPopperElement] = useState<any>()

  const { attributes, styles } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8]
        }
      }
    ]
  })

  const [closeConversation, { loading }] = useCloseConversationMutation()

  const closeConversationHandle = async () => {
    if (!conversationId || loading) return

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
    navigate('/')
  }

  return (
    <Popover className='relative'>
      <Popover.Button
        as={Button}
        ref={setReferenceElement}
        buttonType='secondary'
        buttonSize='sm'
        square
        headlessuiMode='open'
        icon={<FaEllipsisV />}
      />

      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className='z-20 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl shadow-md p-1 w-screen max-w-max'
      >
        <button
          onClick={closeConversationHandle}
          disabled={loading}
          className='text-sm font-medium py-1.5 px-2 text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg'
        >
          Close conversation
        </button>
      </Popover.Panel>
    </Popover>
  )
}

export default ConversationPopoverOptions
