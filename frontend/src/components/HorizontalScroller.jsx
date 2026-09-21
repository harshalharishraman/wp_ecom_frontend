import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from './Icons'

export default function HorizontalScroller({ label, children }) {
  const track = useRef(null)
  const scroll = (direction) => {
    const el = track.current
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }
  return (
    <div className="scroller">
      <button type="button" className="scroller-arrow left" onClick={() => scroll(-1)} aria-label={`Scroll ${label} left`}><ChevronLeft /></button>
      <div className="scroller-track" ref={track} role="list" aria-label={label}>{children}</div>
      <button type="button" className="scroller-arrow right" onClick={() => scroll(1)} aria-label={`Scroll ${label} right`}><ChevronRight /></button>
    </div>
  )
}
