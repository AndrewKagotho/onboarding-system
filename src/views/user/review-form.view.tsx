import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { createSubmission } from '../../store/submission.slice'
import { formatCalendarDate } from '../../utils/functions'

export const ReviewFormView: React.FC<{
  submission: Record<string, any>
  form: Record<string, any>
  setIsFillingForm: React.Dispatch<React.SetStateAction<boolean>>
}> = (props) => {
  const { submission, form, setIsFillingForm } = props

  const authState = useAppSelector((state) => state.auth)
  const { data: authUser } = authState

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await dispatch(
        createSubmission({ ...submission, supa_uid: authUser.supa_uid })
      )
      navigate('/user')
    } catch (error) {
      alert(`Error:, ${error}`)
    }
  }

  return (
    <>
      <button className='nav-back' onClick={() => setIsFillingForm(true)}>
        Back to form
      </button>
      <header>
        <h1 className='heading heading-thin'>{form.name}</h1>
        <p className='description'>Review submission</p>
      </header>
      <form onSubmit={handleSubmit}>
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
        <button className='submit submit-end'>Submit</button>
      </form>
    </>
  )
}
