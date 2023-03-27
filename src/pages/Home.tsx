import { Tab } from '@headlessui/react'
import { FaUserPlus } from 'react-icons/fa'

import Button from '@/components/Button'
import AddFriend from '@/components/Home/AddFriend'
import Friends from '@/components/Home/Friends'
import ReceivedRequests from '@/components/Home/ReceivedRequests'
import SentRequests from '@/components/Home/SentRequests'

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
              as={Button}
              key={tabItem.value}
              buttonType='secondary'
              buttonSize='sm'
              headlessuiMode='selected'
            >
              {tabItem.name}
            </Tab>
          ))}

          <Tab
            as={Button}
            buttonType='primary'
            buttonSize='sm'
            headlessuiMode='selected'
            icon={<FaUserPlus />}
          >
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
