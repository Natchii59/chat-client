import { Fragment, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { FaCheck, FaPlus, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import { selectFriends } from '@/stores/friends/friendsSlice'
import ImageOptimized from '../ImageOptimized'
import {
  addConversationWithSort,
  selectConversations
} from '@/stores/conversations/conversationsSlice'
import { useCreateConversationMutation } from '@/stores/conversations/conversationsApiSlice'
import { AppDispatch } from '@/stores'
import { initInformationDialog } from '@/stores/app/appSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'

function NewConversationDialog() {
  const navigate = useNavigate()

  const friends = useSelector(selectFriends)
  const conversations = useSelector(selectConversations)

  const dispatch = useDispatch<AppDispatch>()

  const { socket } = useContext(SocketContext)

  const [isOpen, setIsOpen] = useState(false)
  const [friendId, setFriendId] = useState<string>('')

  const [createConversation, { isLoading }] = useCreateConversationMutation()

  function closeModal() {
    setIsOpen(false)
    setFriendId('')
  }

  function openModal() {
    setIsOpen(true)
  }

  const createConversationHandle = async () => {
    if (!friendId) return

    const conversation = conversations.find(
      conversation =>
        conversation.user1.id === friendId || conversation.user2.id === friendId
    )

    if (conversation) {
      navigate(`/conversation/${conversation.id}`)
      closeModal()
      return
    }

    const { data, errors } = await createConversation({
      userId: friendId
    }).unwrap()

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

    if (data?.CreateConversation) {
      const { conversation, created } = data.CreateConversation

      if (created) {
        socket.emit('createConversation', conversation)
      } else {
        console.log(conversation)
        dispatch(addConversationWithSort(conversation))
      }
      navigate(`/conversation/${conversation.id}`)
      closeModal()
    }
  }

  return (
    <>
      <button
        type='button'
        onClick={openModal}
        className='font-bold rounded-xl border-2 shadow-[0_4px_0] active:shadow-none active:transform active:translate-y-1 disabled:shadow-none disabled:transform disabled:translate-y-1 disabled:cursor-not-allowed outline-none flex items-center justify-center gap-2 mb-1 bg-blue-400 hover:bg-blue-400/90 focus:bg-blue-400/90 text-zinc-50 border-blue-500 shadow-blue-500 text-sm w-8 h-8'
      >
        <FaPlus />
      </button>

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
                    <button
                      type='button'
                      onClick={createConversationHandle}
                      disabled={isLoading || !friendId}
                      className='font-bold rounded-xl border-2 shadow-[0_4px_0] active:shadow-none active:transform active:translate-y-1 disabled:shadow-none disabled:transform disabled:translate-y-1 disabled:cursor-not-allowed outline-none flex items-center justify-center mb-1 bg-blue-400 hover:bg-blue-400/90 focus:bg-blue-400/90 text-zinc-50 border-blue-500 shadow-blue-500 text-base w-full h-12 mt-4'
                    >
                      Start conversation
                    </button>
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
