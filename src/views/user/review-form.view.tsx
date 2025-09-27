export const ReviewFormView: React.FC<{
  submission: Record<string, any>
  form: Record<string, any>
}> = (props) => {
  const { submission, form } = props

  return (
    <>
      <header>
        <h1 className='heading'>{form.name}</h1>
        <p className='description'>Review submission</p>
      </header>
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
                        <span>{question.answer}</span>
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
      <button className='submit'>Submit</button>
    </>
  )
}
