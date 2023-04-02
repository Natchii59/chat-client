import { createContext } from 'react'

interface MessageInputContextProps {
  messageInputRef: React.RefObject<HTMLTextAreaElement> | null
}

export const MessageInputContext = createContext<MessageInputContextProps>({
  messageInputRef: null
})
