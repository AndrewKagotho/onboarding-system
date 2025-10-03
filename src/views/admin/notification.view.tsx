import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchNotifications } from '../../store/user.slice'
import { parseDateTime } from '../../utils/functions'
import { Spinner } from '../../components/spinner'

export const NotificationView = () => {
  const [notifications, setNotifications] = useState<Record<string, any>[]>([])

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

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

  const handleNotification = ({ _id }: { _id: string }) =>
    navigate(`/submission/${_id}`)

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
                <span className='badge-orange-icon'>{' ● '}</span>
                <span className='badge badge-orange'>
                  {notifications.length}
                </span>
              </div>
            </div>
          </div>
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
        </div>
      )}
    </>
  )
}
