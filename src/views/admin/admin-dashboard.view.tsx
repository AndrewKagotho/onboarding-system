import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchForms } from '../../store/form.slice'
import { parseDate } from '../../utils/functions'

export const AdminDashboardView = () => {
  const formState = useAppSelector((state) => state.form)
  const dispatch = useAppDispatch()

  const { data: forms, isLoading } = formState

  useEffect(() => {
    dispatch(fetchForms())
    // eslint-disable-next-line
  }, [])

  return (
    <main>
      <div className='main_content'>
        <header>
          <h1 className='heading'>My forms</h1>
        </header>
        <Link to='/admin/new-form' className='style_button'>
          New form
        </Link>
        {isLoading ? (
          <span>Loading...</span>
        ) : (
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
                            form.active ? 'badge-green-icon' : 'badge-grey-icon'
                          }>
                          {' ● '}
                        </span>
                        <span
                          className={
                            'badge ' +
                            (form.active ? 'badge-green' : 'badge-grey')
                          }>
                          {form.active ? 'Live' : 'Offline'}
                        </span>
                      </div>
                      <span>
                        {form.updatedOn
                          ? `Last modified: ${parseDate(form.updatedOn)}`
                          : `Created: ${parseDate(form.createdOn)}`}
                      </span>
                    </div>
                    <span>Submissions: {form.submissions.length || 'n/a'}</span>
                  </li>
                </Link>
              ))
            ) : (
              <span>No documents.</span>
            )}
          </ul>
        )}
      </div>
    </main>
  )
}
