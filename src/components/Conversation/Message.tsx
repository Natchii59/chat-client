import moment from 'moment'
import { useContext, useEffect, useRef, useState } from 'react'
import { FaReply } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

import MessageContextMenu from './MessageContextMenu'
import ImageOptimized from '../ImageOptimized'
import { useUpdateMessageMutation } from '@/apollo/generated/graphql'
import { AppDispatch } from '@/stores'
import { initInformationDialogError } from '@/stores/app/appSlice'
import {
  MessageConversationStore,
  selectConversationEditMessageId,
  selectConversationFirstMessageUnreadId,
  selectConversationId,
  selectConversationReplyToMessage,
  selectConversationUser,
  setConversationEditMessageId,
  setConversationReplyToMessage
} from '@/stores/conversation/conversationSlice'
import { selectUser } from '@/stores/user/userSlice'
import { MessageInputContext } from '@/utils/contexts/MessageInputContext'
import { SocketContext } from '@/utils/contexts/SocketContext'
import { ErrorType } from '@/utils/types'

interface MessageProps {
  message: MessageConversationStore
  showUser: boolean
}

function MessageComponent({ message, showUser }: MessageProps) {
  const { socket } = useContext(SocketContext)
  const { messageInputRef } = useContext(MessageInputContext)

  const dispatch = useDispatch<AppDispatch>()

  const conversationId = useSelector(selectConversationId)
  const currentUser = useSelector(selectUser)
  const userConversation = useSelector(selectConversationUser)
  const editMessageId = useSelector(selectConversationEditMessageId)
  const messageReplyTo = useSelector(selectConversationReplyToMessage)
  const firstMessageUnreadId = useSelector(
    selectConversationFirstMessageUnreadId
  )

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
  const [targetContextMenu, setTargetContextMenu] = useState<any | null>(null)
  const [editContent, setEditContent] = useState<string>(message.content)

  const textAreaEditRef = useRef<HTMLTextAreaElement>(null)

  const date = moment(message.createdAt).calendar()
  const hours = moment(message.createdAt).format('HH:mm')

  const firstUnread =
    firstMessageUnreadId === message.id && message.user.id !== currentUser?.id

  const [updateMessage, { loading: loadingUpdateMessage }] =
    useUpdateMessageMutation()

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setTargetContextMenu({
      getBoundingClientRect: () => {
        return {
          x: e.clientX,
          y: e.clientY,
          width: 0,
          height: 0,
          top: e.clientY,
          right: e.clientX,
          bottom: e.clientY,
          left: e.clientX
        }
      }
    })
    setShowContextMenu(true)
  }

  const handleHideContextMenu = () => {
    setShowContextMenu(false)
  }

  const updateMessageHandle = async (
    e:
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()

    if (
      !userConversation ||
      !currentUser ||
      !conversationId ||
      loadingUpdateMessage
    )
      return

    if (message.content.trim() === editContent.trim()) {
      dispatch(setConversationEditMessageId(undefined))
      messageInputRef?.current?.focus()
      setEditContent(message.content)
      return
    }

    const { data, errors: rawErrors } = await updateMessage({
      variables: {
        input: {
          id: message.id,
          content: editContent
        }
      }
    })

    const errors = rawErrors as unknown as ErrorType[]

    if (errors) {
      dispatch(initInformationDialogError(errors))
      return
    }

    if (!data?.UpdateMessage) return

    socket.emit('updateMessage', {
      message: data.UpdateMessage
    })

    dispatch(setConversationEditMessageId(undefined))
    setEditContent(data.UpdateMessage.content)
    messageInputRef?.current?.focus()
  }

  useEffect(() => {
    if (textAreaEditRef.current) {
      textAreaEditRef.current.style.height = '0'

      const textAreaHeight = textAreaEditRef.current.scrollHeight
      textAreaEditRef.current.style.height = `${textAreaHeight}px`
    }
  }, [editContent, editMessageId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(setConversationEditMessageId(undefined))
        setEditContent(message.content ?? '')
        messageInputRef?.current?.focus()
      }
    }

    if (editMessageId === message.id) {
      if (textAreaEditRef.current) {
        textAreaEditRef.current.focus()
        textAreaEditRef.current.selectionStart =
          textAreaEditRef.current.value.length
      }

      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [editMessageId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(setConversationReplyToMessage(undefined))
        messageInputRef?.current?.focus()
      }
    }

    if (messageReplyTo?.id === message.id) {
      messageInputRef?.current?.focus()
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [messageReplyTo])

  return (
    <>
      <div className='relative w-full'>
        {firstUnread ? (
          <div className='w-full py-3 relative'>
            <hr className='h-px bg-blue-500 border-none' />

            <span className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-blue-500 bg-zinc-50 dark:bg-zinc-900 px-2 text-sm'>
              New messages
            </span>
          </div>
        ) : null}

        <div
          onContextMenu={handleContextMenu}
          className={`w-full pl-18 pr-12 hover:bg-zinc-100 hover:dark:bg-zinc-800/30 rounded-xl group ${
            (showUser || message.replyTo) && !firstUnread ? 'mt-4' : null
          } ${
            showContextMenu ||
            editMessageId === message.id ||
            messageReplyTo?.id === message.id
              ? 'bg-zinc-100 dark:bg-zinc-800/30'
              : null
          } ${editMessageId === message.id ? 'py-1' : 'py-0.5'}`}
        >
          {message.replyTo ? (
            <div className='flex items-center gap-1.5 text-zinc-500 text-sm text-ellipsis overflow-hidden whitespace-nowrap select-none'>
              <FaReply />
              <span className='font-bold'>{message.replyTo.user.username}</span>
              {message.replyTo.content}
            </div>
          ) : null}

          {showUser || message.replyTo ? (
            <>
              {message.user?.avatar ? (
                <ImageOptimized
                  src={`${import.meta.env.VITE_CDN_URL}/${message.user.id}/${
                    message.user.avatar.key
                  }`}
                  blurhash={message.user.avatar.blurhash}
                  width={40}
                  alt='Profile'
                  classNamePosition='w-10 h-10 absolute left-4 mt-1'
                  classNameStyle='rounded-full'
                />
              ) : (
                <div className='w-10 h-10 rounded-full bg-zinc-400 absolute left-4 mt-1' />
              )}
              <h4 className='flex items-baseline gap-2'>
                <span className='font-bold'>{message.user?.username}</span>
                <span className='text-zinc-500 text-sm'>{date}</span>
              </h4>
            </>
          ) : (
            <p className='absolute left-5 text-xs mt-1 text-zinc-500 font-medium invisible group-hover:visible select-none'>
              {hours}
            </p>
          )}

          {editMessageId === message.id ? (
            <div className='h-full'>
              <textarea
                ref={textAreaEditRef}
                autoFocus
                className='block p-2 bg-zinc-50 dark:bg-zinc-900 border-none outline-none text-base resize-none max-h-40 w-full rounded-lg'
                value={editContent}
                disabled={loadingUpdateMessage}
                onChange={e => {
                  setEditContent(e.target.value)
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    updateMessageHandle(e)
                  }
                }}
              />

              <div className='text-xs mt-1'>
                Escape to{' '}
                <button
                  className='text-blue-400 underline'
                  onClick={() => {
                    dispatch(setConversationEditMessageId(undefined))
                    setEditContent(message.content ?? '')
                  }}
                >
                  cancel
                </button>
                , Enter to{' '}
                <button
                  onClick={updateMessageHandle}
                  className='text-blue-400 underline'
                >
                  save
                </button>
              </div>
            </div>
          ) : (
            <p
              className={`break-words w-full min-w-0 select-text whitespace-pre-line ${
                message.isModified
                  ? "after:content-['(modified)'] after:text-xs after:text-zinc-500 after:ml-1"
                  : null
              }`}
            >
              {message.content}
            </p>
          )}
        </div>
      </div>

      <MessageContextMenu
        key={message.id}
        target={targetContextMenu}
        show={showContextMenu}
        onHide={handleHideContextMenu}
        message={message}
        ownMessage={message.user?.id === currentUser?.id}
      />
    </>
  )
}

export default MessageComponent
