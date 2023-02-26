import { configureStore } from '@reduxjs/toolkit'

import authReducer from './auth/authSlice'
import { apiSlice } from '../api/apiSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,

    auth: authReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {auth: AuthState}
export type AppDispatch = typeof store.dispatch
