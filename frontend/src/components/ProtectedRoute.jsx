import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Customer routes need a customer session; admin routes use type="admin".
export default function ProtectedRoute({ children, type = 'customer' }) {
  const { isAuthenticated, userType } = useAuth()
  const location = useLocation()
  if (!isAuthenticated || userType !== type) {
    return <Navigate to={type === 'admin' ? '/admin/login' : '/login'} replace state={{ from: location.pathname + location.search }} />
  }
  return children
}
