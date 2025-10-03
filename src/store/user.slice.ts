import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { InitialStateType } from '../utils/types'
import { UserService } from '../services/user.service'

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
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
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

export const { reducer: userReducer } = userSlice
