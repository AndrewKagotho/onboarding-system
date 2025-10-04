import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchPublishedForms } from '../../store/form.slice'
import { Spinner } from '../../components/spinner'
import { parseDate } from '../../utils/functions'

export const UserDashboardView = () => {
  const [taggedForms, setTaggedForms] = useState<Record<string, any>[]>([])

  const authState = useAppSelector((state) => state.auth)
  const formState = useAppSelector((state) => state.form)

  const { data: authUser } = authState
  const { data: forms, isLoading } = formState

  const dispatch = useAppDispatch()

  useEffect(() => {
    const allForms: Record<string, any>[] = []

    forms.forEach((form: any) => {
      const submission = authUser.submissions.find(
        ({ formId }: { formId: string }) => formId === form._id
      )
      if (submission) {
        form = { ...form, userSubmission: submission.submissionId }
      }
      allForms.push(form)
    })

    setTaggedForms(allForms)
    // eslint-disable-next-line
  }, [forms])

  useEffect(() => {
    dispatch(fetchPublishedForms())
    // eslint-disable-next-line
  }, [])

  const handleClick = (form: Record<string, any>) =>
    form.userSubmission
      ? `/submission/${form.userSubmission}`
      : `/user/submit-form/${form._id}`

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {authUser && <h1 className='banner'>Hello {authUser.name}...</h1>}
          <div className='main_content'>
            <div>
              <header className='header-alt'>
                <h1 className='heading heading-thin-2'>My forms</h1>
              </header>
              <ul className='list'>
                {forms.length ? (
                  taggedForms.map((form: Record<string, any>) => (
                    <Link to={handleClick(form)} key={form._id}>
                      <li className='card'>
                        <div>
                          <div className='card_title'>
                            <span>
                              <em>{form.name}</em>
                            </span>
                            <span
                              className={
                                form.userSubmission
                                  ? 'badge-green-icon'
                                  : 'badge-orange-icon'
                              }>
                              {' ● '}
                            </span>
                            <span
                              className={
                                'badge ' +
                                (form.userSubmission
                                  ? 'badge-green'
                                  : 'badge-orange')
                              }>
                              {form.userSubmission ? 'submitted' : 'pending'}
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
        </>
      )}
    </>
  )
}
