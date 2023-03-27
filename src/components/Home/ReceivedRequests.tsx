import { useContext } from 'react'
import { FaUserCheck, FaUserTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

import Button from '../Button'
import ImageOptimized from '../ImageOptimized'
import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import {
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation
} from '@/stores/friends/friendsApiSlice'
import { selectReceivedRequests } from '@/stores/friends/friendsSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'

function ReceivedRequests() {
  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const receivedRequests = useSelector(selectReceivedRequests)

  const [acceptFriendRequest, { isLoading: isLoadingAcceptFriendRequest }] =
    useAcceptFriendRequestMutation()

  const [declineFriendRequest, { isLoading: isLoadingDeclineFriendRequest }] =
    useDeclineFriendRequestMutation()

  const acceptFriendRequestHandle = async (id: string) => {
    const { data, errors } = await acceptFriendRequest({ id }).unwrap()

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data.AcceptFriendRequest) return

    socket.emit('acceptFriendRequest', { userId: data.AcceptFriendRequest.id })
  }

  const declineFriendRequestHandle = async (id: string) => {
    const { data, errors } = await declineFriendRequest({ id }).unwrap()

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data.DeclineFriendRequest) return

    socket.emit('declineFriendRequest', {
      userId: data.DeclineFriendRequest.id
    })
  }

  return receivedRequests.length ? (
    <div className='flex flex-col gap-2'>
      {receivedRequests.map(request => (
        <div
          key={request.id}
          className='py-2 px-4 flex items-center justify-between rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800'
        >
          <div className='flex items-center gap-2'>
            {request.avatar ? (
              <ImageOptimized
                src={`${import.meta.env.VITE_CDN_URL}/${request.id}/${
                  request.avatar.key
                }`}
                blurhash={request.avatar.blurhash}
                width={40}
                alt='Profile'
                classNamePosition='w-10 h-10'
                classNameStyle='rounded-full'
              />
            ) : (
              <div className='w-10 h-10 rounded-full bg-zinc-400' />
            )}

            <h3 className='text-lg font-semibold'>{request.username}</h3>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              buttonType='success'
              buttonSize='sm'
              square
              icon={<FaUserCheck />}
              isLoading={isLoadingAcceptFriendRequest}
              disabled={isLoadingDeclineFriendRequest}
              onClick={() => acceptFriendRequestHandle(request.id)}
            />

            <Button
              buttonType='danger'
              buttonSize='sm'
              square
              icon={<FaUserTimes />}
              isLoading={isLoadingDeclineFriendRequest}
              disabled={isLoadingAcceptFriendRequest}
              onClick={() => declineFriendRequestHandle(request.id)}
            />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className='text-lg font-semibold'>
      You don&apos;t have any received requests yet.
    </div>
  )
}

export default ReceivedRequests
