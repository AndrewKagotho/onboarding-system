import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LoginView } from './views/login.view'
import { AdminDashboardView } from './views/admin/admin-dashboard.view'
import { FormView } from './views/admin/form.view'
import { NewFormView } from './views/admin/new-form.view'
import { UserDashboardView } from './views/user/user-dashboard'
import { SubmitFormView } from './views/user/submit-form.view'

const router = createBrowserRouter([
  {
    path: 'log-in',
    element: <LoginView />
  },
  {
    path: 'admin',
    children: [
      { index: true, element: <AdminDashboardView /> },
      { path: 'form/:id', element: <FormView /> },
      { path: 'new-form', element: <NewFormView /> }
    ]
  },
  {
    path: 'user',
    children: [
      { index: true, element: <UserDashboardView /> },
      { path: 'submit-form/:id', element: <SubmitFormView /> }
    ]
  }
])

export const App = () => {
  return <RouterProvider router={router} />
}
