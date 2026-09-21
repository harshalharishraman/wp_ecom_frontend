export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <span className="brand small"><span className="brand-mark">+</span>simplecart</span>
        <span className="muted">© {new Date().getFullYear()} simplecart</span>
      </div>
    </footer>
  )
}
