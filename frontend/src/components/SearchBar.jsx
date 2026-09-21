import { SearchIcon } from './Icons'

// Controlled input. Filtering happens in the page; no backend search endpoint exists.
export default function SearchBar({ value, onChange, placeholder = 'Search products' }) {
  return (
    <label className="search-bar">
      <SearchIcon />
      <span className="visually-hidden">Search products</span>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  )
}
