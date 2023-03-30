import { createContext } from 'react'

interface MessageInputContextProps {
  messageInputRef: HTMLTextAreaElement | null
  setMessageInputRef: (ref: HTMLTextAreaElement | null) => void
}

export const MessageInputContext = createContext<MessageInputContextProps>({
  messageInputRef: null,
  setMessageInputRef: () => {
    return
  }
})
