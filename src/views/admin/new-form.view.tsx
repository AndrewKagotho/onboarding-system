import React, { useState } from 'react'
import { TextInput } from '../../components/form/text.input'
import { NumberInput } from '../../components/form/number.input'
import { DateInput } from '../../components/form/date.input'
import { DropdownInput } from '../../components/form/dropdown.input'
import { CheckboxInput } from '../../components/form/checkbox.input'
import { FileInput } from '../../components/form/file.input'
import { QUESTION_TYPES } from '../../utils/constants'

export const NewFormView = () => {
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [editingSections, setEditingSections] = useState<string[]>([])
  const [form, setForm] = useState<Record<string, any>>({
    name: '',
    description: '',
    sections: []
  })
  const newSection: Record<string, string> = {}
  const [newQuestion, setNewQuestion] = useState<Record<string, any>>({
    type: 'text'
  })
  const [dropdownValue, setDropdownValue] = useState('')
  const [checkboxValue, setCheckboxValue] = useState('')

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

  const handleNewQuestionDropdownEdit = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.value) {
      newQuestion.meta.dropdownOptions[index] = e.target.value
    }
  }

  const handleNewQuestionCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setCheckboxValue(e.target.value)

  const handleNewQuestionCheckboxEdit = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.value) {
      newQuestion.meta.checkboxOptions[index] = e.target.value
    }
  }

  const handleNewQuestionDropdown = (
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

  const handleNewQuestionCheckbox = (
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

  const handleAddQuestion = (sectionId: string) => {
    setNewQuestion({ type: 'text', id: `QID_${Date.now()}` })
    setEditingSections((sections) => {
      return [...sections, sectionId]
    })
  }

  const handleCancelQuestion = (sectionId: string) =>
    setEditingSections((sections) => {
      return sections.filter((id) => id !== sectionId)
    })

  const saveSection = () => {
    setIsAddingSection(false)
    newSection.id = `SID_${Date.now()}`

    setForm((form) => ({
      ...form,
      sections: [...form.sections, newSection]
    }))
  }

  const saveQuestion = (sectionId: string) => {
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
    handleCancelQuestion(sectionId)
  }

  return (
    <main>
      <div className='main_content'>
        <h1>New Form</h1>
        <p>(Add sections and questions below)</p>
        {form.sections.map((section: Record<string, any>, index: number) => {
          return (
            <section key={section.id}>
              <div>
                <h2>{`Section ${index + 1}: ${section.name}`}</h2>
                <span>{section.description}</span>
              </div>
              {section.questions &&
                section.questions.map(
                  (question: Record<string, any>, index: number) => {
                    return (
                      <form className='section_question' key={index}>
                        <span>{index + 1}.</span>
                        <p>
                          {question.statement}{' '}
                          {question.description && (
                            <span>({question.description})</span>
                          )}
                        </p>
                        <div />
                        {question.type === 'text' ? (
                          <TextInput />
                        ) : (
                          <>
                            {question.type === 'number' ? (
                              <NumberInput />
                            ) : (
                              <>
                                {question.type === 'date' ? (
                                  <DateInput />
                                ) : (
                                  <>
                                    {question.type === 'dropdown' ? (
                                      <DropdownInput
                                        data={question.meta.dropdownOptions}
                                      />
                                    ) : (
                                      <>
                                        {question.type === 'checkbox' ? (
                                          <CheckboxInput
                                            data={question.meta.checkboxOptions}
                                          />
                                        ) : (
                                          <FileInput />
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </form>
                    )
                  }
                )}
              {editingSections.includes(section.id) ? (
                <div className='section-new_item'>
                  <h2>New question</h2>
                  <form>
                    <label htmlFor='statement'>Question:</label>
                    <input
                      id='statement'
                      placeholder='Enter question...'
                      onChange={handleNewQuestionChange}
                    />
                    <label htmlFor='description'>Description:</label>
                    <input
                      id='description'
                      placeholder='Provide description (Optional)...'
                      onChange={handleNewQuestionChange}
                    />
                    <label htmlFor='type'>Field type:</label>
                    <select
                      id='type'
                      value={newQuestion.type}
                      onChange={handleNewQuestionChange}>
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
                            onBlur={handleNewQuestionDropdown}
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
                            onBlur={handleNewQuestionCheckbox}
                          />
                        </div>
                      </div>
                    )}
                    <label htmlFor='rules'>Rules:</label>
                    <input id='rules' onChange={handleNewQuestionChange} />
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
                  </form>
                </div>
              ) : (
                <button onClick={() => handleAddQuestion(section.id)}>
                  New question
                </button>
              )}
            </section>
          )
        })}
        {isAddingSection ? (
          <section>
            <div className='section-new_item'>
              <h2>New section</h2>
              <form>
                <label htmlFor='name'>Name:</label>
                <input
                  id='name'
                  placeholder='Enter section name...'
                  onChange={handleNewSectionChange}
                />
                <label htmlFor='description'>Description:</label>
                <input
                  id='description'
                  placeholder='Provide description (Optional)...'
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
              </form>
            </div>
          </section>
        ) : (
          <button onClick={() => setIsAddingSection(true)}>New section</button>
        )}
      </div>
    </main>
  )
}
