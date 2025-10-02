import { useEffect } from 'react'
import { formatCalendarDate, parseDateTime } from '../../utils/functions'

export const SubmissionView: React.FC<{
  submission: Record<string, any>
  form: Record<string, any>
  setIsViewingForm: React.Dispatch<React.SetStateAction<boolean>>
}> = (props) => {
  const { submission, form, setIsViewingForm } = props

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <button className='nav-back' onClick={() => setIsViewingForm(true)}>
        Back to submissions
      </button>
      <header>
        <h1 className='heading heading-thin'>{form.name}</h1>
        <p className='description'>{form.description}</p>
      </header>
      <div className='subtext subtext-flex subtext-blue'>
        <span>
          Submission by: <em className='bold'>{submission.submittedBy.name}</em>
        </span>
        <span>{parseDateTime(submission.submittedOn)}</span>
      </div>
      <form>
        {submission.sections.map(
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
                          <span className='subtext subtext-green'>
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
    </>
  )
}
