import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './user.slice'
import { formReducer } from './form.slice'
import { submissionReducer } from './submission.slice'

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
    submission: submissionReducer
  }
})
