import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Nav } from './components/nav'
import { AdminDashboardView } from './views/admin/admin-dashboard.view'
import { NotificationView } from './views/admin/notification.view'
import { FormView } from './views/admin/form.view'
import { NewFormView } from './views/admin/new-form.view'
import { UserDashboardView } from './views/user/user-dashboard'
import { SubmitFormView } from './views/user/submit-form.view'
import { SubmissionView } from './views/admin/submission.view'
import { fetchAuthUser } from './store/auth.slice'
import { useAppDispatch } from './hooks'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Nav />,
    children: [
      {
        path: 'admin',
        children: [
          { index: true, element: <AdminDashboardView /> },
          { path: 'notifications/:id', element: <NotificationView /> },
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
      },
      {
        path: '/submission/:id',
        element: <SubmissionView />
      }
    ]
  }
])

export const App = () => {
  const dispatch = useAppDispatch()

  const authUserId = localStorage.getItem('user')

  if (authUserId) {
    dispatch(fetchAuthUser(authUserId))
  }

  return <RouterProvider router={router} />
}
