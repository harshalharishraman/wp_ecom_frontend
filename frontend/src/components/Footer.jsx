import { Link } from 'react-router-dom'

export default function Footer() {
  return <footer><div className="container footer-main"><div><Link className="brand" to="/"><span>+</span> simplecart</Link><p>Simple shopping for<br />everyday living.</p></div><div className="footer-links"><div><strong>Explore</strong><Link to="/products">Shop all</Link><Link to="/products">New arrivals</Link></div><div><strong>Help</strong><Link to="/login">Sign in</Link><Link to="/cart">Your bag</Link></div><div><strong>Follow along</strong><a href="#instagram">Instagram</a><a href="#pinterest">Pinterest</a></div></div></div><div className="container footer-bottom"><span>© 2025 simplecart</span><span>Made for the everyday.</span></div></footer>
}
