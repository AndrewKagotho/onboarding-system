import React, { useState } from 'react'

export const NewFormView = () => {
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [editingSections, setEditingSections] = useState<string[]>([])
  const [form, setForm] = useState<Record<string, any>>({
    name: '',
    description: '',
    sections: []
  })

  const newSection: Record<string, string> = {}
  const newQuestion: Record<string, string> = {}

  const handleNewSectionChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    newSection[e.target.id] = e.target.value
  }

  const handleNewQuestionChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    newQuestion[e.target.id] = e.target.value
  }

  const handleAddQuestion = (sectionName: string) => {
    setEditingSections((sections) => {
      const newSections = [...sections]
      newSections.push(sectionName)
      return newSections
    })
  }

  const handleDeleteQuestion = (sectionName: string) => {
    setEditingSections((sections) => {
      return sections.filter((section) => section !== sectionName)
    })
  }

  const saveSection = () => {
    setIsAddingSection(false)
    setForm((form) => ({
      ...form,
      sections: [...form.sections, newSection]
    }))
  }

  const saveQuestion = (sectionName: string) => {
    setForm((form) => {
      const sectionIndex = form.sections.findIndex(
        (section: Record<string, string>) => section.name === sectionName
      )
      if (form.sections[sectionIndex].questions) {
        form.sections[sectionIndex].questions = [
          ...form.sections[sectionIndex].questions,
          newQuestion
        ]
      } else {
        form.sections[sectionIndex].questions = [newQuestion]
      }
      return form
    })
    handleDeleteQuestion(sectionName)
  }

  return (
    <main>
      <div className='main_content'>
        <h1>New Form</h1>
        <p>(Add sections and questions below)</p>
        {/* Existing */}
        {form.sections.map((section: Record<string, any>, index: number) => {
          return (
            <section key={section.name}>
              <div>
                <h2>{`Section ${index + 1}: ${section.name}`}</h2>
                <span>{section.description}</span>
              </div>
              {/* New */}
              {section.questions &&
                section.questions.map(
                  (question: Record<string, string>, index: number) => {
                    return (
                      <form className='section_question' key={index}>
                        {/* question.type | question.rules */}
                        <p>
                          {question.statement}{' '}
                          {question.description && (
                            <span>({question.description})</span>
                          )}
                        </p>
                        <input type='text' placeholder='Sample input here...' />
                      </form>
                    )
                  }
                )}
              {editingSections.includes(section.name) ? (
                <div className='section-new_item'>
                  <h2>New question</h2>
                  <form>
                    <label htmlFor='statement'>Question:</label>
                    <input
                      id='statement'
                      type='text'
                      onChange={handleNewQuestionChanges}
                    />
                    <label htmlFor='description'>Description:</label>
                    <input
                      id='description'
                      type='text'
                      onChange={handleNewQuestionChanges}
                    />
                    <label htmlFor='type'>Type:</label>
                    <input
                      id='type'
                      type='text'
                      onChange={handleNewQuestionChanges}
                    />
                    <label htmlFor='rules'>Rules:</label>
                    <input
                      id='rules'
                      type='text'
                      onChange={handleNewQuestionChanges}
                    />
                    <div className='form_actions'>
                      {/* Type 'button' instead of 'submit' to proceed with fn call after form is unmounted without error */}
                      <button
                        type='button'
                        onClick={() => handleDeleteQuestion(section.name)}>
                        Cancel
                      </button>
                      <button
                        type='button'
                        onClick={() => saveQuestion(section.name)}>
                        Confirm
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button onClick={() => handleAddQuestion(section.name)}>
                  New question
                </button>
              )}
            </section>
          )
        })}
        {/* New */}
        {isAddingSection ? (
          <section>
            <div className='section-new_item'>
              <h2>New section</h2>
              <form>
                <label htmlFor='name'>Name:</label>
                <input
                  id='name'
                  type='text'
                  onChange={handleNewSectionChanges}
                />
                <label htmlFor='description'>Description:</label>
                <input
                  id='description'
                  type='text'
                  onChange={handleNewSectionChanges}
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
