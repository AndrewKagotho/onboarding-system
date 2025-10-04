import { api } from '../utils/libs/axios'

const getAll = async () => api('/v1/forms')

const getAllPublished = async () => api('/v1/forms/published')

const getOne = async (id: string) => api(`/v1/forms/${id}`)

const create = async (newForm: Record<string, any>) =>
  api.post('/v1/forms', newForm)

const publish = async ({
  id,
  isPublished
}: {
  id: string
  isPublished: boolean
}) => api.post(`/v1/forms/${id}/publish`, isPublished)

export const FormService = {
  getAll,
  getAllPublished,
  getOne,
  create,
  publish
}
