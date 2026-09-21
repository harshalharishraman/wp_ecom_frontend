import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'

// Mirrors the backend's rules (valid.js): name 4+ chars, valid email, and a password with
// upper + lower case, a special character, 8+ characters and no spaces.
const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=\S+$).{8,}$/

export default function Register() {
  const { register, isAuthenticated, userType } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', main_address: '', secondary_address: '', DOB: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthenticated && userType === 'customer') return <Navigate to="/dashboard" replace />

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    if (Object.values(form).some((v) => !v.trim())) return 'Fill in every field to create your account.'
    if (form.name.trim().length < 4) return 'Your name needs at least 4 characters.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Enter a valid email address.'
    if (!passwordRule.test(form.password)) return 'Use a password with 8+ characters, upper and lower case letters, a special character and no spaces.'
    return ''
  }

  const submit = async (e) => {
    e.preventDefault()
    const problem = validate()
    if (problem) return setError(problem)
    setError('')
    setBusy(true)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        main_address: form.main_address.trim(),
        secondary_address: form.secondary_address.trim(),
        DOB: form.DOB,
      }, 'customer')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="It takes less than a minute." footer={<>Already have an account? <Link to="/login">Log in</Link></>}>
      <form className="form" onSubmit={submit} noValidate>
        <label>Full name<input type="text" autoComplete="name" value={form.name} onChange={update('name')} required /></label>
        <label>Email<input type="email" autoComplete="email" value={form.email} onChange={update('email')} required /></label>
        <label>Password<input type="password" autoComplete="new-password" value={form.password} onChange={update('password')} required />
          <small>8+ characters with upper and lower case letters and a special character.</small></label>
        <label>Date of birth<input type="date" autoComplete="bday" value={form.DOB} onChange={update('DOB')} max={new Date().toISOString().slice(0, 10)} required /></label>
        <label>Main address<input type="text" autoComplete="street-address" value={form.main_address} onChange={update('main_address')} required /></label>
        <label>Shipping address<input type="text" value={form.secondary_address} onChange={update('secondary_address')} required />
          <small>Orders are delivered to this address.</small></label>
        {error && <p className="notice error" role="alert">{error}</p>}
        <button className="button" type="submit" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
    </AuthShell>
  )
}
