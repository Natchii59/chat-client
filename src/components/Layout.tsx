import { Outlet } from 'react-router-dom'
import ConversationSideBar from './ConversationSideBar'

function Layout() {
  return (
    <div className='grid grid-cols-5'>
      <div className='col-span-1'>
        <ConversationSideBar />
      </div>

      <div className='col-span-4'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
