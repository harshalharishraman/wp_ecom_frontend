import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import SearchBar from '../components/SearchBar'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import ProductGrid from '../components/ProductGrid'
import HorizontalScroller from '../components/HorizontalScroller'
import { catalogApi } from '../services/catalogApi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

// Round-robin across subcategories so the picks row mixes different kinds of products.
const pickFeatured = (catalog, limit = 10) => {
  const lists = catalog.categories.flatMap((c) => c.subs.map((s) => s.products)).filter((l) => l.length)
  const picks = []
  for (let i = 0; picks.length < limit && lists.some((l) => i < l.length); i += 1) {
    for (const list of lists) if (list[i] && picks.length < limit) picks.push(list[i])
  }
  return picks
}

export default function Dashboard() {
  const { user } = useAuth()
  const { add } = useCart()
  const [params, setParams] = useSearchParams()
  const [catalog, setCatalog] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const fetchCatalog = useCallback((force = false) => catalogApi.loadCatalog({ force })
    .then((data) => { setCatalog(data); setStatus('ready') })
    .catch((e) => { setError(e.message); setStatus('error') }), [])

  const retry = () => { setStatus('loading'); fetchCatalog(true) }

  useEffect(() => { fetchCatalog() }, [fetchCatalog])

  const categoryId = params.get('cat')
  const subId = params.get('sub')

  const select = (cat, sub) => {
    const next = new URLSearchParams()
    if (cat) next.set('cat', cat)
    if (sub) next.set('sub', sub)
    setParams(next, { replace: true })
  }

  const featured = useMemo(() => (catalog ? pickFeatured(catalog) : []), [catalog])
  const activeCategory = catalog?.categories.find((c) => c.id === categoryId) || null
  const activeSub = activeCategory?.subs.find((s) => s.id === subId) || null

  const visible = useMemo(() => {
    if (!catalog) return []
    const needle = query.trim().toLowerCase()
    if (needle) return catalogApi.allProducts(catalog).filter((p) => p.name.toLowerCase().includes(needle))
    if (activeSub) return activeSub.products
    if (activeCategory) return activeCategory.subs.flatMap((s) => s.products)
    return catalogApi.allProducts(catalog)
  }, [catalog, query, activeCategory, activeSub])

  const heading = query.trim() ? `Results for “${query.trim()}”` : activeSub ? activeSub.name : activeCategory ? activeCategory.name : 'All products'
  const firstName = (user?.name || '').split(' ')[0]

  return (
    <div className="site-shell">
      <Navbar />
      <main className="container page">
        <div className="page-head">
          <div>
            <h1>{firstName ? `Hi ${firstName}, what are you shopping for?` : 'What are you shopping for?'}</h1>
          </div>
          <SearchBar value={query} onChange={setQuery} />
        </div>

        {status === 'loading' && <Loading label="Loading products…" />}

        {status === 'error' && (
          <div className="notice error" role="alert">
            <p>We couldn't load the catalog. {error}</p>
            <button className="button small" type="button" onClick={retry}>Try again</button>
          </div>
        )}

        {status === 'ready' && catalog.categories.length === 0 && <div className="empty">No categories have been added yet. Check back soon.</div>}

        {status === 'ready' && catalog.categories.length > 0 && !catalog.browsable && (
          <>
            <div className="notice" role="status">
              <strong>Products can't be shown yet.</strong>
              <p>The store's catalog service doesn't share category IDs, so the app can't load subcategories or products. Categories are listed below.</p>
              <button className="button small" type="button" onClick={retry}>Check again</button>
            </div>
            <div className="chip-row" aria-label="Categories">
              {catalog.categories.map((c) => <CategoryCard key={c.name} name={c.name} disabled />)}
            </div>
          </>
        )}

        {status === 'ready' && catalog.browsable && (
          <>
            {!query.trim() && !categoryId && featured.length > 0 && (
              <section className="block" aria-labelledby="picks-heading">
                <h2 id="picks-heading">Picks for you</h2>
                <HorizontalScroller label="Picks for you">
                  {featured.map((p) => <div className="scroller-item" role="listitem" key={`${p.subId}-${p.id || p.name}`}><ProductCard product={p} onAdd={add} /></div>)}
                </HorizontalScroller>
              </section>
            )}

            <section className="block" aria-labelledby="browse-heading">
              <h2 id="browse-heading">{heading}</h2>
              <div className="chip-row" aria-label="Categories">
                <CategoryCard name="All" active={!categoryId} onSelect={() => select()} />
                {catalog.categories.map((c) => <CategoryCard key={c.id} name={c.name} active={c.id === categoryId} onSelect={() => select(c.id)} />)}
              </div>
              {activeCategory && activeCategory.subs.length > 0 && (
                <div className="chip-row sub" aria-label={`${activeCategory.name} subcategories`}>
                  <CategoryCard name={`All ${activeCategory.name}`} active={!subId} onSelect={() => select(activeCategory.id)} />
                  {activeCategory.subs.map((s) => <CategoryCard key={s.id} name={s.name} active={s.id === subId} onSelect={() => select(activeCategory.id, s.id)} />)}
                </div>
              )}
              <ProductGrid products={visible} onAdd={add} emptyMessage={query.trim() ? 'No products match your search.' : 'No products in this section yet.'} />
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
