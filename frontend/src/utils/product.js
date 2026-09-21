const tones = ['#DBEBFF', '#E6F2FA', '#EDE6FF', '#FFEDD6']
export const toneFor = (name) => tones[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % tones.length]
export const productPath = (product) => `/products/${encodeURIComponent(product.id || product.name)}`
export const formatPrice = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
