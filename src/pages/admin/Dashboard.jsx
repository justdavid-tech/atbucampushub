// pages/admin/Dashboard.jsx
// Full Admin Analytics Dashboard for AtbuCampusHub Marketplace

import { useEffect, useState } from 'react'
import { getAdminStats, getTopSellers, getMostViewedProducts, getRecentTransactions } from '../../lib/marketplaceQueries'

// ─── Helpers ────────────────────────────────────────────────
const naira = (n) => `₦${(n || 0).toLocaleString()}`
const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) + '%' : '0%')

// ─── Sub-components ─────────────────────────────────────────

function StatCard({ label, value, sub, color = 'indigo', icon }) {
  const colors = {
    indigo: 'bg-indigo-600',
    green: 'bg-green-600',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    purple: 'bg-purple-600',
    sky: 'bg-sky-500',
  }
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
      <div className={`${colors[color]} w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <h2 className="text-lg font-bold text-gray-700 mt-8 mb-3 border-b border-gray-200 pb-2">
      {title}
    </h2>
  )
}

function Badge({ label, type = 'default' }) {
  const styles = {
    success: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700',
    default: 'bg-gray-100 text-gray-700',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[type] || styles.default}`}>
      {label}
    </span>
  )
}

// Mini bar chart (CSS only)
function MiniBar({ label, value, max, color = '#6366f1' }) {
  const width = max ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-44 truncate text-gray-600">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-8 text-right text-gray-500 font-medium">{value}</span>
    </div>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [sellers, setSellers] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [s, sel, prod, tx] = await Promise.all([
          getAdminStats(),
          getTopSellers(5),
          getMostViewedProducts(5),
          getRecentTransactions(10),
        ])
        setStats(s)
        setSellers(sel)
        setTopProducts(prod)
        setTransactions(tx)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading analytics…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="font-semibold">Failed to load dashboard</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { users, products, transactions: txStats, reviews, reports } = stats

  // Category breakdown (computed from raw data)
  const CATEGORIES = [
    'Phones & Gadgets',
    'Fashion & Clothing',
    'Computer & Accessories',
    'Textbooks & Stationery',
    'Food & Drinks',
    'Furniture & Decor',
    'Beauty & Health',
    'Sports & Fitness',
    'Services',
    'Other',
  ]

  const txStatusBadge = (s) => {
    const m = { success: 'success', pending: 'pending', failed: 'failed', refunded: 'default' }
    return m[s] || 'default'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">📊 Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">AtbuCampusHub Marketplace · Last updated just now</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 shadow-sm hover:bg-gray-50 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* ── Users Overview ── */}
      <SectionHeader title="👥 Users" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Users" value={users.total} icon="👤" color="indigo" />
        <StatCard label="Premium" value={users.premium} icon="⭐" color="amber" />
        <StatCard label="Verified Sellers" value={users.verified} icon="✅" color="green" />
        <StatCard label="Pending Verification" value={users.pendingVerification} icon="⏳" color="sky" />
        <StatCard label="Banned" value={users.banned} icon="🚫" color="red" />
      </div>

      {/* ── Products Overview ── */}
      <SectionHeader title="🛍️ Products" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Listed" value={products.total} icon="📦" color="indigo" />
        <StatCard label="Available" value={products.available} icon="🟢" color="green"
          sub={pct(products.available, products.total) + ' of total'} />
        <StatCard label="Sold" value={products.sold} icon="🏷️" color="sky" />
        <StatCard label="Featured" value={products.featured} icon="⚡" color="amber" />
        <StatCard label="Flagged" value={products.flagged} icon="🚩" color="red" />
      </div>

      {/* ── Revenue Overview ── */}
      <SectionHeader title="💰 Revenue & Transactions" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={naira(txStats.totalRevenue)} icon="💵" color="green" />
        <StatCard label="Commission Earned" value={naira(txStats.totalCommission)} icon="📈" color="indigo"
          sub={pct(txStats.totalCommission, txStats.totalRevenue) + ' of revenue'} />
        <StatCard label="Successful Transactions" value={txStats.success} icon="✅" color="sky" />
        <StatCard label="Pending Payouts" value={txStats.pendingPayouts} icon="⏳" color="amber" />
      </div>

      {/* ── Reviews & Reports ── */}
      <SectionHeader title="⭐ Reviews & 🚫 Reports" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Reviews" value={reviews.total} icon="⭐" color="amber" />
        <StatCard label="Pending Approval" value={reviews.pending} icon="📝" color="sky" />
        <StatCard label="Flagged Reviews" value={reviews.flagged} icon="🚩" color="red" />
        <StatCard label="Open Reports" value={reports.pending + reports.investigating} icon="⚠️" color="red"
          sub={`${reports.pending} new · ${reports.investigating} investigating`} />
      </div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

        {/* Top Sellers */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            🏆 Top Sellers
          </h3>
          <div className="space-y-4">
            {sellers.length === 0 && <p className="text-gray-400 text-sm">No data yet</p>}
            {sellers.map((s, i) => (
              <div key={s._id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-300 w-5">{i + 1}</span>
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                  {s.fullName?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{s.fullName}</p>
                  <p className="text-xs text-gray-400">{s.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{s.totalSales} sales</p>
                  <p className="text-xs text-amber-500">⭐ {(s.rating || 0).toFixed(1)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Viewed Products */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            👁️ Most Viewed Products
          </h3>
          <div className="space-y-3">
            {topProducts.length === 0 && <p className="text-gray-400 text-sm">No data yet</p>}
            {topProducts.map((p) => (
              <div key={p._id} className="flex items-center gap-3">
                {p.image
                  ? <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                  : <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-gray-300">📦</div>
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.seller?.fullName}</p>
                </div>
                <div className="text-right text-xs text-gray-500 shrink-0">
                  <p>👁 {p.views}</p>
                  <p>🔖 {p.saves}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Panel */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="font-bold text-gray-700 mb-4">⚡ Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: '👤 Manage Users', href: '/admin/users' },
              { label: '🛍️ Manage Products', href: '/admin/products' },
              { label: '⭐ Review Moderation', href: '/admin/reviews', badge: reviews.pending },
              { label: '🚫 Reports', href: '/admin/reports', badge: reports.pending },
              { label: '💰 Transactions', href: '/admin/transactions', badge: txStats.pendingPayouts },
              { label: '💬 Chat Monitor', href: '/admin/chats' },
              { label: '⚡ Featured Listings', href: '/admin/featured' },
              { label: '📊 Export Data', href: '/admin/export' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-indigo-50 transition group"
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">
                  {item.label}
                </span>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Transactions Table ── */}
      <SectionHeader title="🧾 Recent Transactions" />
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 text-left">Transaction ID</th>
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Buyer</th>
                <th className="px-5 py-3 text-left">Seller</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-right">Commission</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-center">Payout</th>
                <th className="px-5 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-gray-400 py-8">No transactions yet</td>
                </tr>
              )}
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{tx.transactionId?.slice(0, 12)}…</td>
                  <td className="px-5 py-3 text-gray-700 max-w-[140px] truncate">{tx.product?.title}</td>
                  <td className="px-5 py-3 text-gray-600">{tx.buyer?.fullName}</td>
                  <td className="px-5 py-3 text-gray-600">{tx.seller?.fullName}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-800">{naira(tx.amount)}</td>
                  <td className="px-5 py-3 text-right text-green-600">{naira(tx.commissionAmount)}</td>
                  <td className="px-5 py-3 text-center">
                    <Badge label={tx.status} type={txStatusBadge(tx.status)} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Badge
                      label={tx.payoutStatus || 'pending'}
                      type={tx.payoutStatus === 'paid' ? 'success' : 'pending'}
                    />
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-400">Showing last 10 transactions</p>
          <a href="/admin/transactions" className="text-xs text-indigo-600 hover:underline">
            View all →
          </a>
        </div>
      </div>

      <p className="text-center text-xs text-gray-300 mt-10 pb-6">
        AtbuCampusHub Admin · Powered by Sanity CMS
      </p>
    </div>
  )
}