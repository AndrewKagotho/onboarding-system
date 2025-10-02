import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchForm } from '../../store/form.slice'
import { Spinner } from '../../components/spinner'
import { SubmissionView } from './submission.view'
import { parseDateTime } from '../../utils/functions'

export const FormView = () => {
  const [form, setForm] = useState<Record<string, any>>({})
  const [isViewingForm, setIsViewingForm] = useState(true)
  const [submission, setSubmission] = useState<Record<string, any>>({})

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const formState = useAppSelector((state) => state.form)
  const { isLoading } = formState

  useEffect(() => {
    if (id) {
      getForm(id)
    }
    // eslint-disable-next-line
  }, [])

  const getForm = async (id: any) => {
    setForm(await dispatch(fetchForm(id)).unwrap())
  }

  const handleSubmission = (submission: Record<string, any>) => {
    setIsViewingForm(false)
    setSubmission(submission)
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <main>
          <div className='main_content'>
            {isViewingForm ? (
              <>
                <button type='button' onClick={() => navigate('/admin')}>
                  Back to forms
                </button>
                <div className='card'>
                  <div>
                    <div className='card_title'>
                      <span className='heading-thin'>{form.name}</span>
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
                        ? `Last modified: ${parseDateTime(form.updatedOn)}`
                        : `Created: ${parseDateTime(form.createdOn)}`}
                    </span>
                  </div>
                  <span>Submissions: {form.submissions?.length || 'n/a'}</span>
                </div>
                {form.submissions?.length ? (
                  <ul className='list'>
                    {form.submissions.map((submission: any, index: number) => (
                      <li
                        className='subtext'
                        key={submission._id}
                        onClick={() => handleSubmission(submission)}>
                        <span>
                          Submission by{' '}
                          <em className='bold'>
                            {submission.submittedBy.name}
                          </em>
                        </span>
                        <span>{parseDateTime(submission.submittedOn)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className='subtext'>No submissions yet...</span>
                )}
              </>
            ) : (
              <>
                {form && (
                  <SubmissionView
                    submission={submission}
                    form={form}
                    setIsViewingForm={setIsViewingForm}
                  />
                )}
              </>
            )}
          </div>
        </main>
      )}
    </>
  )
}
