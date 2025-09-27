import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { DashboardView } from './views/admin/dashboard.view'
import { NewFormView } from './views/admin/new-form.view'
import { SubmitFormView } from './views/user/submit-form.view'

const router = createBrowserRouter([
  { path: '/', element: <DashboardView /> },
  {
    path: 'admin',
    children: [{ path: 'new-form', element: <NewFormView /> }]
  },
  {
    path: 'user',
    children: [{ path: 'submit-form', element: <SubmitFormView /> }]
  }
])

export const App = () => {
  return <RouterProvider router={router} />
}
