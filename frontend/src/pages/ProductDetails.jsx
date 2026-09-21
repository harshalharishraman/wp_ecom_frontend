import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import { ProductImage } from '../components/ProductCard'
import { formatPrice } from '../utils/product'
import { catalogApi } from '../services/catalogApi'
import { useCart } from '../context/CartContext'

export default function ProductDetails() {
  const { id } = useParams()
  const { add, items } = useCart()
  const [state, setState] = useState({ status: 'loading', product: null, error: '' })
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    let active = true
    catalogApi.loadCatalog()
      .then((catalog) => { if (active) setState({ status: 'ready', product: catalogApi.findProduct(catalog, id), error: '' }) })
      .catch((e) => { if (active) setState({ status: 'error', product: null, error: e.message }) })
    return () => { active = false }
  }, [id])

  const { status, product, error } = state
  const inCart = product ? items.find((i) => i.name === product.name)?.qty || 0 : 0
  const maxQty = product?.stock ?? null
  const soldOut = maxQty !== null && maxQty <= 0

  const handleAdd = async () => {
    setAdding(true)
    setMessage({ type: '', text: '' })
    try {
      await add(product, qty)
      setMessage({ type: 'success', text: `Added ${qty} to your cart.` })
    } catch (e) {
      setMessage({ type: 'error', text: e.message })
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="site-shell">
      <Navbar />
      <main className="container page">
        {status === 'loading' && <Loading label="Loading product…" />}
        {status === 'error' && <div className="notice error" role="alert">We couldn't load this product. {error}</div>}
        {status === 'ready' && !product && (
          <div className="empty">
            <p>We couldn't find that product.</p>
            <Link className="button small" to="/dashboard">Back to shop</Link>
          </div>
        )}
        {status === 'ready' && product && (
          <>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/dashboard">Shop</Link>
              {product.categoryName && <><span>/</span><Link to={`/dashboard?cat=${product.categoryId}`}>{product.categoryName}</Link></>}
              {product.subName && <><span>/</span><Link to={`/dashboard?cat=${product.categoryId}&sub=${product.subId}`}>{product.subName}</Link></>}
            </nav>
            <div className="detail">
              <ProductImage product={product} className="detail-image" />
              <div className="detail-info">
                {product.brand && <p className="muted">{product.brand}</p>}
                <h1>{product.name}</h1>
                {product.price !== null && <p className="detail-price">{formatPrice(product.price)}</p>}
                {product.description && <p className="detail-desc">{product.description}</p>}
                {maxQty !== null && <p className={soldOut ? 'field-error' : 'muted'}>{soldOut ? 'Out of stock' : `${maxQty} in stock`}</p>}

                <div className="buy-row">
                  <div className="stepper" role="group" aria-label="Quantity">
                    <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">−</button>
                    <output aria-live="polite">{qty}</output>
                    <button type="button" onClick={() => setQty((q) => (maxQty !== null ? Math.min(maxQty, q + 1) : q + 1))} disabled={maxQty !== null && qty >= maxQty} aria-label="Increase quantity">+</button>
                  </div>
                  <button className="button" type="button" onClick={handleAdd} disabled={adding || soldOut}>{adding ? 'Adding…' : 'Add to cart'}</button>
                </div>

                {message.text && <p className={message.type === 'error' ? 'notice error' : 'notice success'} role={message.type === 'error' ? 'alert' : 'status'}>{message.text}</p>}
                {inCart > 0 && <p className="muted">{inCart} in your cart · <Link to="/cart">View cart</Link></p>}
                <ul className="perks">
                  <li>Delivered to the shipping address on your account</li>
                  <li>Delivery and tax are shown at checkout</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
