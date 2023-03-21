import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar/Sidebar'

function Layout() {
  return (
    <div className='grid grid-cols-5'>
      <div className='col-span-1'>
        <Sidebar />
      </div>

      <div className='col-span-4'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
