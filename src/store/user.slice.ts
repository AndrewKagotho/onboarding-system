import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '.'
import { removeNotification as removeNotificationState } from './auth.slice'
import { UserService } from '../services/user.service'
import type { InitialStateType } from '../utils/types'

const initialState: InitialStateType = {
  isLoading: false,
  data: [],
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchNotifications.fulfilled, (state) => {
      state.isLoading = false
      state.error = null
    })
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
  }
})

export const fetchNotifications = createAsyncThunk(
  'user/fetch-notifications',
  async (id: string) => {
    try {
      const { data } = await UserService.getNotifications(id)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export const removeNotification = createAsyncThunk(
  'user/remove-notification',
  async (
    { userId, submissionId }: { userId: string; submissionId: string },
    { getState, dispatch }
  ) => {
    try {
      await UserService.removeNotification({ userId, submissionId })

      const state = getState() as RootState
      let notificationsState = state.auth.data.notifications

      notificationsState = notificationsState?.filter(
        ({ refId }: { refId: string }) => refId !== submissionId
      )

      dispatch(removeNotificationState(notificationsState))
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export const { reducer: userReducer } = userSlice
