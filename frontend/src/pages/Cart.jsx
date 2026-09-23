import { useState, useEffect } from 'react'
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
  const [popup, setPopup] = useState(null)

  useEffect(() => {
    if (!popup) return
    const timer = setTimeout(() => {
      setPopup(null)
    }, 3500)
    return () => clearTimeout(timer)
  }, [popup])

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
                    <button
                      className="button button-outline small"
                      type="button"
                      disabled={busy === item.name}
                      onClick={() => run(item.name, async () => {
                        await add(item, 1)
                        setPopup({ message: `Added one more "${item.name}" to cart`, type: 'add' })
                      })}
                    >
                      Add one more
                    </button>
                    <button
                      className="icon-button danger"
                      type="button"
                      disabled={busy === item.name}
                      onClick={() => run(item.name, async () => {
                        await remove(item.name)
                        setPopup({ message: `Removed "${item.name}" from cart`, type: 'delete' })
                      })}
                      aria-label={`Remove ${item.name}`}
                      title="Remove"
                    >
                      <TrashIcon />
                    </button>
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

        {popup && (
          <aside className={`cart-popup ${popup.type}`} role="status">
            <div className="cart-popup-content">
              <span className="cart-popup-title">
                {popup.type === 'delete' ? 'Item removed' : 'Item added'}
              </span>
              <span className="cart-popup-msg">{popup.message}</span>
            </div>
            <button
              type="button"
              className="cart-popup-close"
              onClick={() => setPopup(null)}
              aria-label="Close notification"
            >
              ×
            </button>
          </aside>
        )}
      </main>
      <Footer />
    </div>
  )
}
