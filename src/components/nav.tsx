import { Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { clearAuthState } from '../store/auth.slice'
import { LoginView } from '../views/login.view'

export const Nav = () => {
  const dispatch = useAppDispatch()

  const authState = useAppSelector((state) => state.auth)
  const { data: authUser } = authState

  const handleLogout = () => {
    dispatch(clearAuthState())
    localStorage.removeItem('user')
  }

  return (
    <main>
      {authUser ? (
        <>
          <nav>
            <div>
              <span className='bold uppercase'>Onboarding System</span>
              <span className='span-a' onClick={handleLogout}>
                Log out
              </span>
            </div>
          </nav>
          <Outlet />
        </>
      ) : (
        <LoginView />
      )}
    </main>
  )
}
