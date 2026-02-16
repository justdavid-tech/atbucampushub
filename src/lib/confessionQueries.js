// ============================================
// FILE: src/lib/confessionQueries.js
// ============================================
// All Sanity queries for confessions

import {client} from './sanity'

/**
 * Helper: Generate Anonymous ID
 * Creates unique "Anon #XXXX" identifier
 */
export function generateAnonId() {
  const random = Math.floor(1000 + Math.random() * 9000)
  return `Anon #${random}`
}

/**
 * Helper: Get or Create Session ID
 * Stores in localStorage to track user across visits
 */
export function getSessionId() {
  let sessionId = localStorage.getItem('atbu_session_id')
  
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    localStorage.setItem('atbu_session_id', sessionId)
  }
  
  return sessionId
}

/**
 * Helper: Get Week Number
 * Returns week of year (1-52)
 */
export function getWeekNumber(date = new Date()) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

/**
 * Helper: Check if posting is allowed (Tuesday or Friday)
 */
// export function isPostingDay() {
//   const today = new Date().getDay()
//   return today === 2 || today === 5 // 2 = Tuesday, 5 = Friday
// }
export function isPostingDay() {
  return true // Always allow posting (for testing)
}

/**
 * Helper: Get next posting day
 */
export function getNextPostingDay() {
  const today = new Date()
  const currentDay = today.getDay()
  
  let daysUntilNext
  if (currentDay < 2) {
    daysUntilNext = 2 - currentDay // Until Tuesday
  } else if (currentDay < 5) {
    daysUntilNext = 5 - currentDay // Until Friday
  } else {
    daysUntilNext = (7 - currentDay) + 2 // Until next Tuesday
  }
  
  const nextDate = new Date(today)
  nextDate.setDate(today.getDate() + daysUntilNext)
  nextDate.setHours(0, 0, 0, 0)
  
  return nextDate
}

/**
 * Profanity Filter
 * Checks for inappropriate words
 */
const PROFANITY_LIST = [
  'kill', 'murder', 'stupid', 'idiot', 'fool',
  // Add more words as needed
]

export function containsProfanity(text) {
  const lowerText = text.toLowerCase()
  return PROFANITY_LIST.some(word => lowerText.includes(word))
}

/**
 * Check if user/IP is banned
 */
export async function isUserBanned(ip, sessionId) {
  const query = `
    *[_type == "bannedUser" && isActive == true && (
      ip == $ip || sessionId == $sessionId
    ) && (
      !defined(expiresAt) || expiresAt > now()
    )][0]
  `
  
  try {
    const banned = await client.fetch(query, { ip, sessionId })
    return !!banned
  } catch (error) {
    console.error('Error checking ban status:', error)
    return false
  }
}

/**
 * Fetch all approved confessions
 * @param {string} sortBy - 'latest', 'popular', 'trending'
 * @param {number} limit - Number of confessions to fetch
 */
export async function getConfessions(sortBy = 'latest', limit = 50) {
  let orderBy = 'createdAt desc'
  
  if (sortBy === 'popular') {
    orderBy = 'likes desc'
  } else if (sortBy === 'trending') {
    // Trending = high likes + recent
    orderBy = 'likes desc, createdAt desc'
  }
  
  const query = `
    *[_type == "confession" && status == "approved"] | order(${orderBy}) [0...$limit] {
      _id,
      text,
      anonId,
      likes,
      "replyCount": count(replies),
      isTopConfession,
      createdAt,
      weekNumber,
      year
    }
  `
  
  try {
    const confessions = await client.fetch(query, { limit })
    return confessions
  } catch (error) {
    console.error('Error fetching confessions:', error)
    return []
  }
}

/**
 * Fetch single confession with all replies
 */
export async function getConfessionById(confessionId) {
  const query = `
    *[_type == "confession" && _id == $confessionId && status == "approved"][0] {
      _id,
      text,
      anonId,
      likes,
      replies[] {
        text,
        anonId,
        timestamp,
        likes
      },
      isTopConfession,
      createdAt,
      weekNumber,
      year
    }
  `
  
  try {
    const confession = await client.fetch(query, { confessionId })
    return confession
  } catch (error) {
    console.error('Error fetching confession:', error)
    return null
  }
}

/**
 * Get top confession of the week
 */
export async function getTopConfession() {
  const currentWeek = getWeekNumber()
  const currentYear = new Date().getFullYear()
  
  const query = `
    *[_type == "confession" && status == "approved" && weekNumber == $week && year == $year] | order(likes desc) [0] {
      _id,
      text,
      anonId,
      likes,
      "replyCount": count(replies),
      isTopConfession,
      createdAt
    }
  `
  
  try {
    const topConfession = await client.fetch(query, { 
      week: currentWeek, 
      year: currentYear 
    })
    return topConfession
  } catch (error) {
    console.error('Error fetching top confession:', error)
    return null
  }
}

/**
 * Get confession stats
 */
export async function getConfessionStats() {
  const currentWeek = getWeekNumber()
  const currentYear = new Date().getFullYear()
  
  const query = `{
    "total": count(*[_type == "confession" && status == "approved"]),
    "thisWeek": count(*[_type == "confession" && status == "approved" && weekNumber == $week && year == $year]),
    "totalLikes": sum(*[_type == "confession" && status == "approved"].likes),
    "totalReplies": sum(*[_type == "confession" && status == "approved"]{ "count": count(replies) }.count)
  }`
  
  try {
    const stats = await client.fetch(query, { 
      week: currentWeek, 
      year: currentYear 
    })
    return stats
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      total: 0,
      thisWeek: 0,
      totalLikes: 0,
      totalReplies: 0
    }
  }
}

/**
 * Submit a new confession
 * IMPORTANT: This should be called from a serverless function for IP tracking
 * For now, we'll do client-side with limited metadata
 */
export async function submitConfession(text, metadata = {}) {
  // Check profanity
  if (containsProfanity(text)) {
    throw new Error('Your confession contains inappropriate language. Please revise.')
  }
  
  // Check posting day
  if (!isPostingDay()) {
    throw new Error('Confessions can only be posted on Tuesdays and Fridays.')
  }
  
  // Check ban status
  const sessionId = getSessionId()
  const isBanned = await isUserBanned(metadata.ip || '', sessionId)
  
  if (isBanned) {
    throw new Error('You are temporarily banned from posting.')
  }
  
  const confession = {
    _type: 'confession',
    text: text.trim(),
    anonId: generateAnonId(),
    likes: 0,
    replies: [],
    status: 'approved', // Auto-approve
    flagCount: 0,
    weekNumber: getWeekNumber(),
    year: new Date().getFullYear(),
    isTopConfession: false,
    createdAt: new Date().toISOString(),
    metadata: {
      ip: metadata.ip || 'unknown',
      userAgent: navigator.userAgent || 'unknown',
      sessionId: sessionId,
      location: metadata.location || 'unknown',
      deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
    }
  }
  
  try {
    const result = await client.create(confession)
    return result
  } catch (error) {
    console.error('Error submitting confession:', error)
    throw new Error('Failed to submit confession. Please try again.')
  }
}

/**
 * Like a confession
 * Uses localStorage to prevent duplicate likes from same device
 */
export async function likeConfession(confessionId) {
  // Check if already liked
  const likedKey = `liked_confession_${confessionId}`
  if (localStorage.getItem(likedKey)) {
    throw new Error('You already liked this confession')
  }
  
  try {
    // Increment like count in Sanity
    await client
      .patch(confessionId)
      .setIfMissing({ likes: 0 })
      .inc({ likes: 1 })
      .commit()
    
    // Mark as liked locally
    localStorage.setItem(likedKey, 'true')
    
    return true
  } catch (error) {
    console.error('Error liking confession:', error)
    throw new Error('Failed to like confession')
  }
}

/**
 * Unlike a confession
 */
export async function unlikeConfession(confessionId) {
  const likedKey = `liked_confession_${confessionId}`
  
  if (!localStorage.getItem(likedKey)) {
    throw new Error('You haven\'t liked this confession')
  }
  
  try {
    await client
      .patch(confessionId)
      .dec({ likes: 1 })
      .commit()
    
    localStorage.removeItem(likedKey)
    return true
  } catch (error) {
    console.error('Error unliking confession:', error)
    throw new Error('Failed to unlike confession')
  }
}

/**
 * Check if user has liked a confession
 */
export function hasLikedConfession(confessionId) {
  return !!localStorage.getItem(`liked_confession_${confessionId}`)
}

/**
 * Submit a reply to confession
 */
export async function submitReply(confessionId, replyText, metadata = {}) {
  if (containsProfanity(replyText)) {
    throw new Error('Your reply contains inappropriate language.')
  }
  
  const sessionId = getSessionId()
  const isBanned = await isUserBanned(metadata.ip || '', sessionId)
  
  if (isBanned) {
    throw new Error('You are temporarily banned from replying.')
  }
  
  const reply = {
    text: replyText.trim(),
    anonId: generateAnonId(),
    timestamp: new Date().toISOString(),
    likes: 0,
    metadata: {
      ip: metadata.ip || 'unknown',
      userAgent: navigator.userAgent || 'unknown',
      sessionId: sessionId,
      location: metadata.location || 'unknown'
    }
  }
  
  try {
    await client
      .patch(confessionId)
      .setIfMissing({ replies: [] })
      .append('replies', [reply])
      .commit()
    
    return reply
  } catch (error) {
    console.error('Error submitting reply:', error)
    throw new Error('Failed to submit reply')
  }
}

/**
 * Flag/Report a confession
 */
export async function flagConfession(confessionId) {
  try {
    await client
      .patch(confessionId)
      .inc({ flagCount: 1 })
      .commit()
    
    // If flagged 5+ times, auto-change status to flagged
    const confession = await getConfessionById(confessionId)
    if (confession && confession.flagCount >= 5) {
      await client
        .patch(confessionId)
        .set({ status: 'flagged' })
        .commit()
    }
    
    return true
  } catch (error) {
    console.error('Error flagging confession:', error)
    throw new Error('Failed to report confession')
  }
}