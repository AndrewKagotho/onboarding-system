import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { DashboardView } from './views/admin/dashboard.view'
import { NewFormView } from './views/admin/new-form.view'

const router = createBrowserRouter([
  { path: '/', element: <DashboardView /> },
  {
    path: 'admin',
    children: [{ path: 'new-form', element: <NewFormView /> }]
  }
])

export const App = () => {
  return <RouterProvider router={router} />
}
