// pages/ProductDetail.jsx
// Full product page with "Products You May Like" section (Jumia-style)

import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductById, getSimilarProducts, incrementViews } from '../lib/marketplaceQueries'
import { urlFor } from '../lib/sanity'
import { useAuth } from '../context/AuthContext'
import { 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Users, 
  MapPin, 
  Plus, 
  Minus, 
  Star,
  MessageCircle,
  Bookmark,
  Flag,
  ChevronRight,
  Package
} from 'lucide-react'

// ─── Helpers ────────────────────────────────────────────────
const naira = (n) => `₦${(n || 0).toLocaleString()}`

function StarRating({ rating, count }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-lg transition-colors ${i <= full ? 'text-amber-400' : i === full + 1 && half ? 'text-amber-300' : 'text-gray-200'}`}>
          ★
        </span>
      ))}
      {count !== undefined && (
        <span className="text-sm text-gray-400 ml-1">({count} reviews)</span>
      )}
    </span>
  )
}

function Badge({ label, color = 'gray' }) {
  const colors = {
    green: 'bg-green-100 text-green-700 border-green-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
    red: 'bg-red-100 text-red-600 border-red-200',
  }
  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${colors[color]}`}>
      {label}
    </span>
  )
}

// ─── Component: Why Choose Section ──────────────────────────
function WhyChooseMarketplace() {
  const items = [
    { icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />, title: 'Campus Verified', desc: 'Secure student deals' },
    { icon: <Truck className="w-5 h-5 text-indigo-600" />, title: 'Fast Delivery', desc: 'Internal logistics' },
    { icon: <CreditCard className="w-5 h-5 text-indigo-600" />, title: 'Secure Pay', desc: 'Protected payments' },
    { icon: <Users className="w-5 h-5 text-indigo-600" />, title: 'Student First', desc: 'Built for ATBU' },
    { icon: <MapPin className="w-5 h-5 text-indigo-600" />, title: 'Safe Meeting', desc: 'Verified spots' },
    { icon: <CheckCircle className="w-5 h-5 text-indigo-600" />, title: 'Authentic', desc: 'No fake items' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors">
          <div className="p-1.5 bg-white rounded-lg w-fit shadow-sm">
            {item.icon}
          </div>
          <p className="text-xs font-bold text-gray-800">{item.title}</p>
          <p className="text-[10px] text-gray-500 line-clamp-1">{item.desc}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Product Card (for "You May Like") ─────────────────────
function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-square overflow-hidden bg-gray-50">
        {product.image
          ? <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📦</div>
        }
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-800 truncate">{product.title}</p>
        <p className="text-indigo-600 font-bold mt-1 text-base">{naira(product.price)}</p>
        <div className="flex items-center justify-between mt-2">
          <Badge
            label={product.condition}
            color={product.condition === 'New' ? 'green' : product.condition === 'Like New' ? 'blue' : 'gray'}
          />
          {product.seller?.isVerifiedSeller && (
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
               <CheckCircle className="w-3 h-3" /> VERIFIED
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Review Item ────────────────────────────────────────────
function ReviewItem({ review }) {
  return (
    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold">
          {review.isAnonymous ? '?' : review.reviewer?.fullName?.[0] || '?'}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-gray-800">
              {review.isAnonymous ? 'Anonymous Student' : review.reviewer?.fullName}
              {review.isVerifiedPurchase && (
                <span className="ml-2 inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  <CheckCircle className="w-2.5 h-2.5" /> Verified Buyer
                </span>
              )}
            </p>
            <span className="text-[10px] text-gray-400 font-medium">
              {review.postedAt ? new Date(review.postedAt).toLocaleDateString() : ''}
            </span>
          </div>
          <StarRating rating={review.rating} />
          {review.comment && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  const [product, setProduct] = useState(null)
  const [similar, setSimilar] = useState([])
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  
  // Selection State
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const p = await getProductById(id)
        if (p) {
          setProduct(p)
          setActiveImage(0)
          if (p.category) {
            const sim = await getSimilarProducts(id, p.category, 8)
            setSimilar(sim)
          }
          // Increment views
          incrementViews(id)
        }
      } catch (err) {
        console.error('Failed to load product:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-medium animate-pulse">Loading amazing deal...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="text-6xl mb-6">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Expired or Missing</h2>
          <p className="text-gray-500 mb-8 font-medium">This item might have been sold or removed by the seller.</p>
          <Link 
            to="/marketplace" 
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Explore Marketplace <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  const isSold = product.status === 'sold' || product.stockCount === 0
  const avgRating = product.reviews?.reduce((s, r) => s + r.rating, 0) / (product.reviews?.length || 1) || 0
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  const handleReviewClick = () => {
    if (!isAuthenticated()) {
      // Redirect to signin with return path
      navigate('/signin', { state: { from: `/products/${id}`, showLoginAlert: true } })
    } else {
      // Open review modal logic here
      alert('Review feature coming soon! You are logged in.')
    }
  }

  const handleQuantity = (type) => {
    if (type === 'inc' && quantity < (product.stockCount || 1)) setQuantity(q => q + 1)
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="text-xs font-semibold text-gray-400 py-6 flex items-center gap-2 tracking-wide uppercase">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/marketplace" className="hover:text-indigo-600 transition-colors">Marketplace</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/marketplace?category=${encodeURIComponent(product.category)}`} className="hover:text-indigo-600 transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 truncate max-w-[150px]">{product.title}</span>
        </nav>

        {/* ── Main Layout Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          
          {/* Left Column: Visuals & Reviews */}
          <div className="space-y-8">
            
            {/* Image Gallery Container */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden p-4 sm:p-8">
              <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 mb-6 relative group">
                {product.images?.[activeImage]
                  ? <img
                      src={product.images[activeImage]}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  : <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">📦</div>
                }
                {hasDiscount && (
                  <div className="absolute top-6 left-6 bg-red-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg animate-bounce">
                    -{discountPercent}% OFF
                  </div>
                )}
              </div>
              
              {product.images?.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${
                        i === activeImage ? 'border-indigo-600 scale-105 shadow-md' : 'border-gray-100 hover:border-indigo-200'
                      }`}
                    >
                      <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Reviews (Visible under Images) */}
            <div className="hidden lg:block bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-800">Student Reviews</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={avgRating} count={product.reviews?.length || 0} />
                  </div>
                </div>
                <button 
                  onClick={handleReviewClick}
                  className="bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-700 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all"
                >
                  Write a Review
                </button>
              </div>

              {product.reviews?.length > 0 ? (
                <div className="grid gap-4">
                  {product.reviews.map((r) => (
                    <ReviewItem key={r._id} review={r} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <div className="text-4xl mb-3">⭐</div>
                  <p className="text-gray-500 font-bold">No reviews yet.</p>
                  <p className="text-sm text-gray-400">Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Details */}
          <div className="lg:sticky lg:top-24 space-y-8">
            
            {/* Main Info Card */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {product.isFeatured && <Badge label="⚡ Featured" color="amber" />}
                <Badge
                  label={product.condition}
                  color={product.condition === 'New' ? 'green' : product.condition === 'Like New' ? 'blue' : 'gray'}
                />
                {isSold ? (
                  <Badge label="Out of Stock" color="red" />
                ) : (
                   product.stockCount <= 5 && <Badge label={`Only ${product.stockCount} left!`} color="red" />
                )}
              </div>

              <h1 className="text-3xl font-black text-gray-800 leading-tight mb-2 uppercase tracking-tighter">
                {product.title}
              </h1>
              
              <div className="flex items-baseline gap-4 mt-6">
                <span className="text-4xl font-black text-indigo-600 tracking-tighter">
                  {naira(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through decoration-red-500/50 decoration-2">
                    {naira(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Variations */}
              <div className="mt-8 space-y-6">
                
                {/* Size Selection */}
                {product.sizes?.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-sm font-black text-gray-800 uppercase tracking-widest">Select Size</span>
                       <span className="text-[10px] font-bold text-gray-400">SIZE GUIDE</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                        const isAvailable = product.availableSizes?.includes(size)
                        const isSelectable = product.sizes?.includes(size)
                        
                        // We only show if it was ever listed for this product
                        if (!isSelectable) return null;

                        return (
                          <button
                            key={size}
                            disabled={!isAvailable}
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-all ${
                              selectedSize === size
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 scale-110 shadow-lg shadow-indigo-100'
                                : isAvailable
                                  ? 'border-gray-100 bg-white text-gray-700 hover:border-indigo-200'
                                  : 'border-gray-50 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50 relative overflow-hidden'
                            }`}
                          >
                            {size}
                            {!isAvailable && (
                              <div className="absolute inset-0 flex items-center justify-center rotate-45">
                                <div className="w-full h-[1px] bg-red-300"></div>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors?.length > 0 && (
                  <div>
                    <span className="text-sm font-black text-gray-800 uppercase tracking-widest block mb-3">Pick Color</span>
                    <div className="flex gap-3">
                      {product.colors.map(color => {
                        // Check if it's a hex code
                        const isHex = color.startsWith('#')
                        return (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`group relative p-1 rounded-full border-2 transition-all ${
                              selectedColor === color ? 'border-indigo-600 scale-110' : 'border-transparent'
                            }`}
                          >
                            <div 
                              className="w-8 h-8 rounded-full border border-gray-100 shadow-inner"
                              style={{ backgroundColor: isHex ? color : color.toLowerCase() }}
                              title={color}
                            />
                            {selectedColor === color && (
                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {color}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                {!isSold && (
                  <div>
                    <span className="text-sm font-black text-gray-800 uppercase tracking-widest block mb-3">Quantity</span>
                    <div className="flex items-center gap-4 bg-gray-50 w-fit rounded-2xl p-1 border border-gray-100">
                      <button 
                        onClick={() => handleQuantity('dec')}
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-700 disabled:opacity-30 shadow-sm border border-gray-100 hover:border-indigo-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-black text-gray-800">{quantity}</span>
                      <button 
                        onClick={() => handleQuantity('inc')}
                        disabled={quantity >= product.stockCount}
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-700 disabled:opacity-30 shadow-sm border border-gray-100 hover:border-indigo-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col gap-3">
                <button
                  onClick={() => setChatOpen(true)}
                  disabled={isSold}
                  className={`w-full py-5 rounded-2xl font-black text-base uppercase tracking-widest transition-all shadow-xl ${
                    isSold
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isSold ? (
                       <><Package className="w-5 h-5" /> SOLD OUT</>
                    ) : (
                      <><MessageCircle className="w-5 h-5" /> Message Seller</>
                    )}
                  </div>
                </button>
                <div className="flex gap-3">
                  <button className="flex-1 py-4 border-2 border-gray-100 rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-500 hover:border-indigo-200 hover:text-indigo-600 transition-all">
                    <Bookmark className="w-5 h-5" /> Save Item
                  </button>
                  <button className="flex-1 py-4 border-2 border-gray-100 rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-500 hover:border-red-200 hover:text-red-500 transition-all">
                    <Flag className="w-5 h-5" /> Report
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-[11px] text-amber-800 font-bold uppercase tracking-widest text-center">
                ⚠️ Always meet sellers in public campus spaces!
              </div>

            </div>

            {/* Why Choose Section */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em] mb-6 border-b border-gray-50 pb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                Why ATBU Marketplace?
              </h3>
              <WhyChooseMarketplace />
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">The Seller</h3>
               <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate(`/profile/${product.seller?._id}`)}>
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 overflow-hidden border-4 border-white shadow-xl shadow-indigo-50 flex items-center justify-center text-indigo-700 font-black text-2xl group-hover:scale-105 transition-transform">
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
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-800 text-lg group-hover:text-indigo-600 transition-colors uppercase tracking-tight truncate">
                      {product.seller?.fullName}
                    </p>
                    <p className="text-xs text-gray-400 font-bold flex items-center gap-2 flex-wrap mt-1">
                      <span>{product.seller?.department}</span>
                      <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-widest">
                         VERIFIED
                      </span>
                    </p>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* Mobile Reviews (Hidden on desktop) */}
        <div className="lg:hidden mt-8 bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-800">Student Reviews</h2>
            <button 
              onClick={handleReviewClick}
              className="text-indigo-600 text-sm font-black"
            >
              WRITE
            </button>
          </div>
          {product.reviews?.length > 0 ? (
            <div className="grid gap-4">
              {product.reviews.map((r) => (
                <ReviewItem key={r._id} review={r} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 font-bold py-8">No reviews yet.</p>
          )}
        </div>

        {/* ── Products You May Like (Full Width) ── */}
        {similar.length > 0 && (
          <div className="mt-16 bg-white rounded-[3rem] p-4 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Products You May Like</h2>
                <p className="text-gray-400 text-sm font-medium mt-1">Based on "{product.category}" category</p>
              </div>
              <Link
                to={`/marketplace?category=${encodeURIComponent(product.category)}`}
                className="bg-gray-50 border border-gray-100 px-8 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                View all items
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {similar.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Chat Modal (Connect to Conversation System) ── */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-slideUp">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                    {product.seller?.fullName?.[0]}
                 </div>
                 <div>
                    <h3 className="font-extrabold text-gray-800 uppercase tracking-tight">Chat with {product.seller?.fullName}</h3>
                    <p className="text-[10px] font-black text-gray-400 tracking-widest">{product.title}</p>
                 </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-all font-black"
              >
                ✕
              </button>
            </div>
            <div className="p-8 h-64 flex flex-col items-center justify-center text-center space-y-4 bg-gray-50/50">
              <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl">💬</div>
              <p className="text-gray-400 text-sm font-bold max-w-[200px]">Our secure chat system is launching soon! Connect directly with the seller.</p>
            </div>
            <div className="p-6 flex gap-3 bg-white">
              <input
                type="text"
                disabled
                placeholder="Coming soon…"
                className="flex-1 border border-gray-100 bg-gray-50 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none"
              />
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 opacity-50 cursor-not-allowed">
                SEND
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  )
}