import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="site-shell">
      <Navbar />
      <main className="container page narrow">
        <h1>Your account</h1>
        <dl className="details">
          <div><dt>Name</dt><dd>{user?.name || '—'}</dd></div>
          <div><dt>Email</dt><dd>{user?.email || '—'}</dd></div>
        </dl>
        <button className="button button-outline" type="button" onClick={() => { logout(); navigate('/login', { replace: true }) }}>Log out</button>
      </main>
      <Footer />
    </div>
  )
}
