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
      state.data = action.payload ?? []
      state.error = null
    })
    builder.addCase(fetchForms.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
    builder.addCase(fetchPublishedForms.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchPublishedForms.fulfilled, (state, action) => {
      state.isLoading = false
      state.data = action.payload ?? []
      state.error = null
    })
    builder.addCase(fetchPublishedForms.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
    builder.addCase(fetchForm.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchForm.fulfilled, (state) => {
      state.isLoading = false
      state.error = null
    })
    builder.addCase(fetchForm.rejected, (state, action) => {
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

export const fetchPublishedForms = createAsyncThunk(
  'forms/fetch-published',
  async () => {
    try {
      const { data } = await FormService.getAllPublished()
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export const fetchForm = createAsyncThunk(
  'forms/fetch-one',
  async (id: string) => {
    try {
      const { data } = await FormService.getOne(id)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

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

export const publishForm = createAsyncThunk(
  'forms/create',
  async (args: { id: string; isPublished: boolean }) => {
    try {
      await FormService.publish(args)
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export const { reducer: formReducer } = formSlice
