import { Tab } from '@headlessui/react'
import { FaUserPlus } from 'react-icons/fa'

import Friends from '@/components/Home/Friends'
import ReceivedRequests from '@/components/Home/ReceivedRequests'
import SentRequests from '@/components/Home/SentRequests'
import AddFriend from '@/components/Home/AddFriend'

interface ITab {
  name: string
  value: 'friends' | 'receivedRequests' | 'sentRequests'
}

const tabs: ITab[] = [
  { name: 'Friends', value: 'friends' },
  { name: 'Received requests', value: 'receivedRequests' },
  { name: 'Sent requests', value: 'sentRequests' }
]

function Home() {
  return (
    <div className='p-2 h-full'>
      <Tab.Group>
        <Tab.List className='flex gap-2'>
          {tabs.map(tabItem => (
            <Tab
              key={tabItem.value}
              className='font-bold rounded-xl border-2 shadow-[0_4px_0] active:shadow-none active:transform active:translate-y-1 disabled:shadow-none disabled:transform disabled:translate-y-1 disabled:cursor-not-allowed outline-none mb-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:bg-zinc-200 dark:focus:bg-zinc-700 ui-selected:bg-zinc-200 dark:ui-selected:bg-zinc-700 ui-selected:shadow-none ui-selected:transform ui-selected:translate-y-1 text-blue-400 border-zinc-300 dark:border-zinc-600 shadow-zinc-300 dark:shadow-zinc-600 text-sm px-3 py-1.5'
            >
              {tabItem.name}
            </Tab>
          ))}

          <Tab className='font-bold rounded-xl border-2 shadow-[0_4px_0] active:shadow-none active:transform active:translate-y-1 disabled:shadow-none disabled:transform disabled:translate-y-1 disabled:cursor-not-allowed outline-none flex items-center justify-center gap-2 mb-1 bg-blue-400 hover:bg-blue-400/90 focus:bg-blue-400/90 text-zinc-50 border-blue-500 shadow-blue-500 text-sm px-3 py-1.5 ui-selected:shadow-none ui-selected:transform ui-selected:translate-y-1'>
            <FaUserPlus />
            Add friend
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <div className='mt-4'>
            {/* Friends */}
            <Tab.Panel>
              <Friends />
            </Tab.Panel>

            {/* Received requests */}
            <Tab.Panel>
              <ReceivedRequests />
            </Tab.Panel>

            {/* Sent requests */}
            <Tab.Panel>
              <SentRequests />
            </Tab.Panel>

            {/* Add friend */}
            <Tab.Panel>
              <AddFriend />
            </Tab.Panel>
          </div>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default Home
