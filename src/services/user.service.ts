import { api } from '../utils/libs/axios'

const getOne = async (id: string) => api(`/v1/users/${id}`)

const getNotifications = async (id: string) =>
  api(`/v1/users/${id}/notifications`)

const removeNotification = async ({
  userId,
  submissionId
}: {
  userId: string
  submissionId: string
}) => api.delete(`/v1/users/${userId}/notifications/${submissionId}`)

export const UserService = {
  getOne,
  getNotifications,
  removeNotification
}
