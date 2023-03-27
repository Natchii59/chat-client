import { Popover } from '@headlessui/react'
import { useContext, useState } from 'react'
import { FaEllipsisV } from 'react-icons/fa'
import { usePopper } from 'react-popper'
import { useDispatch } from 'react-redux'

import Button from '../Button'
import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import { useRemoveFriendMutation } from '@/stores/friends/friendsApiSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import { User } from '@/utils/graphqlTypes'

interface FriendPopoverOptionsProps {
  friend: User
}

function FriendPopoverOptions({ friend }: FriendPopoverOptionsProps) {
  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

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

  const [removeFriend, { isLoading }] = useRemoveFriendMutation()

  const removeFriendHandle = async () => {
    const { data, errors } = await removeFriend({ id: friend.id }).unwrap()

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data.RemoveFriend) return

    socket.emit('removeFriend', { userId: data.RemoveFriend.id })
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
          onClick={removeFriendHandle}
          disabled={isLoading}
          className='text-sm font-medium py-1.5 px-2 text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg'
        >
          Remove this friend
        </button>
      </Popover.Panel>
    </Popover>
  )
}

export default FriendPopoverOptions
