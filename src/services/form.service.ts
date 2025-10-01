import { api } from '../utils/libs/axios'

const getAll = async () => api('/v1/forms')

const getOne = async (id: string) => api(`/v1/forms/${id}`)

const create = async (newForm: Record<string, any>) =>
  api.post('/v1/forms', newForm)

export const FormService = {
  getAll,
  getOne,
  create
}
