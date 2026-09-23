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

const emptyFilters = {
  categoryId: '',
  subcategoryId: '',
  minPrice: '',
  maxPrice: '',
  search: '',
  sort: '',
}

const sortedProducts = (products, sort) => {
  const sorted = [...products]
  if (sort === 'price_asc') return sorted.sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY))
  if (sort === 'price_desc') return sorted.sort((a, b) => (b.price ?? Number.NEGATIVE_INFINITY) - (a.price ?? Number.NEGATIVE_INFINITY))
  if (sort === 'newest') return sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
  return sorted
}

export default function Dashboard() {
  const { user } = useAuth()
  const { add } = useCart()
  const [params, setParams] = useSearchParams()
  const [catalog, setCatalog] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('idle')
  const [filterError, setFilterError] = useState('')
  const [draftFilters, setDraftFilters] = useState(emptyFilters)
  const [filteredProducts, setFilteredProducts] = useState(null)

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
    setDraftFilters((current) => ({ ...current, categoryId: cat || '', subcategoryId: sub || '' }))
    setFilteredProducts(null)
    setFilterError('')
    setFilterStatus('idle')
    setParams(next, { replace: true })
  }

  const toggleFilterPanel = () => {
    setFilterOpen((open) => {
      if (!open) {
        setDraftFilters((current) => ({
          ...current,
          categoryId: categoryId || '',
          subcategoryId: subId || '',
        }))
      }
      return !open
    })
  }

  const featured = useMemo(() => (catalog ? pickFeatured(catalog) : []), [catalog])
  const activeCategory = catalog?.categories.find((c) => c.id === categoryId) || null
  const activeSub = activeCategory?.subs.find((s) => s.id === subId) || null
  const draftCategory = catalog?.categories.find((c) => c.id === draftFilters.categoryId) || null
  const draftSubs = draftCategory?.subs || []

  const updateDraft = (key, value) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === 'categoryId' ? { subcategoryId: '' } : {}),
    }))
  }

  const fetchFilteredProducts = async (filters) => {
    if (!catalog) return []

    const selectedCategory = catalog.categories.find((c) => c.id === filters.categoryId) || null
    const selectedSub = selectedCategory?.subs.find((s) => s.id === filters.subcategoryId) || null
    const categories = selectedCategory ? [selectedCategory] : catalog.categories
    const apiFilters = {
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      search: filters.search,
      sort: filters.sort,
    }
    const products = []

    for (const category of categories) {
      const subs = selectedSub && selectedCategory?.id === category.id ? [selectedSub] : category.subs
      for (const sub of subs) {
        if (!category.id || !sub.id) continue
        const items = await catalogApi.getProducts(category.id, sub.id, {
          ...apiFilters,
          category: category.id,
          subcategory: sub.id,
        })
        products.push(...items.map((p) => ({ ...p, categoryId: category.id, categoryName: category.name, subId: sub.id, subName: sub.name })))
      }
    }

    return sortedProducts(products, filters.sort)
  }

  const applyFilters = async (event) => {
    event.preventDefault()
    const minPrice = draftFilters.minPrice.trim()
    const maxPrice = draftFilters.maxPrice.trim()
    const nextFilters = {
      ...draftFilters,
      minPrice,
      maxPrice,
      search: draftFilters.search.trim(),
    }

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      setFilterError('Minimum price cannot be greater than maximum price.')
      return
    }

    setFilterStatus('loading')
    setFilterError('')
    try {
      const products = await fetchFilteredProducts(nextFilters)
      const next = new URLSearchParams()
      if (nextFilters.categoryId) next.set('cat', nextFilters.categoryId)
      if (nextFilters.subcategoryId) next.set('sub', nextFilters.subcategoryId)
      setParams(next, { replace: true })
      setQuery('')
      setFilteredProducts(products)
      setFilterStatus('ready')
      setFilterOpen(false)
    } catch (e) {
      setFilterError(e.message)
      setFilterStatus('error')
    }
  }

  const clearFilters = async () => {
    setDraftFilters(emptyFilters)
    setFilteredProducts(null)
    setFilterError('')
    setFilterStatus('loading')
    setQuery('')
    setParams(new URLSearchParams(), { replace: true })
    try {
      catalogApi.clearCache()
      const data = await catalogApi.loadCatalog({ force: true })
      setCatalog(data)
      setStatus('ready')
      setFilterStatus('idle')
    } catch (e) {
      setFilterError(e.message)
      setFilterStatus('error')
    }
  }

  const visible = useMemo(() => {
    if (!catalog) return []
    const needle = query.trim().toLowerCase()
    const source = filteredProducts || (activeSub ? activeSub.products : activeCategory ? activeCategory.subs.flatMap((s) => s.products) : catalogApi.allProducts(catalog))
    if (needle) return source.filter((p) => p.name.toLowerCase().includes(needle))
    if (filteredProducts) return filteredProducts
    if (activeSub) return activeSub.products
    if (activeCategory) return activeCategory.subs.flatMap((s) => s.products)
    return catalogApi.allProducts(catalog)
  }, [catalog, query, activeCategory, activeSub, filteredProducts])

  const heading = query.trim() ? `Results for “${query.trim()}”` : filteredProducts ? 'Filtered products' : activeSub ? activeSub.name : activeCategory ? activeCategory.name : 'All products'
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
            {!query.trim() && !categoryId && !filteredProducts && featured.length > 0 && (
              <section className="block" aria-labelledby="picks-heading">
                <h2 id="picks-heading">Picks for you</h2>
                <HorizontalScroller label="Picks for you">
                  {featured.map((p) => <div className="scroller-item" role="listitem" key={`${p.subId}-${p.id || p.name}`}><ProductCard product={p} onAdd={add} /></div>)}
                </HorizontalScroller>
              </section>
            )}

            <section className="block" aria-labelledby="browse-heading">
              <div className="browse-title-row">
                <h2 id="browse-heading">{heading}</h2>
                <button className="button button-outline small" type="button" onClick={toggleFilterPanel}>
                  Filter
                </button>
              </div>
              {filterOpen && (
                <form className="filter-panel form" onSubmit={applyFilters}>
                  <label>
                    Category
                    <select value={draftFilters.categoryId} onChange={(e) => updateDraft('categoryId', e.target.value)}>
                      <option value="">All categories</option>
                      {catalog.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </label>
                  <label>
                    Subcategory
                    <select value={draftFilters.subcategoryId} onChange={(e) => updateDraft('subcategoryId', e.target.value)} disabled={!draftFilters.categoryId}>
                      <option value="">{draftFilters.categoryId ? 'All subcategories' : 'Choose a category first'}</option>
                      {draftSubs.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </label>
                  <label>
                    Minimum Price
                    <input type="number" min="0" inputMode="decimal" value={draftFilters.minPrice} onChange={(e) => updateDraft('minPrice', e.target.value)} placeholder="Min" />
                  </label>
                  <label>
                    Maximum Price
                    <input type="number" min="0" inputMode="decimal" value={draftFilters.maxPrice} onChange={(e) => updateDraft('maxPrice', e.target.value)} placeholder="Max" />
                  </label>
                  <label>
                    Search
                    <input type="search" value={draftFilters.search} onChange={(e) => updateDraft('search', e.target.value)} placeholder="Search products..." />
                  </label>
                  <label>
                    Sort
                    <select value={draftFilters.sort} onChange={(e) => updateDraft('sort', e.target.value)}>
                      <option value="">Default order</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                  </label>
                  {filterError && <p className="field-error" role="alert">{filterError}</p>}
                  <div className="filter-actions">
                    <button className="button button-outline small" type="button" onClick={clearFilters} disabled={filterStatus === 'loading'}>Clear</button>
                    <button className="button small" type="submit" disabled={filterStatus === 'loading'}>{filterStatus === 'loading' ? 'Applying...' : 'Apply'}</button>
                  </div>
                </form>
              )}
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
              <ProductGrid products={visible} onAdd={add} emptyMessage={filteredProducts ? 'No products found.' : query.trim() ? 'No products match your search.' : 'No products in this section yet.'} />
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
