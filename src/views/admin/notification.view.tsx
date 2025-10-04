import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchNotifications, removeNotification } from '../../store/user.slice'
import { Spinner } from '../../components/spinner'
import { parseDateTime } from '../../utils/functions'

export const NotificationView = () => {
  const [notifications, setNotifications] = useState<Record<string, any>[]>([])

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const authState = useAppSelector((state) => state.auth)
  const { data: authUser } = authState
  const userState = useAppSelector((state) => state.user)
  const { isLoading } = userState

  useEffect(() => {
    if (id) getNotifications(id)
    // eslint-disable-next-line
  }, [])

  const getNotifications = async (id: any) => {
    const notifications = await dispatch(fetchNotifications(id)).unwrap()

    notifications.sort((a: Record<string, any>, b: Record<string, any>) => {
      if (a.submittedOn > b.submittedOn) return -1
      else if (a.submittedOn < b.submittedOn) return 1
      return 0
    })

    setNotifications(notifications)
  }

  const handleNotification = ({ _id }: { _id: string }) => {
    navigate(`/submission/${_id}`)
    dispatch(
      removeNotification({
        userId: authUser._id,
        submissionId: _id
      })
    )
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='main_content'>
          <button type='button' onClick={() => navigate('/admin')}>
            Back to home
          </button>
          <div className='card card-alt'>
            <div>
              <div className='card_title'>
                <span className='heading-thin'>Notifications</span>
                <span
                  className={
                    notifications.length
                      ? 'badge-orange-icon'
                      : 'badge-grey-icon'
                  }>
                  {' ● '}
                </span>
                <span
                  className={
                    'badge ' +
                    (notifications.length ? 'badge-orange' : 'badge-grey')
                  }>
                  {notifications.length || 'NONE'}
                </span>
              </div>
            </div>
          </div>
          {notifications.length ? (
            <ul className='list'>
              {notifications.map((submission: any) => (
                <li
                  key={submission._id}
                  onClick={() => handleNotification(submission)}>
                  <span>
                    <em className='uppercase'>New {submission.type}:</em>{' '}
                    <em className='bold'>
                      "{submission.formId.name}"{' - '}
                      {submission.submittedBy.name}
                    </em>
                  </span>
                  <span>{parseDateTime(submission.submittedOn)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className='highlight'>No new notifications...</span>
          )}
        </div>
      )}
    </>
  )
}
