import { configureStore } from '@reduxjs/toolkit'
import { reducer } from './form.slice'

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const store = configureStore({
  reducer: { form: reducer }
})
