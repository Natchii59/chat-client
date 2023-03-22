import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { selectUser, setUser } from '@/stores/user/userSlice'
import { AppDispatch } from '@/stores'
import { useSignInMutation } from '@/stores/user/authApiSlice'
import { ErrorMessage } from '@/utils/types'
import { setConversations } from '@/stores/conversations/conversationsSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import InputForm from '@/components/InputForm'
import {
  setFriends,
  setReceivedRequests,
  setSentRequests
} from '@/stores/friends/friendsSlice'
import Button from '@/components/Button'

function SignIn() {
  const location = useLocation()
  const navigate = useNavigate()

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errors, setErrors] = useState<ErrorMessage[]>([])

  const [signIn, { isLoading }] = useSignInMutation()

  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectUser)

  const { socket } = useContext(SocketContext)

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

    if (errors) {
      if ([400, 401].includes(errors[0].statusCode)) {
        setPassword('')

        const messages = errors[0].message
        if (Array.isArray(messages)) {
          setErrors(messages)
        } else {
          setErrors([{ message: messages, code: '' }])
        }
      }
    } else if (data) {
      const {
        conversations,
        friends,
        receivedRequests,
        sentRequests,
        ...user
      } = data.SignIn.user

      localStorage.setItem('accessToken', data.SignIn.accessToken)
      localStorage.setItem('refreshToken', data.SignIn.refreshToken)

      dispatch(setUser(user))
      dispatch(setConversations(conversations))
      dispatch(setFriends(friends))
      dispatch(setReceivedRequests(receivedRequests))
      dispatch(setSentRequests(sentRequests))

      socket.auth = {
        token: data.SignIn.accessToken
      }
      socket.connect()

      navigate(location.state?.from ?? '/')
    }
  }

  return (
    <div className='absolute inset-0 flex items-center justify-center max-w-md mx-auto w-full'>
      <form onSubmit={submitHandle} className='flex flex-col gap-4 w-full'>
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

        <Button buttonType='primary' type='submit' disabled={isLoading}>
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
