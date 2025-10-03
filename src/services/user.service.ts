import { api } from '../utils/libs/axios'

const getOne = async (id: string) => api(`/v1/users/${id}`)

const getNotifications = async (id: string) =>
  api(`/v1/users/${id}/notifications`)

export const UserService = {
  getOne,
  getNotifications
}
