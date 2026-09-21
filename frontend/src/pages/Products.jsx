import { Navigate, useLocation } from 'react-router-dom'

// Browsing lives on the dashboard; keep /products working for old links.
export default function Products() {
  const { search } = useLocation()
  return <Navigate to={`/dashboard${search}`} replace />
}
