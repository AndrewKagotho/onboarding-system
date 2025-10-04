import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchSubmission } from '../../store/submission.slice'
import { Spinner } from '../../components/spinner'
import { formatCalendarDate, parseDateTime } from '../../utils/functions'

export const SubmissionView = () => {
  const [submission, setSubmission] = useState<Record<string, any>>({})

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const submissionState = useAppSelector((state) => state.submission)
  const { isLoading } = submissionState

  useEffect(() => {
    if (id) getSubmission(id)
    // eslint-disable-next-line
  }, [])

  const getSubmission = async (id: any) =>
    setSubmission(await dispatch(fetchSubmission(id)).unwrap())

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='main_content'>
          <button className='nav-back' onClick={() => navigate(-1)}>
            Back
          </button>
          <header>
            <h1 className='heading heading-thin'>{submission.formId?.name}</h1>
            <p className='description'>{submission.formId?.description}</p>
          </header>
          <div className='highlight highlight-flex highlight-blue'>
            <span>
              Submitted by:{' '}
              <em className='bold'>{submission.submittedBy?.name}</em>
            </span>
            <span>{parseDateTime(submission.submittedOn)}</span>
          </div>
          <form>
            {submission.sections?.map(
              (section: Record<string, any>, index: number) => {
                return (
                  <section key={section.id}>
                    <div>
                      <h2 className='heading'>
                        {`Section ${index + 1}: ${section.name}`}
                      </h2>
                      <span className='description'>{section.description}</span>
                    </div>
                    {section.questions.map(
                      (question: Record<string, any>, index: number) => {
                        return (
                          <div className='section_question' key={index}>
                            <span>{index + 1}.</span>
                            <p>
                              <span className='bold'>{question.statement}</span>{' '}
                              {question.description && (
                                <span>({question.description})</span>
                              )}
                              {question.required && (
                                <span className='required'>*</span>
                              )}
                            </p>
                            <div />
                            {question.answer ? (
                              <span className='highlight highlight-green'>
                                {question.type === 'file' ? (
                                  <>
                                    <em className='bold'>File:</em>{' '}
                                    {question.answer.name}
                                  </>
                                ) : (
                                  <>
                                    {question.type === 'checkbox'
                                      ? question.answer.join(', ')
                                      : question.type === 'date'
                                      ? formatCalendarDate(question.answer)
                                      : question.answer}
                                  </>
                                )}
                              </span>
                            ) : (
                              <span>-</span>
                            )}
                          </div>
                        )
                      }
                    )}
                  </section>
                )
              }
            )}
          </form>
        </div>
      )}
    </>
  )
}
