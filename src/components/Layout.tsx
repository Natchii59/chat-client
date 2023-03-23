import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar/Sidebar'

function Layout() {
  return (
    <div className='flex'>
      <div className='w-72'>
        <Sidebar />
      </div>

      <div className='flex-auto'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
