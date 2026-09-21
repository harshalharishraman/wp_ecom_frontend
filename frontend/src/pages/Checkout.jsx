import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ProductImage } from '../components/ProductCard'
import { formatPrice } from '../utils/product'
import { CheckIcon } from '../components/Icons'
import { cartApi } from '../services/cartApi'
import { useCart } from '../context/CartContext'

const money = (v) => (Number.isFinite(Number(v)) ? formatPrice(Number(v)) : '—')

export default function Checkout() {
  const { items, count, clear } = useCart()
  const [receipt, setReceipt] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!receipt && items.length === 0) return <Navigate to="/cart" replace />

  const placeOrder = async () => {
    setBusy(true)
    setError('')
    try {
      setReceipt(await cartApi.checkout())
      clear()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="site-shell">
      <Navbar />
      <main className="container page">
        {receipt ? (
          <div className="receipt">
            <span className="success-mark"><CheckIcon width={26} height={26} /></span>
            <h1>Order placed</h1>
            {receipt.order_id != null && <p className="muted">Order #{receipt.order_id}</p>}
            {receipt.shipping_address && <p>Delivering to <strong>{receipt.shipping_address}</strong></p>}
            {Array.isArray(receipt.products) && (
              <ul className="receipt-items">
                {receipt.products.map((p) => <li key={p.name}><span>{p.name}</span><span>× {p.quantity}</span></li>)}
              </ul>
            )}
            <div className="receipt-totals">
              <p><span>Subtotal</span><span>{money(receipt.cost)}</span></p>
              <p><span>GST</span><span>{money(receipt.gst)}</span></p>
              <p><span>Shipping</span><span>{money(receipt.shipping_cost)}</span></p>
              <p className="total"><span>Total</span><span>{money(receipt.final_cost)}</span></p>
            </div>
            <Link className="button" to="/dashboard">Continue shopping</Link>
          </div>
        ) : (
          <>
            <h1>Checkout</h1>
            <div className="cart-layout">
              <ul className="cart-list">
                {items.map((item) => (
                  <li className="cart-row" key={item.name}>
                    <ProductImage product={item} className="thumb" />
                    <div className="cart-info"><h2>{item.name}</h2><p className="muted">Quantity: {item.qty}</p></div>
                  </li>
                ))}
              </ul>
              <aside className="summary">
                <h2>Order</h2>
                <p className="summary-line"><span>Items</span><strong>{count}</strong></p>
                <p className="muted">We'll calculate the total, GST and shipping when you place the order, and deliver to the shipping address on your account.</p>
                {error && <p className="notice error" role="alert">{error}</p>}
                <button className="button" type="button" onClick={placeOrder} disabled={busy}>{busy ? 'Placing order…' : 'Place order'}</button>
                <Link className="text-link" to="/cart">Back to cart</Link>
              </aside>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
