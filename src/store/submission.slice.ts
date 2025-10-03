import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SubmissionService } from '../services/submission.service'
import type { InitialStateType } from '../utils/types'

const initialState: InitialStateType = {
  isLoading: false,
  data: [],
  error: null
}

const submissionSlice = createSlice({
  name: 'submission',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSubmission.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchSubmission.fulfilled, (state) => {
      state.isLoading = false
      state.error = null
    })
    builder.addCase(fetchSubmission.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
    builder.addCase(createSubmission.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(createSubmission.fulfilled, (state) => {
      state.isLoading = false
      state.error = null
    })
    builder.addCase(createSubmission.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
  }
})

export const fetchSubmission = createAsyncThunk(
  'submissions/fetch-one',
  async (id: string) => {
    try {
      const { data } = await SubmissionService.getOne(id)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export const createSubmission = createAsyncThunk(
  'submissions/create',
  async (submission: Record<string, any>) => {
    try {
      const { data } = await SubmissionService.create(submission)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export const { reducer: submissionReducer } = submissionSlice
