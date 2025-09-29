import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FormService } from '../services/form.service'
import type { InitialStateType } from '../utils/types'

const initialState: InitialStateType = {
  isLoading: false,
  data: [],
  error: null
}

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchForms.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchForms.fulfilled, (state, action) => {
      state.isLoading = false
      state.data = action.payload.forms ?? []
      state.error = null
    })
    builder.addCase(fetchForms.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
    builder.addCase(createForm.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(createForm.fulfilled, (state) => {
      state.isLoading = false
      state.error = null
    })
    builder.addCase(createForm.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
  }
})

export const fetchForms = createAsyncThunk('forms/fetch', async () => {
  try {
    const { data } = await FormService.getAll()
    return data
  } catch (error) {
    return Promise.reject(error)
  }
})

export const createForm = createAsyncThunk(
  'forms/create',
  async (newForm: Record<string, any>) => {
    try {
      const { data } = await FormService.create(newForm)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export const { reducer } = formSlice
