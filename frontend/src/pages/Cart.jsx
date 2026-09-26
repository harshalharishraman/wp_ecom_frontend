import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ProductImage } from '../components/ProductCard'
import { CartIcon } from '../components/Icons'
import { formatPrice } from '../utils/product'
import { useCart } from '../context/CartContext'

const taxRate = (category = '') => /electronics/i.test(category) ? 0.18 : 0
const totals = (items) => {
  const gross = items.reduce((sum, i) => sum + (Number(i.price) || 0) * i.qty, 0)
  const tax = items.reduce((sum, i) => { const line = (Number(i.price) || 0) * i.qty; const r = taxRate(i.categoryName); return sum + (r ? line - line / (1 + r) : 0) }, 0)
  const subtotal = gross - tax
  const shipping = gross >= 500 ? 0 : 100
  return { subtotal, tax, shipping, total: gross + shipping }
}
export default function Cart() {
  const { items, count, add, remove } = useCart()
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const run = async (name, action) => { setBusy(name); setError(''); try { await action() } catch (e) { setError(e.message) } finally { setBusy('') } }
  const t = totals(items)
  return <div className="site-shell"><Navbar /><main className="container page"><h1>Your cart</h1>
    {items.length === 0 ? <div className="empty"><CartIcon width={32} height={32} /><p>Your cart is empty.</p><Link className="button small" to="/dashboard">Start shopping</Link></div> : <div className="cart-layout">
      <ul className="cart-list">{items.map((item) => <li className="cart-row" key={item.name}><ProductImage product={item} className="thumb" /><div className="cart-info"><h2>{item.name}</h2><p className="muted">{item.price != null ? `${formatPrice(item.price)} each` : 'Price unavailable'}</p><p className="price">{item.price != null ? formatPrice(Number(item.price) * item.qty) : '—'}</p></div><div className="cart-actions"><div className="stepper"><button type="button" disabled={busy === item.name} onClick={() => run(item.name, () => remove(item.name, 1))} aria-label={`Decrease ${item.name}`}>−</button><output>{item.qty}</output><button type="button" disabled={busy === item.name} onClick={() => run(item.name, () => add(item, 1))} aria-label={`Increase ${item.name}`}>+</button></div></div></li>)}</ul>
      <aside className="summary"><h2>Summary</h2><p className="summary-line"><span>Items</span><strong>{count}</strong></p><p className="summary-line"><span>Before tax</span><strong>{formatPrice(t.subtotal)}</strong></p><p className="summary-line"><span>Estimated tax</span><strong>{formatPrice(t.tax)}</strong></p><p className="summary-line"><span>Delivery</span><strong>{t.shipping ? formatPrice(t.shipping) : 'Free'}</strong></p><p className="summary-line total"><span>Total</span><strong>{formatPrice(t.total)}</strong></p>{error && <p className="notice error" role="alert">{error}</p>}<Link className="button" to="/checkout">Go to checkout</Link><Link className="text-link" to="/dashboard">Continue shopping</Link></aside>
    </div>}
  </main><Footer /></div>
}