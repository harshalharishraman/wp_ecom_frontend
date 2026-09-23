import { api, apiError, responseData } from './api'

// This layer accepts either simple names or richer objects ({ id, name, ... }) so it keeps
// working with the existing backend envelope without inventing ids or prices.

const asList = (data, keys) => {
  if (Array.isArray(data)) return data
  for (const key of keys) if (Array.isArray(data?.[key])) return data[key]
  return []
}

const hasValue = (v) => v !== undefined && v !== null && v !== ''
const asId = (v) => (hasValue(v) ? String(v) : null)

const toEntry = (item) => {
  if (typeof item === 'string') return item ? { id: null, name: item } : null
  if (item && typeof item.name === 'string' && item.name) return { id: asId(item.id), name: item.name }
  return null
}

const toProduct = (item, extra = {}) => {
  const base = typeof item === 'string' ? { name: item } : item
  if (!base || typeof base.name !== 'string' || !base.name) return null
  const price = Number(base.price_usd ?? base.price)
  const stock = Number(base.stock)
  return {
    id: asId(base.id),
    name: base.name,
    image_url: typeof base.image_url === 'string' && base.image_url ? base.image_url : null,
    price: hasValue(base.price_usd ?? base.price) && Number.isFinite(price) ? price : null,
    stock: hasValue(base.stock) && Number.isFinite(stock) ? stock : null,
    brand: typeof base.brand === 'string' && base.brand ? base.brand : null,
    description: [base.description, base.desc].find((v) => typeof v === 'string' && v) || null,
    created_at: typeof base.created_at === 'string' && base.created_at ? base.created_at : null,
    ...extra,
  }
}

const cleanProductFilters = (filters = {}) => {
  const params = new URLSearchParams()
  const allowedSorts = new Set(['price_asc', 'price_desc', 'newest'])

  if (hasValue(filters.category)) params.set('category', String(filters.category))
  if (hasValue(filters.subcategory)) params.set('subcategory', String(filters.subcategory))
  if (hasValue(filters.minPrice)) params.set('minPrice', String(filters.minPrice))
  if (hasValue(filters.maxPrice)) params.set('maxPrice', String(filters.maxPrice))
  if (hasValue(filters.search)) params.set('search', String(filters.search).trim())
  if (allowedSorts.has(filters.sort)) params.set('sort', filters.sort)

  return params
}

// The backend answers 400 when a category/subcategory is empty or unknown. Treat as "nothing here".
const emptyOn400 = (error) => {
  if (error.response?.status === 400) return []
  throw apiError(error)
}

let catalogCache = null

export const catalogApi = {
  async getCategories() {
    try {
      const data = responseData(await api.get('/cus/categories/get_all'))
      return asList(data, ['categories']).map(toEntry).filter(Boolean)
    } catch (e) { throw apiError(e) }
  },

  async getSubcategories(categoryId) {
    try {
      const data = responseData(await api.get(`/cus/categories/all_sub/${encodeURIComponent(categoryId)}`))
      return asList(data, ['sub_categories', 'subs']).map(toEntry).filter(Boolean)
    } catch (e) { return emptyOn400(e) }
  },

  async getProducts(categoryId, subcategoryId, filters = {}) {
    try {
      const params = cleanProductFilters(filters)
      const query = params.toString()
      const url = `/cus/categories/${encodeURIComponent(categoryId)}/sub/${encodeURIComponent(subcategoryId)}/products${query ? `?${query}` : ''}`
      const data = responseData(await api.get(url))
      return asList(data, ['products']).map((p) => toProduct(p)).filter(Boolean)
    } catch (e) {
      if (Object.keys(filters).length) throw apiError(e)
      return emptyOn400(e)
    }
  },

  // Loads categories -> subcategories -> products. Requests only run for entries that have
  // real ids from the backend; otherwise browsing is reported as unavailable.
  async loadCatalog({ force = false } = {}) {
    if (catalogCache && !force) return catalogCache
    const categories = await this.getCategories()
    const browsable = categories.length > 0 && categories.every((c) => c.id)
    if (!browsable) {
      catalogCache = { categories: categories.map((c) => ({ ...c, subs: [] })), browsable: false }
      return catalogCache
    }
    const tree = await Promise.all(categories.map(async (category) => {
      const subs = await this.getSubcategories(category.id)
      const withProducts = await Promise.all(subs.map(async (sub) => {
        if (!sub.id) return { ...sub, products: [] }
        const products = await this.getProducts(category.id, sub.id)
        return { ...sub, products: products.map((p) => ({ ...p, categoryId: category.id, categoryName: category.name, subId: sub.id, subName: sub.name })) }
      }))
      return { ...category, subs: withProducts }
    }))
    const subsBrowsable = tree.every((c) => c.subs.every((s) => s.id))
    catalogCache = { categories: tree, browsable: subsBrowsable }
    return catalogCache
  },

  allProducts(catalog) {
    return catalog.categories.flatMap((c) => c.subs.flatMap((s) => s.products))
  },

  findProduct(catalog, key) {
    return this.allProducts(catalog).find((p) => (p.id && p.id === key) || p.name === key) || null
  },

  clearCache() { catalogCache = null },
}
