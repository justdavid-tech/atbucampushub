// lib/marketplaceQueries.js
import { client } from './sanity'

// ─── PRODUCTS ───────────────────────────────────────────────

// Fetch all available products (with seller info)
export const getAllProducts = async ({ category, search, sort = 'postedAt desc' } = {}) => {
  const categoryFilter = category ? `&& category == "${category}"` : ''
  const searchFilter = search
    ? `&& (title match "*${search}*" || description match "*${search}*")`
    : ''

  return client.fetch(`
    *[_type == "product" && status == "available" && isHidden != true
      ${categoryFilter}
      ${searchFilter}
    ] | order(${sort}) {
      _id,
      price,
      originalPrice,
      stockCount,
      "image": images[0].asset->url,
      category,
      condition,
      location,
      isFeatured,
      views,
      saves,
      postedAt,
      "seller": seller->{fullName, profilePicture, isVerifiedSeller, rating}
    }
  `)
}

// Fetch single product by id
export const getProductById = async (id) => {
  return client.fetch(`
    *[_type == "product" && _id == $id][0] {
      _id,
      title,
      description,
      price,
      originalPrice,
      stockCount,
      sizes,
      availableSizes,
      colors,
      "images": images[].asset->url,
      category,
      condition,
      location,
      status,
      isFeatured,
      views,
      saves,
      postedAt,
      tags,
      "seller": seller->{
        _id,
        fullName,
        profilePicture,
        department,
        level,
        isVerifiedSeller,
        rating,
        ratingCount,
        totalSales
      },
      "reviews": *[_type == "review" && product._ref == $id && status == "approved"] | order(postedAt desc) {
        _id,
        rating,
        comment,
        isAnonymous,
        isVerifiedPurchase,
        postedAt,
        "reviewer": reviewer->{ fullName, profilePicture }
      }
    }
  `, { id })
}

// "Products You May Like" — same category, exclude current product
export const getSimilarProducts = async (productId, category, limit = 6) => {
  return client.fetch(`
    *[_type == "product"
      && _id != $productId
      && category == $category
      && status == "available"
      && isHidden != true
    ] | order(_createdAt desc) [0...$limit] {
      _id,
      title,
      price,
      condition,
      "image": images[0].asset->url,
      "seller": seller->{ fullName, isVerifiedSeller }
    }
  `, { productId, category, limit })
}

// Fetch featured products
export const getFeaturedProducts = async () => {
  const now = new Date().toISOString()
  return client.fetch(`
    *[_type == "product" && isFeatured == true && featuredUntil > $now && isHidden != true]
    | order(postedAt desc) {
      _id,
      title,
      price,
      "image": images[0].asset->url,
      category,
      condition,
      "seller": seller->{ fullName, isVerifiedSeller }
    }
  `, { now })
}

// ─── ADMIN ANALYTICS ────────────────────────────────────────

export const getAdminStats = async () => {
  const [users, products, transactions, reviews, reports] = await Promise.all([
    // Users
    client.fetch(`{
      "total": count(*[_type == "userProfile"]),
      "banned": count(*[_type == "userProfile" && isBanned == true]),
      "premium": count(*[_type == "userProfile" && isPremium == true]),
      "verified": count(*[_type == "userProfile" && isVerifiedSeller == true]),
      "pendingVerification": count(*[_type == "userProfile" && verificationStatus == "pending"])
    }`),

    // Products
    client.fetch(`{
      "total": count(*[_type == "product"]),
      "available": count(*[_type == "product" && status == "available"]),
      "sold": count(*[_type == "product" && status == "sold"]),
      "featured": count(*[_type == "product" && isFeatured == true]),
      "flagged": count(*[_type == "product" && isFlagged == true]),
      "byCategory": *[_type == "product"] {category} | group by @.category
    }`),

    // Transactions / Revenue
    client.fetch(`{
      "total": count(*[_type == "transaction"]),
      "success": count(*[_type == "transaction" && status == "success"]),
      "totalRevenue": math::sum(*[_type == "transaction" && status == "success"].amount),
      "totalCommission": math::sum(*[_type == "transaction" && status == "success"].commissionAmount),
      "pendingPayouts": count(*[_type == "transaction" && status == "success" && payoutStatus == "pending"])
    }`),

    // Reviews
    client.fetch(`{
      "total": count(*[_type == "review"]),
      "pending": count(*[_type == "review" && status == "pending"]),
      "flagged": count(*[_type == "review" && isFlagged == true])
    }`),

    // Reports
    client.fetch(`{
      "total": count(*[_type == "report"]),
      "pending": count(*[_type == "report" && status == "pending"]),
      "investigating": count(*[_type == "report" && status == "investigating"])
    }`),
  ])

  return { users, products, transactions, reviews, reports }
}

// Top sellers
export const getTopSellers = async (limit = 5) => {
  return client.fetch(`
    *[_type == "userProfile"] | order(totalSales desc) [0...$limit] {
      _id,
      fullName,
      profilePicture,
      totalSales,
      rating,
      department
    }
  `, { limit })
}

// Most viewed products
export const getMostViewedProducts = async (limit = 5) => {
  return client.fetch(`
    *[_type == "product"] | order(views desc) [0...$limit] {
      _id,
      title,
      views,
      saves,
      "image": images[0].asset->url,
      "seller": seller->{ fullName }
    }
  `, { limit })
}

// Revenue over last 30 days (grouped by day — best done via backend/Edge Function)
export const getRecentTransactions = async (limit = 10) => {
  return client.fetch(`
    *[_type == "transaction"] | order(createdAt desc) [0...$limit] {
      _id,
      transactionId,
      amount,
      commissionAmount,
      status,
      payoutStatus,
      type,
      createdAt,
      "buyer": buyer->{ fullName },
      "seller": seller->{ fullName },
      "product": product->{ title }
    }
  `, { limit })
}

// Product category breakdown
export const getCategoryBreakdown = async () => {
  return client.fetch(`
    *[_type == "product"] {
      category
    }
  `)
}

// Increment product views
export const incrementViews = async (id) => {
  try {
    return await client
      .patch(id)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit()
  } catch (err) {
    console.error('Failed to increment views:', err)
  }
}