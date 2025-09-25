import { Link } from 'react-router-dom'
import formData from '../../data/forms.json'

export const DashboardView = () => {
  const parseDate = (date: number) => {
    const dateObj = new Date(date)
    return `${dateObj.getUTCDate()}/${dateObj.getUTCMonth()}/${dateObj.getUTCFullYear()}`
  }
  return (
    <main>
      <div className='main_content'>
        <h1>Forms</h1>
        <Link to='/admin/new-form' className='style_button'>
          New form
        </Link>
        <ul className='forms_list'>
          <li>
            <h2>Name</h2>
            <h2>Created</h2>
            <h2>Updated</h2>
            <h2>Active</h2>
          </li>
          {formData.map((form) => {
            return (
              <li key={form.id}>
                <div className='forms_list_name'>
                  <a href='#'>{form.name}</a>
                  <span>
                    <em>{form.submissions.length} submissions</em>
                  </span>
                </div>
                <span>{parseDate(form.createdOn)}</span>
                <span>{parseDate(form.updatedOn)}</span>
                <span>{form.active ? parseDate(form.active) : '-'}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}
