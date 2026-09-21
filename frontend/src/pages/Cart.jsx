import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ProductImage } from '../components/ProductCard'
import { TrashIcon, CartIcon } from '../components/Icons'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, count, add, remove } = useCart()
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  const run = async (name, action) => {
    setBusy(name)
    setError('')
    try { await action() } catch (e) { setError(e.message) } finally { setBusy('') }
  }

  return (
    <div className="site-shell">
      <Navbar />
      <main className="container page">
        <h1>Your cart</h1>
        {items.length === 0 ? (
          <div className="empty">
            <CartIcon width={32} height={32} />
            <p>Your cart is empty.</p>
            <Link className="button small" to="/dashboard">Start shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <ul className="cart-list">
              {items.map((item) => (
                <li className="cart-row" key={item.name}>
                  <ProductImage product={item} className="thumb" />
                  <div className="cart-info">
                    <h2>{item.name}</h2>
                    <p className="muted">Quantity: {item.qty}</p>
                  </div>
                  <div className="cart-actions">
                    <button className="button button-outline small" type="button" disabled={busy === item.name} onClick={() => run(item.name, () => add(item, 1))}>Add one more</button>
                    <button className="icon-button danger" type="button" disabled={busy === item.name} onClick={() => run(item.name, () => remove(item.name))} aria-label={`Remove ${item.name}`} title="Remove"><TrashIcon /></button>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="summary">
              <h2>Summary</h2>
              <p className="summary-line"><span>Items</span><strong>{count}</strong></p>
              <p className="muted">Prices, tax and delivery are calculated when you check out.</p>
              {error && <p className="notice error" role="alert">{error}</p>}
              <Link className="button" to="/checkout">Go to checkout</Link>
              <Link className="text-link" to="/dashboard">Continue shopping</Link>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
