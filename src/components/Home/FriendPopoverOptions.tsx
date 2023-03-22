import { useContext, useState } from 'react'
import { Popover } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { FaEllipsisV } from 'react-icons/fa'
import { useDispatch } from 'react-redux'

import { User } from '@/stores/user/userSlice'
import { useRemoveFriendMutation } from '@/stores/friends/friendsApiSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import { AppDispatch } from '@/stores'
import { initInformationDialog } from '@/stores/app/appSlice'

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

    socket.emit('removeFriend', { userId: data.RemoveFriend.id })
  }

  return (
    <Popover className='relative'>
      <Popover.Button
        ref={setReferenceElement}
        className='font-bold rounded-xl border-2 shadow-[0_4px_0] active:shadow-none active:transform active:translate-y-1 disabled:shadow-none disabled:transform disabled:translate-y-1 disabled:cursor-not-allowed outline-none mb-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:bg-zinc-200 dark:focus:bg-zinc-700 ui-open:bg-zinc-200 dark:ui-open::bg-zinc-700 text-blue-400 border-zinc-300 dark:border-zinc-600 shadow-zinc-300 dark:shadow-zinc-600 text-sm w-8 h-8 flex items-center justify-center'
      >
        <FaEllipsisV />
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className='z-20 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl shadow-md px-2 py-1.5 w-screen max-w-max'
      >
        <button
          onClick={removeFriendHandle}
          disabled={isLoading}
          className='text-sm font-medium py-1.5 px-2 text-red-500 hover:bg-red-500 hover:text-zinc-50 rounded-md'
        >
          Remove this friend
        </button>
      </Popover.Panel>
    </Popover>
  )
}

export default FriendPopoverOptions
