import { Popover } from '@headlessui/react'
import { useContext, useState } from 'react'
import { FaEllipsisV, FaSpinner } from 'react-icons/fa'
import { usePopper } from 'react-popper'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Button from '../Button'
import ImageOptimized from '../ImageOptimized'
import {
  useCreateConversationMutation,
  useRemoveFriendMutation
} from '@/apollo/generated/graphql'
import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import {
  addConversationWithOrderBy,
  selectConversations
} from '@/stores/conversations/conversationsSlice'
import { UserFriendsStore } from '@/stores/friends/friendsSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import { ErrorType } from '@/utils/types'

interface FriendItemProps {
  friend: UserFriendsStore
}

function FriendItem({ friend }: FriendItemProps) {
  const navigate = useNavigate()

  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const conversations = useSelector(selectConversations)

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

  const [createConversation, { loading: loadingCreateConversation }] =
    useCreateConversationMutation()

  const [removeFriend, { loading: loadingRemoveFriend }] =
    useRemoveFriendMutation()

  const onClickFriendHandle = async (friend: UserFriendsStore) => {
    if (loadingCreateConversation) return

    const findConversation = conversations.find(
      conversation =>
        conversation.creator.id === friend.id ||
        conversation.recipient.id === friend.id
    )
    if (findConversation) {
      navigate(`/conversation/${findConversation.id}`)
      return
    }

    const { data, errors: rawErrors } = await createConversation({
      variables: {
        input: {
          userId: friend.id
        }
      }
    })

    const errors = rawErrors as unknown as ErrorType[]

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data?.CreateConversation) return

    const { conversation, created } = data.CreateConversation

    if (created) {
      socket.emit('createConversation', { conversation })
    } else {
      dispatch(addConversationWithOrderBy(conversation))
    }
    navigate(`/conversation/${conversation.id}`)
  }

  const removeFriendHandle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (loadingRemoveFriend) return

    const { data, errors: rawErrors } = await removeFriend({
      variables: {
        id: friend.id
      }
    })

    const errors = rawErrors as unknown as ErrorType[]

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data?.RemoveFriend) return

    socket.emit('removeFriend', { userId: data.RemoveFriend.id })
  }

  return (
    <Popover>
      <div
        role='button'
        onClick={() => onClickFriendHandle(friend)}
        className='py-2 px-4 flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:ring-2 active:ring-offset-0 active:ring-zinc-300 dark:active:ring-zinc-600'
      >
        <div className='flex items-center gap-2 bg-inherit'>
          <div className='relative bg-inherit'>
            {friend.avatar ? (
              <>
                <ImageOptimized
                  src={`${import.meta.env.VITE_CDN_URL}/${friend.id}/${
                    friend.avatar.key
                  }`}
                  blurhash={friend.avatar.blurhash}
                  width={40}
                  alt='Profile'
                  classNamePosition='w-10 h-10'
                  classNameStyle='rounded-full'
                />
              </>
            ) : (
              <div className='w-10 h-10 rounded-full bg-zinc-400' />
            )}

            {loadingCreateConversation ? (
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20'>
                <FaSpinner className='w-5 h-5 animate-spin' />
              </div>
            ) : null}

            {friend.online ? (
              <div className='w-4 h-4 rounded-full p-0.5 bg-inherit absolute right-0 bottom-0 z-20 flex items-center justify-center'>
                <div className='bg-green-500 w-full h-full rounded-full' />
              </div>
            ) : null}
          </div>

          <h3 className='text-lg font-semibold'>{friend.username}</h3>
        </div>

        <Popover.Button
          as={Button}
          ref={setReferenceElement}
          buttonType='secondary'
          buttonSize='sm'
          square
          headlessuiMode='open'
          icon={<FaEllipsisV />}
        />
      </div>

      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className='bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl shadow-md p-1 w-screen max-w-max z-20'
      >
        <button
          onClick={removeFriendHandle}
          disabled={loadingRemoveFriend}
          className='text-sm font-medium py-1.5 px-2 text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg'
        >
          Remove this friend
        </button>
      </Popover.Panel>
    </Popover>
  )
}

export default FriendItem
