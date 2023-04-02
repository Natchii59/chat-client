import { useSelector } from 'react-redux'

import FriendItem from './FriendItem'
import { selectFriends } from '@/stores/friends/friendsSlice'

function Friends() {
  const friends = useSelector(selectFriends)

  return friends.length ? (
    <div className='flex flex-col gap-2'>
      {friends.map(friend => (
        <FriendItem key={friend.id} friend={friend} />
      ))}
    </div>
  ) : (
    <div className='text-lg font-semibold'>
      You don&apos;t have any friends yet.
    </div>
  )
}

export default Friends
