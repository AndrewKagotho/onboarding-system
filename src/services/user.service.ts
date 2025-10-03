import { api } from '../utils/libs/axios'

const getNotifications = async (id: string) =>
  api(`/v1/users/${id}/notifications`)

export const UserService = {
  getNotifications
}
