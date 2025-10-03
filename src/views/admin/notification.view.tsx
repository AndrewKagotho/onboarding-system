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

  const getNotifications = async (id: any) =>
    setNotifications(await dispatch(fetchNotifications(id)).unwrap())

  const handleSubmission = (submission: Record<string, any>) =>
    navigate(`/submission/${submission._id}`)

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <main>
          <div className='main_content'>
            <button type='button' onClick={() => navigate('/admin')}>
              Back to home
            </button>
            <div className='card'>
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
                  className='subtext subtext-flex'
                  key={submission._id}
                  onClick={() => handleSubmission(submission)}>
                  <span>
                    <em className='bold'>NEW:</em>{' '}
                    <em className='bold'>
                      {submission.formId.name}
                      {' - '}
                      {submission.submittedBy.name}
                    </em>
                  </span>
                  <span>{parseDateTime(submission.submittedOn)}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      )}
    </>
  )
}
