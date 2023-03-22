import { useSelector } from 'react-redux'

import { selectFriends } from '@/stores/friends/friendsSlice'
import FriendPopoverOptions from './FriendPopoverOptions'
import ImageOptimized from '../ImageOptimized'

function Friends() {
  const friends = useSelector(selectFriends)

  return friends.length ? (
    <div className='flex flex-col gap-2'>
      {friends.map(friend => (
        <div
          key={friend.id}
          className='py-2 px-4 flex items-center justify-between rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 active:ring-2 active:ring-offset-0 active:ring-zinc-300 dark:active:ring-zinc-600'
        >
          <div className='flex items-center gap-2'>
            {friend.avatar ? (
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
            ) : (
              <div className='w-10 h-10 rounded-full bg-zinc-400' />
            )}

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
