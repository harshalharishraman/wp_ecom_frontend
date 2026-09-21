import ProductCard from './ProductCard'

export default function ProductGrid({ products, onAdd, emptyMessage = 'No products here yet.' }) {
  if (!products.length) return <div className="empty">{emptyMessage}</div>
  return <div className="product-grid">{products.map((p) => <ProductCard key={`${p.subId || ''}-${p.id || p.name}`} product={p} onAdd={onAdd} />)}</div>
}
