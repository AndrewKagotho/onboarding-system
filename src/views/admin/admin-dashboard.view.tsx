import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchForms } from '../../store/form.slice'
import { Spinner } from '../../components/spinner'
import { parseDate } from '../../utils/functions'

export const AdminDashboardView = () => {
  const authState = useAppSelector((state) => state.auth)
  const formState = useAppSelector((state) => state.form)

  const { data: forms, isLoading } = formState

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchForms())
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <main>
          {authState.data && (
            <h1 className='banner'>Hello {authState.data.name}...</h1>
          )}
          <div className='main_content'>
            <Link to='/admin/new-form' className='style_button'>
              New form
            </Link>
            <div>
              <header>
                <h1 className='heading heading-thin-2'>Forms</h1>
              </header>
              <ul className='forms_list'>
                {forms.length ? (
                  forms.map((form: Record<string, any>) => (
                    <Link to={`/admin/form/${form._id}`} key={form._id}>
                      <li className='card'>
                        <div>
                          <div className='card_title'>
                            <span>{form.name}</span>
                            <span
                              className={
                                form.active
                                  ? 'badge-green-icon'
                                  : 'badge-grey-icon'
                              }>
                              {' ● '}
                            </span>
                            <span
                              className={
                                'badge ' +
                                (form.active ? 'badge-green' : 'badge-grey')
                              }>
                              {form.active ? 'live' : 'offline'}
                            </span>
                          </div>
                          <span>
                            {form.updatedOn
                              ? `Last modified: ${parseDate(form.updatedOn)}`
                              : `Created: ${parseDate(form.createdOn)}`}
                          </span>
                        </div>
                        <span>
                          Submissions: {form.submissions.length || '--'}
                        </span>
                      </li>
                    </Link>
                  ))
                ) : (
                  <span>No documents.</span>
                )}
              </ul>
            </div>
          </div>
        </main>
      )}
    </>
  )
}
