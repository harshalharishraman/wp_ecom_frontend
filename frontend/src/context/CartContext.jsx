import { createContext, useContext, useState } from 'react'
import { cartApi } from '../services/cartApi'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

// The backend has no "get cart" endpoint, so the cart shown here is a browser-side record of
// what this customer added. It is stored per account and is only used for display;
// the server stays authoritative for stock, costs and checkout.
const storeKey = (email) => `simplecart_cart_${email}`

const readItems = (email) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(storeKey(email)) || '[]')
    return Array.isArray(parsed) ? parsed.filter((i) => i && typeof i.name === 'string' && Number.isInteger(i.qty) && i.qty > 0) : []
  } catch { return [] }
}

function CartStore({ email, children }) {
  const [items, setItems] = useState(() => (email ? readItems(email) : []))

  const commit = (updater) => {
    setItems((current) => {
      const next = updater(current)
      if (email) localStorage.setItem(storeKey(email), JSON.stringify(next))
      return next
    })
  }

  const add = async (product, qty = 1) => {
    await cartApi.add(product.name, qty)
    commit((current) => {
      const existing = current.find((i) => i.name === product.name)
      if (existing) return current.map((i) => (i.name === product.name ? { ...i, qty: i.qty + qty } : i))
      return [...current, { name: product.name, image_url: product.image_url || null, qty }]
    })
  }

  const remove = async (name) => {
    await cartApi.remove(name)
    commit((current) => current.filter((i) => i.name !== name))
  }

  const clear = () => commit(() => [])
  const count = items.reduce((total, i) => total + i.qty, 0)

  return <CartContext.Provider value={{ items, count, add, remove, clear }}>{children}</CartContext.Provider>
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  // Re-mount the store whenever the signed-in account changes so carts never mix.
  return <CartStore key={user?.email || 'guest'} email={user?.email}>{children}</CartStore>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
