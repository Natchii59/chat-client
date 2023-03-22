import { useContext, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaUserPlus } from 'react-icons/fa'

import { useSendFriendRequestMutation } from '@/stores/friends/friendsApiSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import { selectUser } from '@/stores/user/userSlice'
import {
  selectFriends,
  selectReceivedRequests,
  selectSentRequests
} from '@/stores/friends/friendsSlice'

function AddFriend() {
  const { socket } = useContext(SocketContext)

  const currentUser = useSelector(selectUser)

  const friends = useSelector(selectFriends)
  const receivedRequests = useSelector(selectReceivedRequests)
  const sentRequests = useSelector(selectSentRequests)

  const [addFriendUsername, setAddFriendUsername] = useState<string>('')
  const [addFriendError, setAddFriendError] = useState<string>('')
  const [addFriendSuccess, setAddFriendSuccess] = useState<string>('')

  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>()

  const addFriendInputRef = useRef<HTMLInputElement>(null)

  const [sendFriendRequest, { isLoading: isLoadingSendFriendRequest }] =
    useSendFriendRequestMutation()

  const sendFriendRequestHandle = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (addFriendUsername === currentUser?.username) {
      setAddFriendError("You can't send a friend request to yourself")
      addFriendInputRef.current?.focus()
      return
    } else if (sentRequests.find(r => r.username === addFriendUsername)) {
      setAddFriendError('You already sent a friend request to this user')
      addFriendInputRef.current?.focus()
      return
    } else if (receivedRequests.find(r => r.username === addFriendUsername)) {
      setAddFriendError('You already received a friend request from this user')
      addFriendInputRef.current?.focus()
      return
    } else if (friends.find(r => r.username === addFriendUsername)) {
      setAddFriendError('You are already friends with this user')
      addFriendInputRef.current?.focus()
      return
    }

    const { data, errors } = await sendFriendRequest({
      username: addFriendUsername
    }).unwrap()

    if (errors) {
      const error = errors[0]
      if (Array.isArray(error.message)) {
        setAddFriendError(error.message[0].message ?? '')
      } else {
        setAddFriendError(error.message)
      }
      return
    }

    if (!data.SendFriendRequest) {
      setAddFriendError('User not found')
      addFriendInputRef.current?.focus()
    } else {
      clearTimeout(timer)

      setAddFriendSuccess(
        `Friend request sent to ${data.SendFriendRequest.username}`
      )
      setAddFriendUsername('')
      socket.emit('sendFriendRequest', {
        user: data.SendFriendRequest
      })

      setTimer(
        setTimeout(() => {
          setAddFriendSuccess('')
        }, 5000)
      )
    }
  }

  const updateAddFriendUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddFriendUsername(e.target.value)
    setAddFriendError('')
    setAddFriendSuccess('')
  }

  return (
    <div className='flex flex-col gap-2'>
      <form onSubmit={sendFriendRequestHandle} className='flex items-stretch'>
        <input
          ref={addFriendInputRef}
          type='text'
          autoComplete='off'
          placeholder='Username'
          required
          pattern='^[a-z0-9_]{3,}$'
          className='px-2.5 py-2 w-full text-base bg-zinc-100 dark:bg-zinc-800 rounded-l-xl border-2 border-r-0 focus:outline-none focus:ring-0 peer disabled:cursor-not-allowed focus:invalid:border-red-500 dark:focus:invalid:border-red-500 disabled:opacity-70 border-zinc-300 dark:border-zinc-600 focus:border-blue-500 dark:focus:border-blue-500'
          value={addFriendUsername}
          onChange={updateAddFriendUsername}
          disabled={isLoadingSendFriendRequest}
        />

        <button
          type='submit'
          className='font-bold rounded-r-xl border-2 disabled:cursor-not-allowed outline-none flex items-center justify-center bg-blue-400 hover:bg-blue-400/90 focus:bg-blue-400/90 text-zinc-50 border-blue-500 text-sm w-11 h-11'
          disabled={isLoadingSendFriendRequest}
        >
          <FaUserPlus />
        </button>
      </form>

      {addFriendError && (
        <div className='text-red-500 text-sm font-semibold'>
          {addFriendError}
        </div>
      )}

      {addFriendSuccess && (
        <div className='text-green-500 text-sm font-semibold'>
          {addFriendSuccess}
        </div>
      )}
    </div>
  )
}

export default AddFriend
