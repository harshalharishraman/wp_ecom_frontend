import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckIcon } from './Icons'
import { toneFor, productPath, formatPrice } from '../utils/product'

export function ProductImage({ product, className = '' }) {
  const [failed, setFailed] = useState(false)
  if (product.image_url && !failed) {
    return <img className={`product-image ${className}`} src={product.image_url} alt={product.name} loading="lazy" onError={() => setFailed(true)} />
  }
  return <div className={`product-image placeholder ${className}`} style={{ background: toneFor(product.name) }} role="img" aria-label={product.name}>{product.name.charAt(0).toUpperCase()}</div>
}

export default function ProductCard({ product, onAdd }) {
  const [state, setState] = useState('idle') // idle | adding | added | error
  const [error, setError] = useState('')

  const handleAdd = async () => {
    setState('adding')
    setError('')
    try {
      await onAdd(product)
      setState('added')
      setTimeout(() => setState('idle'), 1500)
    } catch (e) {
      setError(e.message)
      setState('error')
    }
  }

  return (
    <article className="product-card">
      <Link to={productPath(product)} className="product-link">
        <ProductImage product={product} />
        <h3>{product.name}</h3>
        {product.price !== null && <p className="price">{formatPrice(product.price)}</p>}
      </Link>
      <button className="button button-outline small" type="button" onClick={handleAdd} disabled={state === 'adding'}>
        {state === 'adding' ? 'Adding…' : state === 'added' ? <><CheckIcon width={16} height={16} /> Added</> : 'Add to cart'}
      </button>
      {state === 'error' && <p className="field-error" role="alert">{error}</p>}
    </article>
  )
}
