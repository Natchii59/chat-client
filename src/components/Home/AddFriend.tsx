import { useContext, useRef, useState } from 'react'
import { FaSpinner, FaUserPlus } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import { useSendFriendRequestMutation } from '@/stores/friends/friendsApiSlice'
import {
  selectFriends,
  selectReceivedRequests,
  selectSentRequests
} from '@/stores/friends/friendsSlice'
import { selectUser } from '@/stores/user/userSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'

function AddFriend() {
  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectUser)
  const friends = useSelector(selectFriends)
  const receivedRequests = useSelector(selectReceivedRequests)
  const sentRequests = useSelector(selectSentRequests)

  const [addFriendUsername, setAddFriendUsername] = useState<string>('')
  const [addFriendSuccess, setAddFriendSuccess] = useState<string>('')
  const [addFriendError, setAddFriendError] = useState<string>('')

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
      if ([400, 404].includes(errors[0].statusCode)) {
        const { message } = errors[0]

        if (Array.isArray(message)) {
          setAddFriendError(message[0].message ?? '')
        } else {
          setAddFriendError(message)
        }
        addFriendInputRef.current?.focus()
      } else {
        dispatch(initInformationDialogError(errors))
        return
      }
    }

    if (!data?.SendFriendRequest) return

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

  const updateAddFriendUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddFriendUsername(e.target.value)
    setAddFriendError('')
    setAddFriendSuccess('')
  }

  return (
    <div className='space-y-2'>
      <form onSubmit={sendFriendRequestHandle} className='flex items-stretch'>
        <div className='relative w-full'>
          <input
            ref={addFriendInputRef}
            type='text'
            autoComplete='off'
            placeholder='Username'
            required
            pattern='^[a-z0-9_]{3,}$'
            aria-describedby='add-friend-help'
            className={`px-2.5 py-2 w-full text-base bg-zinc-100 dark:bg-zinc-800 rounded-l-xl border-2 border-r-0 focus:outline-none focus:ring-0 peer disabled:cursor-not-allowed focus:invalid:border-red-500 dark:focus:invalid:border-red-500 disabled:opacity-70 border-zinc-300 dark:border-zinc-600 focus:border-blue-500 dark:focus:border-blue-500 ${
              isLoadingSendFriendRequest ? 'pr-10' : ''
            }`}
            value={addFriendUsername}
            onChange={updateAddFriendUsername}
            disabled={isLoadingSendFriendRequest}
          />

          {isLoadingSendFriendRequest ? (
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
              <FaSpinner className='animate-spin' />
            </div>
          ) : null}
        </div>

        <button
          type='submit'
          disabled={isLoadingSendFriendRequest}
          className='font-bold rounded-r-xl border-2 disabled:cursor-not-allowed outline-none flex items-center justify-center bg-blue-400 hover:bg-blue-400/90 focus:bg-blue-400/90 text-zinc-50 border-blue-500 text-sm w-11 h-11'
        >
          <FaUserPlus />
        </button>
      </form>

      {addFriendError && (
        <p id='add-friend-help' className='text-red-500 text-sm font-semibold'>
          {addFriendError}
        </p>
      )}

      {addFriendSuccess && (
        <p
          id='add-friend-help'
          className='text-green-500 text-sm font-semibold'
        >
          {addFriendSuccess}
        </p>
      )}
    </div>
  )
}

export default AddFriend
