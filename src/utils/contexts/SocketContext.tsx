import { createContext } from 'react'
import { Socket, io } from 'socket.io-client'

interface SocketContextProps {
  socket: Socket
}

export const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    token: localStorage.getItem('accessToken')
  },
  autoConnect: false
})

export const SocketContext = createContext<SocketContextProps>({
  socket
})
