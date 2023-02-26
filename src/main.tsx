import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import App from './App'
import { store } from './stores'
import { SocketContext, socket } from './utils/contexts/SocketContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Routes>
            <Route path='/*' element={<App />} />
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </Provider>
  </React.StrictMode>
)
