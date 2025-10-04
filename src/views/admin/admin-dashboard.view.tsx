import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchForms } from '../../store/form.slice'
import { Spinner } from '../../components/spinner'
import { NewFormView } from './new-form.view'
import { parseDate } from '../../utils/functions'

export const AdminDashboardView = () => {
  const [isAddingForm, setIsAddingForm] = useState(false)

  const authState = useAppSelector((state) => state.auth)
  const formState = useAppSelector((state) => state.form)

  const { data: authUser } = authState
  const { data: forms, isLoading } = formState

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchForms())
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {isAddingForm ? (
            <NewFormView setIsAddingForm={setIsAddingForm} />
          ) : (
            <>
              {authUser && <h1 className='banner'>Hello {authUser.name}...</h1>}
              <div className='main_content'>
                {authUser.notifications?.length ? (
                  <div
                    className='highlight highlight-flex highlight-blue'
                    onClick={() => {
                      navigate(`/admin/notifications/${authUser._id}`)
                    }}>
                    <span className='bold'>
                      New notifications: {authUser.notifications.length}
                    </span>
                    <span className='span-a'>View</span>
                  </div>
                ) : (
                  <span className='highlight'>No new notifications...</span>
                )}
                <button
                  className='submit-end'
                  onClick={() => setIsAddingForm(true)}>
                  New form
                </button>
                <div>
                  <header className='header-alt'>
                    <h1 className='heading heading-thin-2'>Forms</h1>
                  </header>
                  <ul className='list'>
                    {forms.length ? (
                      forms.map((form: Record<string, any>) => (
                        <Link to={`/admin/form/${form._id}`} key={form._id}>
                          <li className='card'>
                            <div>
                              <div className='card_title'>
                                <span>
                                  <em>{form.name}</em>
                                </span>
                                <span
                                  className={
                                    form.publishedOn
                                      ? 'badge-green-icon'
                                      : 'badge-grey-icon'
                                  }>
                                  {' ● '}
                                </span>
                                <span
                                  className={
                                    'badge ' +
                                    (form.publishedOn
                                      ? 'badge-green'
                                      : 'badge-grey')
                                  }>
                                  {form.publishedOn ? 'live' : 'offline'}
                                </span>
                              </div>
                              <span>
                                {/* {form.updatedOn
                              ? `Last modified: ${parseDate(
                                  form.updatedOn
                                )}`
                              : `Created: ${parseDate(form.createdOn)}`} */}
                                Created: {parseDate(form.createdOn)}
                              </span>
                            </div>
                            <span>
                              Submissions: {form.submissions.length || '--'}
                            </span>
                          </li>
                        </Link>
                      ))
                    ) : (
                      <span>No results.</span>
                    )}
                  </ul>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
