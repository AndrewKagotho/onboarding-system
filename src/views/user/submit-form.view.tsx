import { useEffect, useState } from 'react'
import { ReviewFormView } from './review-form.view'
import form from '../../data/form.json'

export const SubmitFormView = () => {
  const [submission, setSubmission] = useState<Record<string, any>>({
    formId: form.id,
    sections: form.sections,
    read: false
  })
  const [answer, setAnswer] = useState({})
  const [allQuestions, setAllQuestions] = useState<Record<string, any>[]>([])
  const [allCheckboxes] = useState(new Map())
  const [isFillingForm, setIsFillingForm] = useState(true)

  useEffect(() => {
    const allQuestions = form.sections.flatMap(
      (section: Record<string, any>) => section.questions
    )
    setAllQuestions(allQuestions)
  }, [])

  const handleChange = (e: any) => setAnswer(e.target.value)

  const manageQuestionCheckboxSet = (set: any, value: string) => {
    set.has(value) ? set.delete(value) : set.add(value)
    return set
  }

  const handleCheckboxChange = (e: any, questionId: string) => {
    const questionCheckboxes = allCheckboxes.get(questionId)

    questionCheckboxes
      ? allCheckboxes.set(
          questionId,
          manageQuestionCheckboxSet(questionCheckboxes, e.target.id)
        )
      : allCheckboxes.set(questionId, new Set().add(e.target.id))
  }

  const handleFileChange = (e: any) => setAnswer(e.target.files[0])

  const saveAnswer = (
    sectionId: Record<string, any>,
    question: Record<string, any>
  ) => {
    const allSections = [...submission.sections]
    const sectionIndex = allSections.findIndex(
      (section: Record<string, any>) => section.id === sectionId
    )
    const questionIndex = allSections[sectionIndex].questions.findIndex(
      ({ id }: Record<string, any>) => id === question.id
    )

    if (question.type === 'checkbox') {
      allSections[sectionIndex].questions[questionIndex].answer = Array.from(
        allCheckboxes.get(question.id)
      )
    } else {
      allSections[sectionIndex].questions[questionIndex].answer = answer
    }

    setSubmission({
      ...submission,
      sections: allSections
    })
  }

  const findQuestion = (questionId: string) =>
    allQuestions.find(({ id }) => id === questionId)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsFillingForm(false)
  }

  return (
    <main>
      <div className='main_content'>
        {isFillingForm ? (
          <>
            <header>
              <h1 className='heading'>{form.name}</h1>
              <p className='description'>{form.description}</p>
            </header>
            <form onSubmit={handleSubmit}>
              {form.sections.map(
                (section: Record<string, any>, index: number) => {
                  return (
                    <section key={section.id}>
                      <div>
                        <h2 className='heading'>
                          {`Section ${index + 1}: ${section.name}`}
                        </h2>
                        <span className='description'>
                          {section.description}
                        </span>
                      </div>
                      {section.questions.map(
                        (question: Record<string, any>, index: number) => {
                          return (
                            <div className='section_question' key={index}>
                              <span>{index + 1}.</span>
                              <p>
                                <span className='bold'>
                                  {question.statement}
                                </span>{' '}
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
                                <input
                                  onChange={handleChange}
                                  onBlur={() =>
                                    saveAnswer(section.id, question)
                                  }
                                  required={question.required}
                                  placeholder='Enter answer here...'
                                />
                              ) : question.type === 'number' ? (
                                <input
                                  type='number'
                                  onChange={handleChange}
                                  onBlur={() =>
                                    saveAnswer(section.id, question)
                                  }
                                  required={question.required}
                                  placeholder='Enter number...'
                                />
                              ) : question.type === 'date' ? (
                                <input
                                  type='date'
                                  onChange={handleChange}
                                  onBlur={() =>
                                    saveAnswer(section.id, question)
                                  }
                                  required={question.required}
                                />
                              ) : question.type === 'dropdown' ? (
                                <select
                                  onChange={handleChange}
                                  onBlur={() =>
                                    saveAnswer(section.id, question)
                                  }
                                  required={question.required}>
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
                                        <input
                                          id={value}
                                          type='checkbox'
                                          onChange={(e) =>
                                            handleCheckboxChange(e, question.id)
                                          }
                                          onBlur={() =>
                                            saveAnswer(section.id, question)
                                          }
                                        />
                                        <label htmlFor={value}>{value}</label>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                question.type === 'file' && (
                                  <input
                                    type='file'
                                    onChange={handleFileChange}
                                    onBlur={() =>
                                      saveAnswer(section.id, question)
                                    }
                                    required={question.required}
                                  />
                                )
                              )}
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
                            </div>
                          )
                        }
                      )}
                    </section>
                  )
                }
              )}
              <button className='submit'>Review</button>
            </form>
          </>
        ) : (
          <ReviewFormView submission={submission} form={form} />
        )}
      </div>
    </main>
  )
}
