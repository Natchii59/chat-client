import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import SidebarTabsSettings from './SidebarTabs'

function SidebarSettings() {
  return (
    <div className='p-2 pr-0 h-screen'>
      <div className='flex flex-col items-start rounded-xl h-full bg-zinc-100 dark:bg-zinc-800'>
        <div className='px-4 py-2 w-full'>
          <Link
            to='/'
            className='text-xl font-extrabold flex items-center gap-2 hover:underline hover:underline-offset-2'
          >
            <FaArrowLeft className='w-4 h-4' />
            Settings
          </Link>
        </div>

        <SidebarTabsSettings />
      </div>
    </div>
  )
}

export default SidebarSettings
