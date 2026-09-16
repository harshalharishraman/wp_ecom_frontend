import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { catalogApi } from '../services/catalogApi'

const fallbackCategories = [
  { name: 'Electronics', icon: '⌁', description: 'Smart tech for everyday life' },
  { name: 'Fashion', icon: '◒', description: 'Looks made to move with you' },
  { name: 'Home & Living', icon: '⌂', description: 'Make space feel like yours' },
  { name: 'Beauty', icon: '✦', description: 'Little luxuries, big difference' },
]
const featuredProducts = [
  { name: 'Everyday essentials', category: 'Curated picks', price: '$24.00', tone: 'blue', badge: 'New' },
  { name: 'Modern home finds', category: 'Home & living', price: '$38.00', tone: 'sky', badge: 'Popular' },
  { name: 'Weekend edit', category: 'Style & accessories', price: '$52.00', tone: 'navy', badge: 'Trending' },
]

function Home() {
  const [categories, setCategories] = useState(fallbackCategories)
  useEffect(() => {
    catalogApi.getCategories().then((items) => {
      if (items.length) setCategories(items.slice(0, 4).map((item, index) => ({ name: item.name, icon: fallbackCategories[index]?.icon || '✦', description: fallbackCategories[index]?.description || 'Explore the latest collection' })))
    }).catch(() => {})
  }, [])
  const stats = useMemo(() => [['10k+', 'happy shoppers'], ['24/7', 'customer support'], ['100%', 'secure checkout']], [])
  return <div className="site-shell">
    <Navbar />
    <main>
      <section className="hero-section"><div className="container hero-layout"><div className="hero-copy"><p className="eyebrow">The simple way to shop</p><h1>Find your next <span>favorite</span> thing.</h1><p className="hero-lead">Thoughtfully selected products for your home, your style, and your everyday moments.</p><div className="hero-actions"><Link className="button button-light" to="/products">Shop the collection <span>↗</span></Link><Link className="text-link" to="/products">Explore categories <span>→</span></Link></div><div className="hero-proof"><div className="avatar-stack"><i>J</i><i>M</i><i>A</i><b>+</b></div><p><strong>Loved by 10,000+</strong><br />shoppers like you</p></div></div><div className="hero-art" aria-label="Featured product collection"><div className="art-glow" /><div className="floating-note note-top"><span>✦</span><div><strong>Fresh arrivals</strong><small>Just in this week</small></div></div><div className="product-orbit orbit-one" /><div className="product-orbit orbit-two" /><div className="hero-product-card"><div className="product-card-image"><span>SC</span><em>simple<br />comfort</em></div><div className="mini-product-info"><div><strong>Daily essentials</strong><small>Made for your everyday</small></div><strong>$32</strong></div></div><div className="floating-note note-bottom"><span>✓</span><div><strong>Easy checkout</strong><small>Fast & secure</small></div></div></div></div><div className="container stats-row">{stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>
      <section className="section container categories-section"><div className="section-heading"><div><p className="eyebrow">Browse by mood</p><h2>Shop your way</h2></div><Link className="text-link" to="/products">View all <span>→</span></Link></div><div className="category-grid">{categories.map((category) => <Link className="category-tile" to="/products" key={category.name}><div className="category-icon">{category.icon}</div><div><h3>{category.name}</h3><p>{category.description}</p></div><span className="tile-arrow">↗</span></Link>)}</div></section>
      <section className="section featured-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">Picked for you</p><h2>Good things, simply found.</h2></div><Link className="text-link" to="/products">See all products <span>→</span></Link></div><div className="featured-grid">{featuredProducts.map((product) => <Link className="featured-card" to="/products" key={product.name}><div className={`featured-image ${product.tone}`}><span className="product-badge">{product.badge}</span><div className="abstract-product" /></div><div className="featured-info"><div><p>{product.category}</p><h3>{product.name}</h3></div><strong>{product.price}</strong></div></Link>)}</div></div></section>
      <section className="newsletter-section container"><div><p className="eyebrow">Stay in the loop</p><h2>A little inspiration,<br /><span>straight to your inbox.</span></h2></div><form className="newsletter-form" onSubmit={(event) => event.preventDefault()}><label htmlFor="email">Email address</label><div><input id="email" type="email" placeholder="you@example.com" /><button className="button" type="submit">Sign me up <span>→</span></button></div><small>No spam. Just good stuff, occasionally.</small></form></section>
    </main><Footer />
  </div>
}
export default Home
