import { useContext } from 'react'
import { FaUserTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

import Button from '../Button'
import ImageOptimized from '../ImageOptimized'
import { useCancelFriendRequestMutation } from '@/apollo/generated/graphql'
import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import { selectSentRequests } from '@/stores/friends/friendsSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import { ErrorType } from '@/utils/types'

function SentRequests() {
  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const sentRequests = useSelector(selectSentRequests)

  const [cancelFriendRequest, { loading }] = useCancelFriendRequestMutation()

  const cancelFriendRequestHandle = async (id: string) => {
    if (loading) return

    const { data, errors: rawErrors } = await cancelFriendRequest({
      variables: {
        id
      }
    })

    const errors = rawErrors as unknown as ErrorType[]

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data?.CancelFriendRequest) return

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
              buttonType='danger'
              buttonSize='sm'
              square
              icon={<FaUserTimes />}
              isLoading={loading}
              onClick={() => cancelFriendRequestHandle(request.id)}
            />
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
