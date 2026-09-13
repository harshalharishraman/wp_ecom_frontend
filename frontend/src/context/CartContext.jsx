import { createContext, useContext, useState } from 'react'
import { cartApi } from '../services/cartApi'
const CartContext = createContext(null)
export function CartProvider({ children }) { const [items, setItems] = useState([]); const add = async name => { await cartApi.add(name); setItems(current => { const existing = current.find(item => item.name === name); return existing ? current.map(item => item.name === name ? { ...item, qty: item.qty + 1 } : item) : [...current, { name, qty: 1 }] }) }; const remove = async name => { await cartApi.remove(name); setItems(current => current.filter(item => item.name !== name)) }; return <CartContext.Provider value={{ items, add, remove, clear: () => setItems([]) }}>{children}</CartContext.Provider> }
export const useCart = () => useContext(CartContext)
