import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AuthService } from '../services/auth.service'

const initialState: any = {
  isLoading: false,
  data: null,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false
      state.data = action.payload ?? null
      state.error = null
    })
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
  }
})

export const login = createAsyncThunk(
  'auth/login',
  async (user: Record<string, any>) => {
    try {
      const { data } = await AuthService.login(user)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export const { reducer: authReducer } = authSlice
