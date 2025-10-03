import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './auth.slice'
import { formReducer } from './form.slice'
import { submissionReducer } from './submission.slice'
import { userReducer } from './user.slice'

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
    submission: submissionReducer,
    user: userReducer
  }
})
