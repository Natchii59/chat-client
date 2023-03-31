import { Tab } from '@headlessui/react'

type TabSettingsValues = 'profile'

interface ITabSettings {
  name: string
  value: TabSettingsValues
}

const tabs: ITabSettings[] = [{ name: 'Profile', value: 'profile' }]

function SidebarTabsSettings() {
  return (
    <Tab.List className='w-full overflow-auto flex flex-col gap-1 p-2'>
      {tabs.map(tabItem => (
        <Tab
          key={tabItem.value}
          className='relative px-3 py-2 rounded-xl text-left text-lg hover:bg-zinc-200 hover:dark:bg-zinc-700 ui-selected:bg-zinc-200 ui-selected:dark:bg-zinc-700 ui-selected:ring-2 ui-selected:ring-offset-0 ui-selected:ring-zinc-300 ui-selected:dark:ring-zinc-500 outline-none'
        >
          {tabItem.name}
        </Tab>
      ))}
    </Tab.List>
  )
}

export default SidebarTabsSettings
