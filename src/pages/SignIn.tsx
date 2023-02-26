import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { selectUser, setUser } from '../stores/auth/authSlice'
import { AppDispatch } from '../stores'
import { useSignInMutation } from '../stores/auth/authApiSlice'
import { ErrorMessage } from '../utils/types'

function SignIn() {
  const navigate = useNavigate()

  const [username, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errors, setErrors] = useState<ErrorMessage[]>([])

  const [signIn, { isLoading }] = useSignInMutation()
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector(selectUser)

  const updateUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setErrors(err => err.filter(e => e.code !== 'email'))
  }

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setErrors(err => err.filter(e => e.code !== 'password'))
  }

  useEffect(() => {
    if (currentUser) navigate('/')
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
      dispatch(setUser(data.SignIn.user))
      localStorage.setItem('accessToken', data.SignIn.accessToken)
      localStorage.setItem('refreshToken', data.SignIn.refreshToken)

      navigate('/')
    }
  }

  return (
    <form onSubmit={submitHandle}>
      <h1 className='text-3xl font-semibold'>Connectez-vous à ChatApp</h1>

      <input
        className='bg-transparent border'
        type='text'
        required
        value={username}
        onChange={updateUsername}
        disabled={isLoading}
      />

      <input
        className='bg-transparent border'
        type='password'
        required
        value={password}
        onChange={updatePassword}
        disabled={isLoading}
      />

      <button type='submit' disabled={isLoading}>
        Se connecter
      </button>
    </form>
  )
}

export default SignIn
