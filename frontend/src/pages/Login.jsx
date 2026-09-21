import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, isAuthenticated, userType } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthenticated && userType === 'customer') return <Navigate to="/dashboard" replace />

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.password) return setError('Enter your name, email and password.')
    setBusy(true)
    try {
      await login({ name: form.name.trim(), email: form.email.trim(), password: form.password }, 'customer')
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to see what's in store." footer={<>New here? <Link to="/register">Create an account</Link></>}>
      <form className="form" onSubmit={submit} noValidate>
        <label>Full name<input type="text" autoComplete="name" value={form.name} onChange={update('name')} required /></label>
        <label>Email<input type="email" autoComplete="email" value={form.email} onChange={update('email')} required /></label>
        <label>Password<input type="password" autoComplete="current-password" value={form.password} onChange={update('password')} required /></label>
        {error && <p className="notice error" role="alert">{error}</p>}
        <button className="button" type="submit" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      </form>
    </AuthShell>
  )
}
