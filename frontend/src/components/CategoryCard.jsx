// A simple selectable pill/tile for a category or subcategory.
export default function CategoryCard({ name, active = false, disabled = false, onSelect }) {
  return (
    <button type="button" className={`chip${active ? ' active' : ''}`} aria-pressed={active} disabled={disabled} onClick={onSelect}>
      {name}
    </button>
  )
}
