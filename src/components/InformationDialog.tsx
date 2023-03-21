import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  closeInformationDialog,
  selectMessageInformationDialog,
  selectShowInformationDialog,
  selectTypeInformationDialog
} from '@/stores/app/appSlice'
import { AppDispatch } from '@/stores'
import Button, { ButtonType } from './Button'

function InformationDialog({ children }: React.PropsWithChildren) {
  const typesTitle = {
    info: 'Information',
    error: 'An error occurred',
    success: 'Success',
    warning: 'Warning'
  }

  const buttonType: { [key: string]: ButtonType } = {
    info: 'primary',
    error: 'danger',
    success: 'success',
    warning: 'primary'
  }

  const show = useSelector(selectShowInformationDialog)
  const type = useSelector(selectTypeInformationDialog)
  const message = useSelector(selectMessageInformationDialog)

  const dispatch = useDispatch<AppDispatch>()

  const closeModal = () => dispatch(closeInformationDialog())

  return (
    <>
      {children}

      <Transition appear show={show} as={Fragment}>
        <Dialog as='div' className='relative z-40' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4 text-left shadow-lg transition-all border-2 border-zinc-300 dark:border-zinc-600'>
                  <Dialog.Title
                    as='h3'
                    className='text-xl font-extrabold text-zinc-900 dark:text-zinc-50'
                  >
                    {typesTitle[type]}
                  </Dialog.Title>

                  <div className='mt-2'>
                    <p className='text-base text-zinc-500 dark:text-zinc-400'>
                      {message}
                    </p>
                  </div>

                  <div className='mt-4'>
                    <Button buttonType={buttonType[type]} onClick={closeModal}>
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default InformationDialog
