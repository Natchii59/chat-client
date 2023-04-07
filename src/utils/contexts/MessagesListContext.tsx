import { createContext } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

interface MessagesListContextProps {
  messagesListRef: InfiniteScroll | null
  setMessagesListRef: (arg: InfiniteScroll | null) => void
}

export const MessagesListContext = createContext<MessagesListContextProps>({
  messagesListRef: null,
  setMessagesListRef: () => {
    return
  }
})
