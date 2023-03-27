import { configureStore } from '@reduxjs/toolkit'

import appReducer from './app/appSlice'
import conversationReducer from './conversation/conversationSlice'
import conversationsReducer from './conversations/conversationsSlice'
import friendsReducer from './friends/friendsSlice'
import userReducer from './user/userSlice'
import { apiSlice } from '@/api/apiSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,

    user: userReducer,
    conversation: conversationReducer,
    conversations: conversationsReducer,
    friends: friendsReducer,
    app: appReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {auth: AuthState}
export type AppDispatch = typeof store.dispatch
