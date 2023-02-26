import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuthenticateQuery } from '../stores/auth/authApiSlice'
import { AppDispatch } from '../stores'
import { setUser } from '../stores/auth/authSlice'

function RequireAuth() {
  const location = useLocation()
  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>()

  const { data, isLoading } = useAuthenticateQuery()

  const routesWithoutAuth = ['/sign-in', '/sign-up']

  useEffect(() => {
    if (isLoading) return

    if (
      (!data?.data.Profile || data?.errors) &&
      !routesWithoutAuth.includes(location.pathname)
    ) {
      navigate('/sign-in', { state: { from: location } })
    } else {
      dispatch(setUser(data?.data.Profile))
    }
  }, [data])

  if (isLoading) return <div />

  if (data) return <Outlet />
  return <Navigate to='/sign-in' state={{ from: location }} replace />
}

export default RequireAuth
