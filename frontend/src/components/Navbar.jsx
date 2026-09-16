import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { items } = useCart()
  const count = items.reduce((total, item) => total + item.qty, 0)
  return <header className="site-header"><div className="container nav-row"><Link className="brand" to="/"><span>+</span> simplecart</Link><nav><Link to="/products">Shop</Link><Link to="/products">Collections</Link><Link to="/products">About us</Link></nav><div className="nav-actions"><Link className="icon-button" aria-label="Search" to="/products">⌕</Link><Link className="auth-link" to="/login">Login</Link><Link className="signup-button" to="/register">Sign up</Link><Link className="cart-button" to="/cart">Cart <span>{count || 0}</span></Link></div></div></header>
}
