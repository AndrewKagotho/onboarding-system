import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchForms } from '../../store/form.slice'

export const DashboardView = () => {
  const formState = useAppSelector((state) => state.form)
  const dispatch = useAppDispatch()

  const { data: forms, isLoading } = formState

  useEffect(() => {
    dispatch(fetchForms())
  }, [])

  const parseDate = (date: number) => {
    const dateObj = new Date(date)
    return `${dateObj.getUTCDate()}/${dateObj.getUTCMonth()}/${dateObj.getUTCFullYear()}`
  }
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
                <li key={form._id}>
                  <div>
                    <a href='#'>
                      <h3>
                        <span>{form.name}</span>{' '}
                        <span
                          className={
                            'badge ' +
                            (form.active ? 'badge-green' : 'badge-grey')
                          }>
                          {form.active ? 'Live' : 'Offline'}
                        </span>
                      </h3>
                    </a>
                    <span>{form.description}</span>
                  </div>
                  <div>
                    {form.submissions ? (
                      <span>Submissions: {form.submissions.length}</span>
                    ) : (
                      '-'
                    )}
                    <span>
                      {form.updatedOn
                        ? `Last modified: ${parseDate(form.updatedOn)}`
                        : `Created: ${parseDate(form.createdOn)}`}
                    </span>
                  </div>
                </li>
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
