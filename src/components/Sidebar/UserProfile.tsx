import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Popover } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { Link, useNavigate } from 'react-router-dom'
import { FaEllipsisH } from 'react-icons/fa'

import { logout, selectUser } from '@/stores/user/userSlice'
import ImageOptimized from '../ImageOptimized'
import { AppDispatch } from '@/stores'

function UserProfile() {
  const navigate = useNavigate()

  const user = useSelector(selectUser)

  const dispatch = useDispatch<AppDispatch>()

  const [referenceElement, setReferenceElement] = useState<any>()
  const [popperElement, setPopperElement] = useState<any>()

  const { attributes, styles } = usePopper(referenceElement, popperElement, {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8]
        }
      }
    ]
  })

  const logoutHandle = () => {
    dispatch(logout())
    navigate('/sign-in')
  }

  if (!user) return null

  return (
    <div className='p-2 w-full'>
      <Popover className='relative'>
        <Popover.Button
          ref={setReferenceElement}
          className='flex items-center justify-between px-3 py-2 rounded-xl w-full border-2 shadow-[0_4px_0] active:shadow-none active:transform active:translate-y-1 outline-none mb-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-600 shadow-zinc-300 dark:shadow-zinc-600 ui-open:bg-zinc-200 dark:ui-open:bg-zinc-700 ui-open:shadow-none ui-open:transform ui-open:translate-y-1'
        >
          <div className='flex items-center gap-2'>
            {user.avatar ? (
              <ImageOptimized
                src={`${import.meta.env.VITE_CDN_URL}/${user.id}/${
                  user.avatar.key
                }`}
                blurhash={user.avatar.blurhash}
                width={40}
                alt='Profile'
                classNamePosition='w-10 h-10'
                classNameStyle='rounded-full'
              />
            ) : (
              <div className='w-10 h-10 rounded-full bg-zinc-400' />
            )}

            <h4 className='font-semibold'>{user.username}</h4>
          </div>

          <FaEllipsisH />
        </Popover.Button>

        <Popover.Panel
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className='absolute z-20 w-full p-1 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl flex flex-col gap-1'
        >
          <Link
            to='/settings'
            className='w-full px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700'
          >
            Settings
          </Link>

          <button
            onClick={logoutHandle}
            className='w-full px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-red-500 text-left'
          >
            Logout
          </button>
        </Popover.Panel>
      </Popover>
    </div>
  )
}

export default UserProfile
