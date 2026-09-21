const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const CartIcon = (props) => <svg {...base} {...props}><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3.5h2.7l2.3 11.2a1 1 0 0 0 1 .8h9.3a1 1 0 0 0 1-.76L20.5 8H6.2" /></svg>
export const SearchIcon = (props) => <svg {...base} {...props}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
export const UserIcon = (props) => <svg {...base} {...props}><circle cx="12" cy="8" r="4" /><path d="M4 20.5c1-3.8 4-5.5 8-5.5s7 1.7 8 5.5" /></svg>
export const LogoutIcon = (props) => <svg {...base} {...props}><path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9" /><path d="M16 8l4 4-4 4M20 12H9" /></svg>
export const ChevronLeft = (props) => <svg {...base} {...props}><path d="m15 5-7 7 7 7" /></svg>
export const ChevronRight = (props) => <svg {...base} {...props}><path d="m9 5 7 7-7 7" /></svg>
export const TrashIcon = (props) => <svg {...base} {...props}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7M9 7V4.5h6V7" /></svg>
export const CheckIcon = (props) => <svg {...base} {...props}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
