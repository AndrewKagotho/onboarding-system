import { api } from '../utils/libs/axios'

const getAll = async () => api('/v1/forms')

const create = async (newForm: Record<string, any>) =>
  api.post('/v1/forms', newForm)

export const FormService = {
  getAll,
  create
}
