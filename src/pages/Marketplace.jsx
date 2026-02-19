// pages/Marketplace.jsx
import { useEffect, useState } from 'react'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import { getAllProducts } from '../lib/marketplaceQueries'
import { urlFor } from '../lib/sanity'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import FilterBar from '../components/filter'

const SLUG_MAP = {
  'phones': 'Phones & Gadgets',
  'computers': 'Computer & Accessories',
  'hostel-items': 'Furniture & Decor',
  'food': 'Food & Drinks',
  'services': 'Services',
  'clothes': 'Fashion & Clothing',
}

// ─── Helpers ────────────────────────────────────────────────
const naira = (n) => `₦${(n || 0).toLocaleString()}`

function Badge({ label, color = 'gray' }) {
  const colors = {
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    blue: 'bg-blue-100 text-blue-700',
    gray: 'bg-gray-100 text-gray-600',
    red: 'bg-red-100 text-red-600',
  }
  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${colors[color]}`}>
      {label}
    </span>
  )
}

// ─── Product Card ──────────────────────────────────────────
function ProductCard({ product }) {
  const isSold = product.stockCount === 0
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-[hsl(var(--primary))]/30 transition-all duration-300 hover:-translate-y-1 block relative"
    >
      <div className="aspect-square overflow-hidden bg-white/5 relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700 text-4xl">📦</div>
        )}
        
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.isFeatured && <Badge label="Featured" color="amber" />}
          {hasDiscount && (
            <div className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
              -{discountPercent}%
            </div>
          )}
        </div>

        {isSold ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/10 border border-white/20 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-sm">Sold Out</span>
          </div>
        ) : product.stockCount <= 3 && (
           <div className="absolute bottom-2 left-2">
             <span className="bg-red-500/90 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Only {product.stockCount} Left</span>
           </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <p className="text-xs text-gray-400 uppercase tracking-tight">{product.category}</p>
          <Badge
            label={product.condition}
            color={product.condition === 'New' ? 'green' : product.condition === 'Like New' ? 'blue' : 'gray'}
          />
        </div>
        <h3 className="text-white font-semibold text-sm truncate group-hover:text-[hsl(var(--primary))] transition-colors">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
           <p className="text-lg font-bold text-white tracking-tighter">{naira(product.price)}</p>
           {hasDiscount && (
             <p className="text-xs text-gray-500 line-through tracking-tighter">{naira(product.originalPrice)}</p>
           )}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-white/10 overflow-hidden flex items-center justify-center text-[10px] text-white shrink-0 border border-white/5">
              {product.seller?.profilePicture ? (
                <img 
                  src={urlFor(product.seller.profilePicture).url()} 
                  alt={product.seller.fullName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                product.seller?.fullName?.[0] || '?'
              )}
            </div>
            <span className="text-[10px] text-gray-400 truncate">{product.seller?.fullName}</span>
          </div>
          {product.seller?.isVerifiedSeller && (
            <span className="text-[10px] text-green-500 font-medium">Verified</span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Main Page ──────────────────────────────────────────────
export default function Marketplace() {
  const { categorySlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0 })

  // Priority: URL Param (Slug) > Search Param
  const category = (categorySlug && SLUG_MAP[categorySlug]) || searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'postedAt desc'

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const data = await getAllProducts({ category, search, sort })
        setProducts(data)
        setStats({ total: data.length })
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category, search, sort])

  const handleFilterChange = ({ search, sort }) => {
    const params = new URLSearchParams(searchParams)
    if (search) params.set('search', search)
    else params.delete('search')
    
    if (sort) params.set('sort', sort)
    else params.delete('sort')
    
    setSearchParams(params)
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header Section */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Campus Marketplace
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Buying and selling made easy for ATBU students. Find everything from gadgets to textbooks.
          </p>
        </div>

        {/* Categories Bar (Mobile Scrollable) */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <button
            onClick={() => {
              const p = new URLSearchParams(searchParams)
              p.delete('category')
              setSearchParams(p)
            }}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
              !category 
                ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white shadow-[0_0_15px_rgba(239,45,86,0.3)]' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            All Products
          </button>
          {[
            'Phones & Gadgets',
            'Fashion & Clothing',
            'Computer & Accessories',
            'Textbooks & Stationery',
            'Food & Drinks',
            'Furniture & Decor',
            'Beauty & Health',
            'Services',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                const p = new URLSearchParams(searchParams)
                p.set('category', cat)
                setSearchParams(p)
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
                category === cat 
                  ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white shadow-[0_0_15px_rgba(239,45,86,0.3)]' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="mb-8">
          <FilterBar onFilterChange={handleFilterChange} totalResults={stats.total} />
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl aspect-[4/5] animate-pulse"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 animate-fadeIn">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query.</p>
            <button
              onClick={() => setSearchParams({})}
              className="mt-6 text-[hsl(var(--primary))] font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
