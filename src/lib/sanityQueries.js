import { client } from './sanity'

/**
 * Fetch all posts by category
 * @param {string} category - announcements, events, academics, sports, entertainment
 * @returns {Promise<Array>} Array of posts
 */
export async function getPostsByCategory(category) {
  const query = `
    *[_type == "newsPost" && category == $category] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      category,
      excerpt,
      body,
      featuredImage,
      tags,
      priority,
      publishedAt,
      deadline,
      isFeatured,
      eventDate,
      eventLocation,
      eventType,
      department,
      level,
      sportType,
      matchScore,
      entertainmentType,
      "imageUrl": featuredImage.asset->url,
      "imageAlt": featuredImage.alt
    }
  `

  try {
    const posts = await client.fetch(query, { category })
    return posts
  } catch (error) {
    console.error(`Error fetching ${category} posts:`, error)
    throw error
  }
}

/**
 * Fetch single post by slug and category
 * @param {string} slug - URL slug of the post
 * @param {string} category - Post category
 * @returns {Promise<Object>} Single post object
 */
export async function getPostBySlug(slug, category) {
  const query = `
    *[_type == "newsPost" && slug.current == $slug && category == $category && status == "published"][0] {
      _id,
      title,
      "slug": slug.current,
      category,
      excerpt,
      body,
      featuredImage,
      tags,
      priority,
      publishedAt,
      deadline,
      eventDate,
      eventLocation,
      eventType,
      registrationLink,
      isFreeEvent,
      eventPrice,
      department,
      level,
      academicType,
      sportType,
      matchType,
      matchScore,
      entertainmentType,
      "imageUrl": featuredImage.asset->url,
      "imageAlt": featuredImage.alt
    }
  `

  try {
    const post = await client.fetch(query, { slug, category })
    return post
  } catch (error) {
    console.error(`Error fetching post by slug:`, error);
    throw error;
  }
}

/**
 * Fetch featured posts by category
 * @param {string} category - Post category
 * @param {number} limit - Number of posts to fetch
 * @returns {Promise<Array>} Array of featured posts
 */
export async function getFeaturedPosts(category, limit = 3) {
  const query = `
    *[_type == "newsPost" && category == $category && isFeatured == true && status == "published"] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      featuredImage,
      priority,
      publishedAt,
      "imageUrl": featuredImage.asset->url
    }
  `

  try {
    const posts = await client.fetch(query, { category, limit })
    return posts
  } catch (error) {
    console.error(`Error fetching featured posts:`, error)
    throw error
  }
}

/**
 * Fetch related posts (same category, different post)
 * @param {string} category - Post category
 * @param {string} currentPostId - Current post ID to exclude
 * @param {number} limit - Number of posts to fetch
 * @returns {Promise<Array>} Array of related posts
 */
export async function getRelatedPosts(category, currentPostId, limit = 3) {
  const query = `
    *[_type == "newsPost" && category == $category && _id != $currentPostId && status == "published"] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      featuredImage,
      publishedAt,
      "imageUrl": featuredImage.asset->url
    }
  `

  try {
    const posts = await client.fetch(query, { category, currentPostId, limit })
    return posts
  } catch (error) {
    console.error(`Error fetching related posts:`, error)
    throw error
  }
}

/**
 * Search posts across all categories or specific category
 * @param {string} searchTerm - Search term
 * @param {string|null} category - Optional category filter
 * @returns {Promise<Array>} Array of matching posts
 */
export async function searchPosts(searchTerm, category = null) {
  const categoryFilter = category ? `&& category == $category` : ''

  const query = `
    *[_type == "newsPost" ${categoryFilter} && (
      title match $searchTerm + "*" ||
      excerpt match $searchTerm + "*" ||
      pt::text(body) match $searchTerm + "*"
    )] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      category,
      excerpt,
      body,
      featuredImage,
      tags,
      publishedAt,
      priority,
      "imageUrl": featuredImage.asset->url
    }
  `

  try {
    const posts = await client.fetch(query, {
      searchTerm: `*${searchTerm}*`,
      ...(category && { category })
    })
    return posts
  } catch (error) {
    console.error(`Error searching posts:`, error);
    throw error;
  }
}

/**
 * Get post counts for all categories
 * @returns {Promise<Object>} Object with counts per category
 */
export async function getPostsCounts() {
  const query = `{
    "announcements": count(*[_type == "newsPost" && category == "announcements" && status == "published"]),
    "events": count(*[_type == "newsPost" && category == "events" && status == "published"]),
    "academics": count(*[_type == "newsPost" && category == "academics" && status == "published"]),
    "sports": count(*[_type == "newsPost" && category == "sports" && status == "published"]),
    "entertainment": count(*[_type == "newsPost" && category == "entertainment" && status == "published"]),
    "total": count(*[_type == "newsPost" && status == "published"])
  }`

  try {
    const counts = await client.fetch(query)
    return counts
  } catch (error) {
    console.error(`Error fetching post counts:`, error)
    throw error
  }
}

/**
 * Get all posts (useful for homepage/general news feed)
 * @param {number} limit - Number of posts to fetch
 * @returns {Promise<Array>} Array of posts
 */
export async function getAllPosts(limit = 20) {
  const query = `
    *[_type == "newsPost"] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      "slug": slug.current,
      category,
      excerpt,
      body,
      featuredImage,
      tags,
      priority,
      publishedAt,
      "imageUrl": featuredImage.asset->url
    }
  `

  try {
    const posts = await client.fetch(query, { limit })
    return posts
  } catch (error) {
    console.error(`Error fetching all posts:`, error);
    throw error;
  }
}
