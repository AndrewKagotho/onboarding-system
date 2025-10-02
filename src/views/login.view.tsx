import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../store/user.slice'
import { useAppDispatch, useAppSelector } from '../hooks'
import { Spinner } from '../components/spinner'

export const LoginView = () => {
  const authState = useAppSelector((state) => state.auth)

  const { isLoading } = authState

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [user, setUser] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setUser({ ...user, [e.target.id]: e.target.value })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const { role } = await dispatch(login(user)).unwrap()
      if (role === 'admin') {
        navigate('/admin')
      } else if (role === 'user') {
        navigate('/user')
      }
    } catch (error) {
      alert(`Error:, ${error}`)
    }
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <main>
          <div className='main_content'>
            <h1 className='heading heading-thin'>Login</h1>
            <form onSubmit={handleSubmit} className='login'>
              <label htmlFor='email'>E-mail:</label>
              <input id='email' onChange={handleChange} required />
              <label htmlFor='password'>Password:</label>
              <input
                id='password'
                type='password'
                onChange={handleChange}
                required
              />
              <button className='submit submit-end'>Log in</button>
            </form>
          </div>
        </main>
      )}
    </>
  )
}
