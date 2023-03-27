import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Button from '@/components/Button'
import InputForm from '@/components/InputForm'
import { AppDispatch } from '@/stores'
import { setConversations } from '@/stores/conversations/conversationsSlice'
import {
  setFriends,
  setReceivedRequests,
  setSentRequests
} from '@/stores/friends/friendsSlice'
import { useSignInMutation } from '@/stores/user/authApiSlice'
import { selectUser, setUser } from '@/stores/user/userSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import { ErrorMessage } from '@/utils/types'

function SignIn() {
  const location = useLocation()
  const navigate = useNavigate()

  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectUser)

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errors, setErrors] = useState<ErrorMessage[]>([])

  const [signIn, { isLoading }] = useSignInMutation()

  const updateUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.toLowerCase())
    setErrors(err => err.filter(e => e.code !== 'username'))
  }

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setErrors(err => err.filter(e => e.code !== 'password'))
  }

  useEffect(() => {
    if (currentUser) navigate(location.state?.from ?? '/')
  }, [currentUser])

  const submitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data, errors } = await signIn({
      username,
      password
    }).unwrap()

    if (errors && errors[0].statusCode === 400) {
      setPassword('')

      const messages = errors[0].message
      if (Array.isArray(messages)) {
        setErrors(messages)
      } else {
        setErrors([{ message: messages, code: '' }])
      }
    }

    if (!data.SignIn) return

    const { conversations, friends, receivedRequests, sentRequests, ...user } =
      data.SignIn.user

    localStorage.setItem('accessToken', data.SignIn.accessToken)
    localStorage.setItem('refreshToken', data.SignIn.refreshToken)

    dispatch(setUser(user))

    if (conversations) dispatch(setConversations(conversations))
    if (friends) dispatch(setFriends(friends))
    if (receivedRequests) dispatch(setReceivedRequests(receivedRequests))
    if (sentRequests) dispatch(setSentRequests(sentRequests))

    socket.auth = {
      token: data.SignIn.accessToken
    }
    socket.connect()

    navigate(location.state?.from ?? '/')
  }

  return (
    <div className='absolute inset-0 flex items-center justify-center max-w-md mx-auto w-full'>
      <form onSubmit={submitHandle} className='space-y-4 w-full'>
        <div>
          <h1 className='text-3xl font-extrabold'>Connect to ChatApp</h1>

          {errors.length > 0 && (
            <p
              className='text-red-500 text-lg font-semibold'
              role='alert'
              aria-label='Invalid credentials'
            >
              Invalid credentials
            </p>
          )}
        </div>

        <InputForm
          name='username'
          label='Username'
          type='text'
          required
          pattern='^[a-z0-9_]{3,}$'
          aria-label='Username'
          value={username}
          onChange={updateUsername}
          disabled={isLoading}
          error={errors.find(e => e.code === 'username')}
        />

        <InputForm
          name='password'
          label='Password'
          type='password'
          required
          pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{12,}$'
          aria-label='Password'
          value={password}
          onChange={updatePassword}
          disabled={isLoading}
          error={errors.find(e => e.code === 'password')}
        />

        <Button
          type='submit'
          buttonType='primary'
          widthFull
          isLoading={isLoading}
        >
          Sign in
        </Button>

        <p className='text-center'>
          You don&apos;t have an account?{' '}
          <Link
            to='/sign-up'
            state={{ from: location.state?.from ?? null }}
            className='text-blue-400 outline-none hover:underline focus:underline'
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignIn
