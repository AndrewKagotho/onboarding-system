import { api } from '../utils/libs/axios'

const getOne = async (id: string) => api(`/v1/submissions/${id}`)

const create = async (newSubmission: Record<string, any>) =>
  api.post(`/v1/submissions`, newSubmission)

export const SubmissionService = {
  getOne,
  create
}
