import { useContext } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import FriendPopoverOptions from './FriendPopoverOptions'
import ImageOptimized from '../ImageOptimized'
import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import { useCreateConversationMutation } from '@/stores/conversations/conversationsApiSlice'
import {
  addConversationWithSort,
  selectConversations
} from '@/stores/conversations/conversationsSlice'
import { selectFriends } from '@/stores/friends/friendsSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import { User } from '@/utils/graphqlTypes'

function Friends() {
  const navigate = useNavigate()

  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const friends = useSelector(selectFriends)
  const conversations = useSelector(selectConversations)

  const [createConversation, { isLoading }] = useCreateConversationMutation()

  const onClickFriendHandle = async (friend: User) => {
    if (isLoading) return

    const findConversation = conversations.find(
      conversation =>
        conversation.user1.id === friend.id ||
        conversation.user2.id === friend.id
    )

    if (findConversation) {
      navigate(`/conversation/${findConversation.id}`)
      return
    }

    const { data, errors } = await createConversation({
      input: {
        userId: friend.id
      }
    }).unwrap()

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data.CreateConversation) return

    const { conversation, created } = data.CreateConversation

    if (created) {
      socket.emit('createConversation', { conversation })
    } else {
      dispatch(addConversationWithSort(conversation))
    }
    navigate(`/conversation/${conversation.id}`)
  }

  return friends.length ? (
    <div className='flex flex-col gap-2'>
      {friends.map(friend => (
        <div
          key={friend.id}
          role='button'
          onClick={() => onClickFriendHandle(friend)}
          className='py-2 px-4 flex items-center justify-between rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 active:ring-2 active:ring-offset-0 active:ring-zinc-300 dark:active:ring-zinc-600'
        >
          <div className='flex items-center gap-2'>
            <div className='relative'>
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

              {isLoading ? (
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20'>
                  <FaSpinner className='w-5 h-5 animate-spin' />
                </div>
              ) : null}
            </div>

            <h3 className='text-lg font-semibold'>{friend.username}</h3>
          </div>

          <FriendPopoverOptions friend={friend} />
        </div>
      ))}
    </div>
  ) : (
    <div className='text-lg font-semibold'>
      You don&apos;t have any friends yet.
    </div>
  )
}

export default Friends
