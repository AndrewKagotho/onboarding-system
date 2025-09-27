import { useEffect, useState } from 'react'
import { RenderFormField } from '../../utils/functions'
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
                        {/* Render input field depending on selected user type */}
                        {question.type === 'dropdown' ? (
                          RenderFormField(
                            question.type,
                            question.meta.dropdownOptions
                          )
                        ) : question.type === 'checkbox' ? (
                          RenderFormField(
                            question.type,
                            question.meta.checkboxOptions
                          )
                        ) : (
                          <>
                            {RenderFormField(question.type)}
                            {question.conditional && (
                              <>
                                <div />
                                <span className='subtext'>
                                  {`Condition: Show if value of `}{' '}
                                  <em className='bold'>{`"${
                                    findQuestion(
                                      question.conditional.question_id
                                    )?.statement
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
