import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Button from '@/components/Button'
import InputForm from '@/components/InputForm'
import { AppDispatch } from '@/stores'
import { useSignupMutation } from '@/stores/user/authApiSlice'
import { selectUser, setUser } from '@/stores/user/userSlice'
import { SocketContext } from '@/utils/contexts/SocketContext'
import { ErrorMessage } from '@/utils/types'

function SignUp() {
  const location = useLocation()
  const navigate = useNavigate()

  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector(selectUser)

  const [username, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [errors, setErrors] = useState<ErrorMessage[]>([])

  const [signUp, { isLoading }] = useSignupMutation()

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
        { message: 'Password does not match.', code: 'confirmPassword' }
      ])
      return
    }

    const { data, errors } = await signUp({
      input: {
        username,
        password
      }
    }).unwrap()

    if (errors && errors[0].statusCode === 400) {
      setPassword('')
      setConfirmPassword('')

      const messages = errors[0].message
      if (Array.isArray(messages)) {
        setErrors(messages)
      } else {
        setErrors([{ message: messages, code: '' }])
      }
    }

    if (!data.SignUp) return

    localStorage.setItem('accessToken', data.SignUp.accessToken)
    localStorage.setItem('refreshToken', data.SignUp.refreshToken)

    dispatch(setUser(data.SignUp.user))

    socket.auth = {
      token: data.SignUp.accessToken
    }
    socket.connect()

    navigate(location.state?.from ?? '/')
  }

  return (
    <div className='absolute inset-0 flex items-center justify-center max-w-md mx-auto w-full'>
      <form onSubmit={submitHandle} className='space-y-4 w-full'>
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

        <Button
          type='submit'
          buttonType='primary'
          widthFull
          isLoading={isLoading}
        >
          Sign up
        </Button>

        <p className='text-center'>
          You have already an account?{' '}
          <Link
            to='/sign-in'
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
