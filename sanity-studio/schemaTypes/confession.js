// ============================================
// FILE: sanity-studio/schemas/confession.js
// ============================================
// Add this to your Sanity schemas folder

export default {
  name: 'confession',
  title: 'Confessions',
  type: 'document',
  
  fields: [
    // ===== CONFESSION CONTENT =====
    {
      name: 'text',
      title: 'Confession Text',
      type: 'text',
      description: 'The confession content',
      validation: Rule => Rule.required().min(10).max(500)
    },
    
    {
      name: 'anonId',
      title: 'Anonymous ID',
      type: 'string',
      description: 'Anonymous identifier (e.g., Anon #4582)',
      validation: Rule => Rule.required()
    },
    
    // ===== ENGAGEMENT METRICS =====
    {
      name: 'likes',
      title: 'Likes Count',
      type: 'number',
      initialValue: 0,
      validation: Rule => Rule.required().min(0)
    },
    
    {
      name: 'replies',
      title: 'Replies',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'text',
            title: 'Reply Text',
            type: 'text',
            validation: Rule => Rule.required().max(300)
          },
          {
            name: 'anonId',
            title: 'Anonymous ID',
            type: 'string',
            description: 'e.g., Anon #7291'
          },
          {
            name: 'timestamp',
            title: 'Reply Time',
            type: 'datetime'
          },
          {
            name: 'likes',
            title: 'Reply Likes',
            type: 'number',
            initialValue: 0
          },
          // Hidden metadata for admin tracking
          {
            name: 'metadata',
            title: 'Metadata (Admin Only)',
            type: 'object',
            fields: [
              {
                name: 'ip',
                title: 'IP Address',
                type: 'string'
              },
              {
                name: 'userAgent',
                title: 'Browser Info',
                type: 'string'
              },
              {
                name: 'sessionId',
                title: 'Session ID',
                type: 'string'
              },
              {
                name: 'location',
                title: 'Approximate Location',
                type: 'string'
              }
            ]
          }
        ],
        preview: {
          select: {
            text: 'text',
            anonId: 'anonId',
            timestamp: 'timestamp'
          },
          prepare(selection) {
            const {text, anonId, timestamp} = selection
            return {
              title: `${anonId}: ${text.substring(0, 50)}...`,
              subtitle: new Date(timestamp).toLocaleString()
            }
          }
        }
      }]
    },
    
    // ===== STATUS & MODERATION =====
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: '✅ Approved', value: 'approved'},
          {title: '📝 Pending', value: 'pending'},
          {title: '❌ Rejected', value: 'rejected'},
          {title: '🚫 Flagged', value: 'flagged'}
        ],
        layout: 'radio'
      },
      initialValue: 'approved', // Auto-approve
      validation: Rule => Rule.required()
    },
    
    {
      name: 'flagCount',
      title: 'Times Flagged',
      type: 'number',
      initialValue: 0,
      description: 'Number of times users reported this confession'
    },
    
    {
      name: 'moderatorNotes',
      title: 'Moderator Notes',
      type: 'text',
      description: 'Internal notes about this confession'
    },
    
    // ===== WEEKLY TRACKING =====
    {
      name: 'weekNumber',
      title: 'Week Number',
      type: 'number',
      description: 'Week of the year (1-52)',
      validation: Rule => Rule.required()
    },
    
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Year posted',
      validation: Rule => Rule.required()
    },
    
    {
      name: 'isTopConfession',
      title: 'Top Confession',
      type: 'boolean',
      description: 'Mark as top confession of the week',
      initialValue: false
    },
    
    // ===== TIMESTAMPS =====
    {
      name: 'createdAt',
      title: 'Posted At',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    
    // ===== HIDDEN METADATA (Admin Only) =====
    {
      name: 'metadata',
      title: 'Metadata (Admin Only - DO NOT SHARE)',
      type: 'object',
      description: '🔒 CONFIDENTIAL: IP tracking for moderation',
      fields: [
        {
          name: 'ip',
          title: 'IP Address',
          type: 'string',
          description: 'User IP address'
        },
        {
          name: 'userAgent',
          title: 'Browser/Device Info',
          type: 'string'
        },
        {
          name: 'sessionId',
          title: 'Session ID',
          type: 'string',
          description: 'Unique session identifier'
        },
        {
          name: 'location',
          title: 'Approximate Location',
          type: 'string',
          description: 'City/Region from IP'
        },
        {
          name: 'deviceType',
          title: 'Device Type',
          type: 'string',
          options: {
            list: ['Mobile', 'Desktop', 'Tablet', 'Unknown']
          }
        }
      ]
    }
  ],
  
  // ===== PREVIEW CONFIGURATION =====
  preview: {
    select: {
      text: 'text',
      anonId: 'anonId',
      likes: 'likes',
      status: 'status',
      createdAt: 'createdAt',
      isTop: 'isTopConfession'
    },
    prepare(selection) {
      const {text, anonId, likes, status, createdAt, isTop} = selection
      
      const statusIcons = {
        'approved': '✅',
        'pending': '📝',
        'rejected': '❌',
        'flagged': '🚫'
      }
      
      const topBadge = isTop ? '👑 ' : ''
      const date = new Date(createdAt).toLocaleDateString()
      
      return {
        title: `${topBadge}${anonId}: ${text.substring(0, 60)}...`,
        subtitle: `${statusIcons[status]} ${status} • ❤️ ${likes} likes • ${date}`
      }
    }
  },
  
  // ===== ORDERING =====
  orderings: [
    {
      title: 'Most Recent',
      name: 'createdAtDesc',
      by: [
        {field: 'createdAt', direction: 'desc'}
      ]
    },
    {
      title: 'Most Liked',
      name: 'likesDesc',
      by: [
        {field: 'likes', direction: 'desc'}
      ]
    },
    {
      title: 'Most Flagged',
      name: 'flaggedDesc',
      by: [
        {field: 'flagCount', direction: 'desc'}
      ]
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [
        {field: 'status', direction: 'asc'},
        {field: 'createdAt', direction: 'desc'}
      ]
    }
  ]
}