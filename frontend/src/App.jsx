import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'

import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

const customer = (element) => <ProtectedRoute>{element}</ProtectedRoute>

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={customer(<Dashboard />)} />
          <Route path="/products" element={customer(<Products />)} />
          <Route path="/products/:id" element={customer(<ProductDetails />)} />
          <Route path="/cart" element={customer(<Cart />)} />
          <Route path="/checkout" element={customer(<Checkout />)} />
          <Route path="/profile" element={customer(<Profile />)} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
