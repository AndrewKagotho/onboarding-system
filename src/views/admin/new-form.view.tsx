import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../hooks'
import { createForm } from '../../store/form.slice'
import { QUESTION_TYPES } from '../../utils/constants'

export const NewFormView: React.FC<{
  form?: Record<string, any>
  setIsAddingForm: React.Dispatch<React.SetStateAction<boolean>>
}> = (props) => {
  const { form: existingForm, setIsAddingForm } = props

  const dispatch = useAppDispatch()

  const [isAddingSection, setIsAddingSection] = useState(false)
  const [editingSections, setEditingSections] = useState<string[]>([])
  const [form, setForm] = useState<Record<string, any>>(
    () =>
      existingForm ?? {
        name: 'Untitled form',
        description: 'Add description...',
        sections: []
      }
  )
  const [isEditingHeader, setIsEditingHeader] = useState({
    name: false,
    description: false
  })
  const newSection: Record<string, string> = {}
  const [newQuestion, setNewQuestion] = useState<Record<string, any>>({})
  const [allQuestions, setAllQuestions] = useState<Record<string, any>[]>([])
  const [dropdownValue, setDropdownValue] = useState('')
  const [checkboxValue, setCheckboxValue] = useState('')

  useEffect(() => {
    const allQuestions = form.sections?.flatMap(
      (section: Record<string, any>) => section.questions
    )
    setAllQuestions(allQuestions)
  }, [form])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setForm({ ...form, [e.target.id]: e.target.value })
    }
  }

  const handleFormCheckbox = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.id]: e.target.checked })

  const handleNewSectionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    (newSection[e.target.id] = e.target.value)

  const handleNewQuestionChange = (e: any) =>
    setNewQuestion((question) => ({
      ...question,
      [e.target.id]: e.target.value
    }))

  const handleNewQuestionDropdownChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setDropdownValue(e.target.value)

  const handleNewQuestionCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setCheckboxValue(e.target.value)

  const handleNewQuestionDropdownEdit = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.value) {
      newQuestion.meta.dropdownOptions[index] = e.target.value
    }
  }

  const handleNewQuestionCheckboxEdit = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.value) {
      newQuestion.meta.checkboxOptions[index] = e.target.value
    }
  }

  const handleNewQuestionDropdownOptions = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value) {
      setNewQuestion({
        ...newQuestion,
        meta: {
          dropdownOptions: newQuestion.meta?.dropdownOptions
            ? [...newQuestion.meta.dropdownOptions, dropdownValue]
            : [dropdownValue]
        }
      })
      setDropdownValue('')
    }
  }

  const handleNewQuestionCheckboxOptions = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value) {
      setNewQuestion({
        ...newQuestion,
        meta: {
          checkboxOptions: newQuestion.meta?.checkboxOptions
            ? [...newQuestion.meta.checkboxOptions, checkboxValue]
            : [checkboxValue]
        }
      })
      setCheckboxValue('')
    }
  }

  const handleNewQuestionCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewQuestion({
      ...newQuestion,
      [e.target.id]: e.target.checked
    })
  }

  const handleNewQuestionConditionSelect = (e: any) => {
    if (e.target.value) {
      setNewQuestion({
        ...newQuestion,
        conditional: {
          ...newQuestion.conditional,
          [e.target.id]: e.target.value
        }
      })
    }
  }

  const handleAddQuestion = (sectionId: string) => {
    setNewQuestion({ id: `QID_${Date.now()}`, type: 'text', required: false })
    setEditingSections((sections) => {
      return [...sections, sectionId]
    })
  }

  const handleCancelQuestion = (sectionId: string) =>
    setEditingSections((sections) => {
      return sections.filter((id) => id !== sectionId)
    })

  const saveSection = () => {
    if (newSection.name) {
      setIsAddingSection(false)
      newSection.id = `SID_${Date.now()}`

      setForm((form) => ({
        ...form,
        sections: [...form.sections, newSection]
      }))
    } else {
      alert('Missing section name...')
    }
  }

  const saveQuestion = (sectionId: string) => {
    if (newQuestion.statement) {
      if (
        newQuestion.type === 'dropdown' &&
        !newQuestion.meta?.dropdownOptions
      ) {
        alert('Dropdown options missing!')
        return
      }

      if (
        newQuestion.type === 'checkbox' &&
        !newQuestion.meta?.checkboxOptions
      ) {
        alert('Checkbox options missing!')
        return
      }

      setForm((form) => {
        const sectionIndex = form.sections.findIndex(
          (section: Record<string, string>) => section.id === sectionId
        )
        form.sections[sectionIndex].questions = form.sections[sectionIndex]
          .questions
          ? [...form.sections[sectionIndex].questions, newQuestion]
          : [newQuestion]

        return form
      })

      setAllQuestions([...allQuestions, newQuestion])
      handleCancelQuestion(sectionId)
    } else {
      alert('Missing question / statement...')
    }
  }

  const findQuestion = (questionId: string) =>
    allQuestions.find(({ id }) => id === questionId)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await dispatch(createForm(form))
      setIsAddingForm(false)
    } catch (error) {
      alert(`Error:, ${error}`)
    }
  }

  return (
    <div className='main_content'>
      <button className='nav-back' onClick={() => setIsAddingForm(false)}>
        Back
      </button>
      <header>
        {!existingForm && isEditingHeader.name ? (
          <input
            id='name'
            defaultValue={form.name}
            onChange={handleFormChange}
            onBlur={() =>
              setIsEditingHeader({ ...isEditingHeader, name: false })
            }
            onFocus={(e) => e.target.select()}
            placeholder='Enter name...'
            className='header_input'
            autoFocus
          />
        ) : (
          <h1
            className='heading heading-thin'
            onClick={() =>
              setIsEditingHeader({ ...isEditingHeader, name: true })
            }>
            {form.name}
          </h1>
        )}
        {!existingForm && isEditingHeader.description ? (
          <input
            id='description'
            defaultValue={form.description}
            onChange={handleFormChange}
            onBlur={() =>
              setIsEditingHeader({ ...isEditingHeader, description: false })
            }
            onFocus={(e) => e.target.select()}
            placeholder='Enter description...'
            autoFocus
          />
        ) : (
          <p
            className='description'
            onClick={() =>
              setIsEditingHeader({ ...isEditingHeader, description: true })
            }>
            {form.description}
          </p>
        )}
      </header>
      <form onSubmit={handleSubmit}>
        {form.sections.map((section: Record<string, any>, index: number) => {
          return (
            <section key={section.id}>
              <div>
                <h2 className='heading'>
                  {`Section ${index + 1}: ${section.name}`}
                </h2>
                {section.description && (
                  <span className='description'>{section.description}</span>
                )}
              </div>
              {section.questions &&
                section.questions.map(
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
                            <span className='highlight'>
                              {`Condition: Show if value of `}{' '}
                              <em className='bold'>{`"${
                                findQuestion(question.conditional.questionId)
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
                      </div>
                    )
                  }
                )}
              {editingSections.includes(section.id) ? (
                <div className='section-new_item'>
                  <h3 className='heading-thin-2'>New question</h3>
                  <div>
                    <label htmlFor='statement'>Question:</label>
                    <input
                      id='statement'
                      placeholder='Enter question / statement...'
                      onChange={handleNewQuestionChange}
                    />
                    <label htmlFor='description'>Description:</label>
                    <input
                      id='description'
                      placeholder='Brief description (optional)...'
                      onChange={handleNewQuestionChange}
                    />
                    <label htmlFor='type'>Field type:</label>
                    <select
                      id='type'
                      value={newQuestion.type}
                      onChange={handleNewQuestionChange}
                      className='capitalize'>
                      {QUESTION_TYPES.map((type, index) => (
                        <option value={type} key={index}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {newQuestion.type === 'dropdown' && (
                      <div className='section-new_item-list'>
                        <h3>Provide items in list:</h3>
                        {newQuestion.meta?.dropdownOptions?.map(
                          (_option: string, index: number) => (
                            <div key={index}>
                              <label htmlFor={`dropdown_option_${index}`}>
                                {index + 1}.
                              </label>
                              <input
                                id={`dropdown_option_${index}`}
                                defaultValue={
                                  newQuestion.meta.dropdownOptions[index]
                                }
                                onChange={(e) =>
                                  handleNewQuestionDropdownEdit(e, index)
                                }
                                placeholder='Add option...'
                              />
                            </div>
                          )
                        )}
                        <div>
                          <label htmlFor='option'>
                            {newQuestion.meta?.dropdownOptions
                              ? newQuestion.meta.dropdownOptions.length + 1
                              : 1}
                            .
                          </label>
                          <input
                            id='option'
                            value={dropdownValue}
                            placeholder='Add option...'
                            onChange={handleNewQuestionDropdownChange}
                            onBlur={handleNewQuestionDropdownOptions}
                          />
                        </div>
                      </div>
                    )}
                    {newQuestion.type === 'checkbox' && (
                      <div className='section-new_item-list'>
                        <h3>Provide options:</h3>
                        {newQuestion.meta?.checkboxOptions?.map(
                          (_option: string, index: number) => (
                            <div key={index}>
                              <label htmlFor={`checkbox_option_${index}`}>
                                {index + 1}.
                              </label>
                              <input
                                id={`checkbox_option_${index}`}
                                defaultValue={
                                  newQuestion.meta.checkboxOptions[index]
                                }
                                onChange={(e) =>
                                  handleNewQuestionCheckboxEdit(e, index)
                                }
                                placeholder='Add option...'
                              />
                            </div>
                          )
                        )}
                        <div>
                          <label htmlFor='option'>
                            {newQuestion.meta?.checkboxOptions
                              ? newQuestion.meta.checkboxOptions.length + 1
                              : 1}
                            .
                          </label>
                          <input
                            id='option'
                            value={checkboxValue}
                            placeholder='Add option...'
                            onChange={handleNewQuestionCheckboxChange}
                            onBlur={handleNewQuestionCheckboxOptions}
                          />
                        </div>
                      </div>
                    )}
                    <span>Rules:</span>
                    <div className='checkbox_container'>
                      <div>
                        <input
                          id='required'
                          type='checkbox'
                          onChange={handleNewQuestionCheckbox}
                        />
                        <label htmlFor='required'>Required</label>
                      </div>
                    </div>
                    {!!allQuestions.filter(
                      (question) => question.type === 'number'
                    ).length && (
                      <div className='section-new_rule-list'>
                        <h3>Conditions:</h3>
                        <div>
                          <span>
                            (Add rule specifying when question should be
                            displayed i.e "Show if Question 1 &gt; 500".
                            Optional)
                          </span>
                          <label htmlFor='questionId'>Show if question:</label>
                          <select
                            id='questionId'
                            onChange={handleNewQuestionConditionSelect}>
                            <option value='' hidden>
                              Select from list...
                            </option>
                            {allQuestions
                              .filter(({ type }) => type)
                              .map((question, index) => (
                                <option
                                  value={question.id}
                                  key={index}
                                  disabled={question.type !== 'number'}>
                                  {question.statement}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor='condition'>Condition:</label>
                          <select
                            id='condition'
                            onChange={handleNewQuestionConditionSelect}>
                            <option value='' hidden>
                              Select from list...
                            </option>
                            <option value='<'>is less than</option>
                            <option value='>'>is greater than</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor='value'>Value:</label>
                          <input
                            id='value'
                            type='number'
                            onChange={handleNewQuestionConditionSelect}
                            placeholder='Enter number...'
                          />
                        </div>
                      </div>
                    )}
                    <div className='form_actions'>
                      <button
                        type='button'
                        onClick={() => handleCancelQuestion(section.id)}>
                        Cancel
                      </button>
                      <button
                        type='button'
                        onClick={() => saveQuestion(section.id)}>
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {!existingForm && (
                    <button onClick={() => handleAddQuestion(section.id)}>
                      New question
                    </button>
                  )}
                </>
              )}
            </section>
          )
        })}
        {isAddingSection ? (
          <section>
            <div className='section-new_item'>
              <h3 className='heading-thin-2'>New section</h3>
              <div>
                <label htmlFor='name'>Name:</label>
                <input
                  id='name'
                  placeholder='Enter section name...'
                  onChange={handleNewSectionChange}
                />
                <label htmlFor='description'>Description:</label>
                <input
                  id='description'
                  placeholder='Brief description (optional)...'
                  onChange={handleNewSectionChange}
                />
                <div className='form_actions'>
                  <button
                    type='button'
                    onClick={() => setIsAddingSection(false)}>
                    Cancel
                  </button>
                  <button type='button' onClick={saveSection}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {!existingForm && (
              <button onClick={() => setIsAddingSection(true)}>
                New section
              </button>
            )}
          </>
        )}
        {!existingForm && (
          <>
            <div>
              <div className='checkbox_container'>
                <div>
                  <input
                    id='publish'
                    type='checkbox'
                    onChange={handleFormCheckbox}
                  />
                  <label htmlFor='publish'>Publish</label>
                </div>
              </div>
            </div>
            <button className='submit' disabled={!allQuestions.length}>
              Create form
            </button>
          </>
        )}
      </form>
    </div>
  )
}
