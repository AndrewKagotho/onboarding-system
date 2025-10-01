import { useEffect } from 'react'

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
      <header>
        <h1 className='heading'>{form.name}</h1>
        <p className='description'>{form.description}</p>
      </header>
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
                          <>
                            {question.type === 'checkbox' ? (
                              <>
                                {question.answer.length ? (
                                  <span className='highlight'>
                                    {question.answer.join(', ')}
                                  </span>
                                ) : (
                                  <span>-</span>
                                )}
                              </>
                            ) : question.type === 'file' ? (
                              <span className='highlight'>
                                <em className='bold'>File:</em>{' '}
                                {question.answer.name}
                              </span>
                            ) : (
                              <span className='highlight'>
                                {question.answer}
                              </span>
                            )}
                          </>
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
        <button
          type='button'
          className='submit'
          onClick={() => setIsViewingForm(true)}>
          Back to submissions
        </button>
      </form>
    </>
  )
}
