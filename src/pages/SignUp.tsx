import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { selectUser, setUser } from '@/stores/auth/authSlice'
import { AppDispatch } from '@/stores'
import { useSignupMutation } from '@/stores/auth/authApiSlice'
import { ErrorMessage } from '@/utils/types'
import { setConversations } from '@/stores/conversations/conversationsSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import InputForm from '@/components/InputForm'
import Button from '@/components/Button'

function SignUp() {
  const location = useLocation()
  const navigate = useNavigate()

  const [username, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [errors, setErrors] = useState<ErrorMessage[]>([])

  const [signUp, { isLoading }] = useSignupMutation()

  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectUser)

  const { socket } = useContext(SocketContext)

  const updateUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.toLowerCase())
    setErrors(err => err.filter(e => e.code !== 'username'))
  }

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setErrors(err => err.filter(e => e.code !== 'password'))
  }

  const updateConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    setErrors(err => err.filter(e => e.code !== 'confirmPassword'))
  }

  useEffect(() => {
    if (currentUser) navigate(location.state?.from ?? '/')
  }, [currentUser])

  const submitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setErrors([
        { message: 'Password does not match', code: 'confirmPassword' }
      ])
      return
    }

    const { data, errors } = await signUp({
      username,
      password
    }).unwrap()

    if (errors) {
      if ([400, 401].includes(errors[0].statusCode)) {
        setPassword('')
        setConfirmPassword('')

        const messages = errors[0].message
        if (Array.isArray(messages)) {
          setErrors(messages)
        } else {
          setErrors([{ message: messages, code: '' }])
        }
      }
    } else if (data) {
      const { conversations, ...user } = data.SignUp.user

      localStorage.setItem('accessToken', data.SignUp.accessToken)
      localStorage.setItem('refreshToken', data.SignUp.refreshToken)

      dispatch(setUser(user))
      dispatch(setConversations(conversations))

      socket.auth = {
        token: data.SignUp.accessToken
      }
      socket.connect()

      navigate(location.state?.from ?? '/')
    }
  }

  return (
    <div className='absolute inset-0 flex items-center justify-center max-w-md mx-auto w-full'>
      <form onSubmit={submitHandle} className='flex flex-col gap-4 w-full'>
        <h1 className='text-3xl font-extrabold'>Create your account</h1>

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

        <InputForm
          name='confirm-password'
          label='Confirm password'
          type='password'
          required
          pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{12,}$'
          aria-label='Confirm password'
          value={confirmPassword}
          onChange={updateConfirmPassword}
          disabled={isLoading}
          error={errors.find(e => e.code === 'confirmPassword')}
        />

        <Button buttonType='primary' type='submit' disabled={isLoading}>
          Sign up
        </Button>

        <p className='text-center'>
          You have already an account?{' '}
          <Link
            to='/signup'
            state={{ from: location.state?.from ?? null }}
            className='text-blue-400 outline-none hover:underline focus:underline'
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignUp
