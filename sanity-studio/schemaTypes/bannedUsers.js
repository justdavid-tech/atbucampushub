// ============================================
// FILE: sanity-studio/schemas/bannedUser.js
// ============================================
// Schema for tracking banned IPs/Sessions

export const bannedUser = {
  name: 'bannedUser',
  title: 'Banned Users',
  type: 'document',
  
  fields: [
    {
      name: 'ip',
      title: 'IP Address',
      type: 'string',
      description: 'IP address to ban'
    },
    {
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      description: 'Session ID to ban'
    },
    {
      name: 'reason',
      title: 'Ban Reason',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'bannedAt',
      title: 'Banned Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'bannedBy',
      title: 'Banned By',
      type: 'string',
      description: 'Admin who banned this user'
    },
    {
      name: 'expiresAt',
      title: 'Ban Expires',
      type: 'datetime',
      description: 'Leave empty for permanent ban'
    },
    {
      name: 'isActive',
      title: 'Ban Active',
      type: 'boolean',
      initialValue: true
    }
  ],
  
  preview: {
    select: {
      ip: 'ip',
      reason: 'reason',
      bannedAt: 'bannedAt'
    },
    prepare(selection) {
      const {ip, reason, bannedAt} = selection
      return {
        title: `🚫 ${ip || 'Unknown'}`,
        subtitle: `${reason} • ${new Date(bannedAt).toLocaleDateString()}`
      }
    }
  }
}
