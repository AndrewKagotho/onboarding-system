import { useEffect, useState } from 'react'
import form from '../../data/form.json'

export const SubmitFormView = () => {
  const [allQuestions, setAllQuestions] = useState<Record<string, any>[]>([])

  useEffect(() => {
    const allQuestions = form.sections.flatMap(
      (section: Record<string, any>) => section.questions
    )
    setAllQuestions(allQuestions)
  }, [])

  const findQuestion = (questionId: string) =>
    allQuestions.find(({ id }) => id === questionId)

  return (
    <main>
      <div className='main_content'>
        <header>
          <h1 className='heading'>{form.name}</h1>
          <p className='description'>{form.description}</p>
        </header>
        {form.sections.map((section: Record<string, any>, index: number) => {
          return (
            <section key={section.id}>
              <div>
                <h2 className='heading'>
                  {`Section ${index + 1}: ${section.name}`}
                </h2>
                <span className='description'>{section.description}</span>
              </div>
              {section.questions &&
                section.questions.map(
                  (question: Record<string, any>, index: number) => {
                    return (
                      <form className='section_question' key={index}>
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
                        {/* Render input field depending on question type */}
                        {question.type === 'text' ? (
                          <input placeholder='Sample answer here...' />
                        ) : question.type === 'number' ? (
                          <input type='number' placeholder='Enter number...' />
                        ) : question.type === 'date' ? (
                          <input type='date' />
                        ) : question.type === 'dropdown' ? (
                          <select>
                            <option value='' hidden>
                              Select from list...
                            </option>
                            {question.meta.dropdownOptions.map(
                              (type: string, index: number) => (
                                <option value={type} key={index}>
                                  {type}
                                </option>
                              )
                            )}
                          </select>
                        ) : question.type === 'checkbox' ? (
                          <div className='checkbox_container'>
                            {question.meta.checkboxOptions.map(
                              (value: string, index: number) => (
                                <div key={index}>
                                  <input id={value} type='checkbox' />
                                  <label htmlFor={value}>{value}</label>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          question.type === 'file' && <input type='file' />
                        )}
                        {question.conditional && (
                          <>
                            <div />
                            <span className='subtext'>
                              {`Condition: Show if value of `}{' '}
                              <em className='bold'>{`"${
                                findQuestion(question.conditional.question_id)
                                  ?.statement
                              }"`}</em>
                              {' is '}
                              {`${
                                question.conditional.condition === '>'
                                  ? 'greater'
                                  : 'less'
                              } than ${question.conditional.value}`}
                            </span>
                          </>
                        )}
                      </form>
                    )
                  }
                )}
            </section>
          )
        })}
      </div>
    </main>
  )
}
