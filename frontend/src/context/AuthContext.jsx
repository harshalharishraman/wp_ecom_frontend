import { createContext, useContext, useMemo, useState } from 'react'
import { authApi } from '../services/authApi'
import { storage } from '../services/api'

const AuthContext = createContext(null)

const readUser = () => {
  try { return JSON.parse(localStorage.getItem('simplecart_user') || 'null') } catch { return null }
}

export function AuthProvider({ children }) {
  const [userType, setUserType] = useState(() => localStorage.getItem('simplecart_user_type'))
  const [user, setUser] = useState(readUser)

  const login = async (body, type = 'customer') => {
    const data = await authApi.login(body, type)
    const nextUser = { name: body.name, email: data.email || body.email }
    setUserType(type)
    setUser(nextUser)
    localStorage.setItem('simplecart_user_type', type)
    localStorage.setItem('simplecart_user', JSON.stringify(nextUser))
  }

  const register = async (body, type = 'customer') => {
    await authApi.register(body, type)
    return login({ name: body.name, email: body.email, password: body.password }, type)
  }

  const logout = () => {
    storage.clear()
    localStorage.removeItem('simplecart_admin_access')
    localStorage.removeItem('simplecart_admin_refresh')
    localStorage.removeItem('simplecart_user_type')
    localStorage.removeItem('simplecart_user')
    setUser(null)
    setUserType(null)
  }

  const value = useMemo(() => ({
    user,
    userType,
    isAuthenticated: Boolean(userType && user && (userType === 'admin' ? localStorage.getItem('simplecart_admin_access') : storage.access)),
    accessToken: userType === 'admin' ? localStorage.getItem('simplecart_admin_access') : storage.access,
    login,
    logout,
    register,
    refreshSession: () => Promise.resolve(),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [user, userType])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
