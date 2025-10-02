import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchForms } from '../../store/form.slice'
import { Spinner } from '../../components/spinner'
import { parseDate } from '../../utils/functions'

export const UserDashboardView = () => {
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
            <div>
              <header>
                <h1 className='heading heading-thin-2'>My forms</h1>
              </header>
              <ul className='forms_list'>
                {forms.length ? (
                  forms.map((form: Record<string, any>) => (
                    <Link to={`/user/submit-form/${form._id}`} key={form._id}>
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
                                (form.active ? 'badge-green' : 'badge-orange')
                              }>
                              {form.active ? 'submitted' : 'pending'}
                            </span>
                          </div>
                          <span>{form.description}</span>
                        </div>
                        <span>
                          {form.updatedOn
                            ? `Last modified: ${parseDate(form.updatedOn)}`
                            : `Created: ${parseDate(form.createdOn)}`}
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
