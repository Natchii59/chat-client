import { Transition } from '@headlessui/react'
import { useEffect, useRef, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

import Button from '../Button'
import InputForm from '../InputForm'
import { useUpdateUserMutation } from '@/apollo/generated/graphql'
import { AppDispatch } from '@/stores'
import { selectUser, setUser } from '@/stores/user/userSlice'
import { ErrorMessage, ErrorType } from '@/utils/types'

function Profile() {
  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectUser)

  const [username, setUsername] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('')

  const [selectedProfilePicture, setSelectedProfilePicture] =
    useState<File | null>(null)
  const [selectedProfilePictureUrl, setSelectedProfilePictureUrl] = useState<
    string | null
  >(null)

  const [isModified, setIsModified] = useState<string[]>([])
  const [errors, setErrors] = useState<ErrorMessage[]>([])

  const profilePictureInputRef = useRef<HTMLInputElement>(null)

  const [updateUser, { loading: loadingUpdateUser }] = useUpdateUserMutation({
    context: {
      headers: {
        'Apollo-Require-Preflight': 'true'
      }
    }
  })

  const addIsModified = (key: string) => {
    if (!isModified.includes(key)) setIsModified(prev => [...prev, key])
  }

  const removeIsModified = (key: string) => {
    if (isModified.includes(key))
      setIsModified(prev => prev.filter(item => item !== key))
  }

  const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
    setErrors(prev => prev.filter(error => error.code !== 'username'))
    if (e.target.value !== currentUser?.username) addIsModified('username')
    else removeIsModified('username')
  }

  const handleSetNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value)
    setErrors(prev => prev.filter(error => error.code !== 'password'))
    if (e.target.value !== '') addIsModified('newPassword')
    else removeIsModified('newPassword')
  }

  const handleSetConfirmNewPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmNewPassword(e.target.value)
    setErrors(prev => prev.filter(error => error.code !== 'confirmNewPassword'))
  }

  const handleSetProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 1024 ** 2 * 10) {
        setErrors([
          {
            message: 'Profile picture must be less than 10 MB.',
            code: 'profilePicture'
          }
        ])

        setTimeout(() => {
          setErrors(prev =>
            prev.filter(error => error.code !== 'profilePicture')
          )
        }, 5000)

        return
      }

      setSelectedProfilePicture(e.target.files[0])
      setErrors(prev => prev.filter(error => error.code !== 'profilePicture'))
    }
  }

  const handleDeleteProfilePicture = () => {
    setSelectedProfilePicture(null)
    if (profilePictureInputRef.current)
      profilePictureInputRef.current.value = ''
  }

  const resetForm = () => {
    setUsername(currentUser?.username ?? '')
    setNewPassword('')
    setConfirmNewPassword('')
    setSelectedProfilePicture(null)
    if (profilePictureInputRef.current)
      profilePictureInputRef.current.value = ''

    setIsModified([])
  }

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (newPassword !== confirmNewPassword) {
      setErrors([
        {
          message: 'New password and confirm new password must be same',
          code: 'confirmNewPassword'
        }
      ])
      return
    }

    if (
      selectedProfilePicture &&
      selectedProfilePicture.size > 1024 ** 2 * 10
    ) {
      setErrors([
        {
          message: 'Profile picture must be less than 10 MB.',
          code: 'profilePicture'
        }
      ])
      return
    }

    const { data, errors: rawErrors } = await updateUser({
      variables: {
        input: {
          username: username === currentUser?.username ? undefined : username,
          password: newPassword.length ? newPassword : undefined,
          avatar: selectedProfilePicture ?? undefined
        }
      }
    })

    const errors = rawErrors as unknown as ErrorType[]

    if (errors && errors[0].statusCode === 400) {
      if (newPassword && confirmNewPassword) setConfirmNewPassword('')

      const messages = errors[0].message
      if (Array.isArray(messages)) {
        setErrors(messages)
      } else {
        setErrors([{ message: messages, code: '' }])
      }
    }

    if (!data?.UpdateUser) return

    dispatch(setUser(data.UpdateUser))
    resetForm()
  }

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username)
    }

    return () => {
      setUsername('')
    }
  }, [currentUser])

  useEffect(() => {
    if (selectedProfilePicture) {
      const url = URL.createObjectURL(selectedProfilePicture)
      setSelectedProfilePictureUrl(url)
      addIsModified('profilePicture')
    } else {
      setSelectedProfilePictureUrl(null)
      removeIsModified('profilePicture')
    }

    return () => {
      setSelectedProfilePictureUrl(null)
    }
  }, [selectedProfilePicture])

  return (
    <>
      <h1 className='text-2xl font-black'>Update Profile</h1>

      <form onSubmit={handleUpdateUser} className='mt-4 flex px-2 gap-4'>
        <div className='flex-auto flex flex-col gap-3'>
          <InputForm
            type='text'
            label='Username'
            name='username'
            inputSize='sm'
            required
            pattern='^[a-z0-9_]{3,}$'
            value={username}
            onChange={handleSetUsername}
            error={errors.find(error => error.code === 'username')}
          />

          <InputForm
            type='password'
            label='New Password'
            name='new-password'
            inputSize='sm'
            pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{12,}$'
            value={newPassword}
            onChange={handleSetNewPassword}
            error={errors.find(error => error.code === 'password')}
          />

          <InputForm
            type='password'
            label='Confirm New Password'
            name='confirm-new-password'
            inputSize='sm'
            pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{12,}$'
            value={confirmNewPassword}
            onChange={handleSetConfirmNewPassword}
            error={errors.find(error => error.code === 'confirmNewPassword')}
          />
        </div>

        <div className='px-8'>
          <h2 className='text-lg font-bold mb-4'>Profile Picture</h2>

          <input
            ref={profilePictureInputRef}
            type='file'
            accept='image/*'
            multiple={false}
            disabled={loadingUpdateUser}
            className='hidden'
            onChange={handleSetProfilePicture}
          />

          <div className='relative'>
            <button
              type='button'
              disabled={loadingUpdateUser}
              onClick={() => profilePictureInputRef.current?.click()}
              className={`group rounded-full relative w-40 h-40 overflow-hidden ${
                errors.find(error => error.code === 'profilePicture')
                  ? 'ring-2 ring-red-500'
                  : null
              }`}
            >
              {currentUser?.avatar ? (
                <img
                  src={
                    selectedProfilePictureUrl ??
                    `${import.meta.env.VITE_CDN_URL}/${currentUser.id}/${
                      currentUser.avatar.key
                    }`
                  }
                  alt='Profile'
                  loading='lazy'
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full object-cover bg-zinc-400' />
              )}

              <div className='hidden absolute inset-0 group-hover:flex items-center justify-center bg-zinc-900/60 text-zinc-50 text-lg font-semibold'>
                Edit
              </div>
            </button>

            {selectedProfilePicture ? (
              <Button
                buttonSize='sm'
                buttonType='danger'
                square
                className='absolute top-1 right-2 z-10'
                icon={<FaTrash />}
                onClick={handleDeleteProfilePicture}
              />
            ) : null}
          </div>

          {errors.some(error => error.code === 'profilePicture') ? (
            <p className='text-red-500 text-sm mt-1 max-w-[160px]'>
              {errors.find(error => error.code === 'profilePicture')?.message}
            </p>
          ) : null}
        </div>

        <Transition
          as='div'
          appear
          show={isModified.length > 0}
          className='absolute inset-x-0 bottom-0'
        >
          <Transition.Child
            as='div'
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            className='px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-between gap-4'
          >
            <span>You have unsaved changes</span>

            <div className='flex items-stretch gap-2'>
              <Button
                type='button'
                buttonSize='sm'
                buttonType='secondary'
                onClick={resetForm}
                disabled={loadingUpdateUser}
              >
                Discard
              </Button>

              <Button
                buttonSize='sm'
                buttonType='primary'
                type='submit'
                isLoading={loadingUpdateUser}
                disabled={
                  newPassword.length > 0 && newPassword !== confirmNewPassword
                }
              >
                Save
              </Button>
            </div>
          </Transition.Child>
        </Transition>
      </form>
    </>
  )
}

export default Profile
