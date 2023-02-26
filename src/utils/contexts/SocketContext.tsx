import { createContext } from 'react'
import { io } from 'socket.io-client'

export const socket = io(import.meta.env.VITE_APP_API_URL, {
  extraHeaders: {
    Authorization: localStorage.getItem('accessToken')!
  }
})

export const SocketContext = createContext(socket)
