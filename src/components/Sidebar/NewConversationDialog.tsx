import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { Fragment, useContext, useState } from 'react'
import { FaCheck, FaPlus, FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Button from '../Button'
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

function NewConversationDialog() {
  const navigate = useNavigate()

  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const friends = useSelector(selectFriends)
  const conversations = useSelector(selectConversations)

  const [isOpen, setIsOpen] = useState(false)
  const [friendId, setFriendId] = useState<string>('')

  const [createConversation, { isLoading }] = useCreateConversationMutation()

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
    setFriendId('')
  }

  const createConversationHandle = async () => {
    if (!friendId) return

    const findConversation = conversations.find(
      conversation =>
        conversation.user1.id === friendId || conversation.user2.id === friendId
    )

    if (findConversation) {
      navigate(`/conversation/${findConversation.id}`)
      closeModal()
      return
    }

    const { data, errors } = await createConversation({
      input: {
        userId: friendId
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
    closeModal()
  }

  return (
    <>
      <Button
        buttonType='primary'
        buttonSize='sm'
        square
        icon={<FaPlus />}
        onClick={openModal}
      />

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4 text-left shadow-lg border-2 border-zinc-300 dark:border-zinc-600'>
                  <Dialog.Title
                    as='h3'
                    className='text-xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center justify-between'
                  >
                    Select a friend to chat with
                    <FaTimes onClick={closeModal} className='cursor-pointer' />
                  </Dialog.Title>

                  <RadioGroup value={friendId} onChange={setFriendId}>
                    <RadioGroup.Label className='sr-only'>
                      Select a friend
                    </RadioGroup.Label>
                    <div className='mt-3 space-y-2 max-h-72 overflow-auto'>
                      {friends.length ? (
                        friends.map(friend => (
                          <RadioGroup.Option
                            key={friend.id}
                            value={friend.id}
                            className='rounded-xl p-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 outline-none'
                          >
                            <div className='relative'>
                              {friend.avatar ? (
                                <ImageOptimized
                                  src={`${import.meta.env.VITE_CDN_URL}/${
                                    friend.id
                                  }/${friend.avatar.key}`}
                                  blurhash={friend.avatar.blurhash}
                                  width={40}
                                  alt='Profile'
                                  classNamePosition='w-9 h-9'
                                  classNameStyle='rounded-full'
                                />
                              ) : (
                                <div className='w-9 h-9 rounded-full bg-zinc-400' />
                              )}

                              <FaCheck className='ui-checked:block hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-400 bg-opacity-40 w-full h-full rounded-full p-2 z-10' />
                            </div>

                            <span className='font-semibold'>
                              {friend.username}
                            </span>
                          </RadioGroup.Option>
                        ))
                      ) : (
                        <div className='text-center text-lg'>
                          You don&apos;t have any friends yet
                        </div>
                      )}
                    </div>
                  </RadioGroup>

                  {friends.length ? (
                    <Button
                      buttonType='primary'
                      buttonSize='base'
                      widthFull
                      isLoading={isLoading}
                      disabled={!friendId}
                      className='mt-4'
                      onClick={createConversationHandle}
                    >
                      Start conversation
                    </Button>
                  ) : null}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default NewConversationDialog
