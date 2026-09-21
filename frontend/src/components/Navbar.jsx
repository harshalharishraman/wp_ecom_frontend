import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { CartIcon, LogoutIcon } from './Icons'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link className="brand" to={isAuthenticated ? '/dashboard' : '/login'}><span className="brand-mark">+</span>simplecart</Link>
        {isAuthenticated && (
          <nav aria-label="Main">
            <NavLink to="/dashboard">Shop</NavLink>
            <NavLink to="/profile">Account</NavLink>
          </nav>
        )}
        {isAuthenticated && (
          <div className="nav-actions">
            <Link className="cart-button" to="/cart" aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}>
              <CartIcon />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
            <Link className="avatar" to="/profile" aria-label="Your account" title={user?.email}>{initial}</Link>
            <button className="icon-button" type="button" onClick={handleLogout} aria-label="Log out" title="Log out"><LogoutIcon /></button>
          </div>
        )}
      </div>
    </header>
  )
}
