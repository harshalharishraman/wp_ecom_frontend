import { Link } from 'react-router-dom'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="auth-page">
      <section className="auth-panel" aria-hidden="true">
        <Link className="brand light" to="/login"><span className="brand-mark">+</span>simplecart</Link>
        <div>
          <h2>Everyday tech and home, all in one bag.</h2>
          <p>Phones, laptops, power banks and home decor, ready when you are.</p>
        </div>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-card">
          <Link className="brand auth-mobile-brand" to="/login"><span className="brand-mark">+</span>simplecart</Link>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </div>
      </section>
    </main>
  )
}
