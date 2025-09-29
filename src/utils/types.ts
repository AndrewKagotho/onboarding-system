type AppState = {
  isLoading: boolean
  error: any
}

export type InitialStateType = {
  data: []
} & AppState
