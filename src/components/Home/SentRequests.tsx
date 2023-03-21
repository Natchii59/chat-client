import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserTimes } from 'react-icons/fa'

import Button from '../Button'
import { selectSentRequests } from '@/stores/friends/friendsSlice'
import { useCancelFriendRequestMutation } from '@/stores/friends/friendsApiSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import { AppDispatch } from '@/stores'
import { initInformationDialog } from '@/stores/app/appSlice'

function SentRequests() {
  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const sentRequests = useSelector(selectSentRequests)

  const [cancelFriendRequest, { isLoading: isLoadingCancelFriendRequest }] =
    useCancelFriendRequestMutation()

  const cancelFriendRequestHandle = async (id: string) => {
    const { data, errors } = await cancelFriendRequest({ id }).unwrap()

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

    console.log(data)
    socket.emit('cancelFriendRequest', { userId: data.CancelFriendRequest.id })
  }

  return sentRequests.length ? (
    <div className='flex flex-col gap-2'>
      {sentRequests.map(request => (
        <div
          key={request.id}
          className='py-2 px-4 flex items-center justify-between rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800'
        >
          <div className='flex items-center gap-2'>
            {request.avatar ? (
              <img
                src={`${import.meta.env.VITE_CDN_URL}/${request.id}/${
                  request.avatar
                }.png`}
                alt='Profile'
                className='w-10 h-10 rounded-full'
              />
            ) : (
              <div className='w-10 h-10 rounded-full bg-zinc-400' />
            )}

            <h3 className='text-lg font-semibold'>{request.username}</h3>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              buttonType='danger'
              buttonSize='sm'
              disabled={isLoadingCancelFriendRequest}
              onClick={() => cancelFriendRequestHandle(request.id)}
            >
              <FaUserTimes />
            </Button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className='text-lg font-semibold'>
      You don&apos;t have any sent requests yet.
    </div>
  )
}

export default SentRequests
