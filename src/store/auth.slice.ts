import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AuthService } from '../services/auth.service'
import { UserService } from '../services/user.service'

const initialState: any = {
  isLoading: false,
  data: null,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, data) => {
      state.data = data.payload
    },
    clearAuthState: (state) => {
      state.data = null
    },
    removeNotification: (state, data) => {
      state.data.notifications = data.payload
    },
    addSubmission: (state, data) => {
      state.data.submissions = data.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAuthUser.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchAuthUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.data = action.payload ?? null
      state.error = null
    })
    builder.addCase(fetchAuthUser.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
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
      localStorage.setItem('user', data._id)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export const fetchAuthUser = createAsyncThunk(
  'users/fetch-one',
  async (id: string) => {
    try {
      const { data } = await UserService.getOne(id)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export const { reducer: authReducer } = authSlice
export const {
  setAuthState,
  clearAuthState,
  removeNotification,
  addSubmission
} = authSlice.actions
