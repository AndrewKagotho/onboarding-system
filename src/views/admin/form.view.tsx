import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchForm, publishForm } from '../../store/form.slice'
import { Spinner } from '../../components/spinner'
import { NewFormView } from './new-form.view'
import { parseDateTime } from '../../utils/functions'

export const FormView = () => {
  const [form, setForm] = useState<Record<string, any>>({})
  const [isPublished, setIsPublished] = useState(false)
  const [isViewingForm, setIsViewingForm] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const formState = useAppSelector((state) => state.form)
  const { isLoading } = formState

  useEffect(() => {
    if (id) getForm(id)
    // eslint-disable-next-line
  }, [])

  const getForm = async (id: any) => {
    const form = await dispatch(fetchForm(id)).unwrap()
    setForm(form)
    setIsPublished(!!form.publishedOn)
  }

  const handleCheckbox = (e: any) => {
    setForm({ ...form, publishedOn: e.target.checked ? Date.now() : null })
    setIsPublished(e.target.checked)

    if (id) {
      dispatch(publishForm({ id, isPublished: e.target.checked }))
    }
  }

  const handleSubmission = (submission: Record<string, any>) =>
    navigate(`/submission/${submission._id}`)

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {isViewingForm ? (
            <NewFormView form={form} setIsAddingForm={setIsViewingForm} />
          ) : (
            <div className='main_content'>
              <button type='button' onClick={() => navigate('/admin')}>
                Back to home
              </button>
              <div className='card card-alt'>
                <div>
                  <div className='card_title'>
                    <span className='heading-thin'>{form.name}</span>
                    <span
                      className={
                        isPublished ? 'badge-green-icon' : 'badge-grey-icon'
                      }>
                      {' ● '}
                    </span>
                    <span
                      className={
                        'badge ' + (isPublished ? 'badge-green' : 'badge-grey')
                      }>
                      {isPublished ? 'Live' : 'Offline'}
                    </span>
                  </div>
                  <span>
                    {/* {form.updatedOn
                  ? `Last modified: ${parseDateTime(form.updatedOn)}`
                  : `Created: ${parseDateTime(form.createdOn)}`} */}
                    Created: {parseDateTime(form.createdOn)}
                  </span>
                </div>
                <span>Submissions: {form.submissions?.length || '--'}</span>
              </div>
              <div className='form_view-actions'>
                <div className='checkbox_container checkbox_container-alt'>
                  <input
                    id='publish'
                    type='checkbox'
                    checked={isPublished}
                    onChange={handleCheckbox}
                  />
                  <label htmlFor='publish'>Published</label>
                  {form.publishedOn && (
                    <>
                      <div />
                      <span className='subtext'>
                        Since {parseDateTime(form.publishedOn)}
                      </span>
                    </>
                  )}
                </div>
                <span className='span-a' onClick={() => setIsViewingForm(true)}>
                  View form
                </span>
              </div>
              {form.submissions?.length ? (
                <ul className='list'>
                  {form.submissions.map((submission: any, index: number) => (
                    <li
                      className='highlight highlight-flex'
                      key={submission._id}
                      onClick={() => handleSubmission(submission)}>
                      <span>
                        <em className='bold'>Submission {index + 1}:</em>{' '}
                        {submission.submittedBy.name}
                      </span>
                      <span>{parseDateTime(submission.submittedOn)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className='highlight'>No submissions yet...</span>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}
