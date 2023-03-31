import { Tab } from '@headlessui/react'

import Profile from '@/components/Settings/Profile'
import SidebarSettings from '@/components/Settings/Sidebar'

function Settings() {
  return (
    <Tab.Group>
      <div className='flex'>
        <div className='w-72'>
          <SidebarSettings />
        </div>

        <div className='flex-auto p-2 h-screen'>
          <Tab.Panels className='overflow-auto relative h-full'>
            <Tab.Panel>
              <Profile />
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </div>
    </Tab.Group>
  )
}

export default Settings
