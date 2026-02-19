// schemas/report.js
export default {
  name: 'report',
  title: 'Report',
  type: 'document',
  fields: [
    {
      name: 'reportedBy',
      title: 'Reported By',
      type: 'reference',
      to: [{ type: 'userProfile' }],
    },
    {
      name: 'targetType',
      title: 'What Was Reported',
      type: 'string',
      options: {
        list: ['product', 'user', 'review', 'conversation'],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'targetProduct',
      title: 'Reported Product',
      type: 'reference',
      to: [{ type: 'product' }],
      hidden: ({ document }) => document?.targetType !== 'product',
    },
    {
      name: 'targetUser',
      title: 'Reported User',
      type: 'reference',
      to: [{ type: 'userProfile' }],
      hidden: ({ document }) => document?.targetType !== 'user',
    },
    {
      name: 'targetReview',
      title: 'Reported Review',
      type: 'reference',
      to: [{ type: 'review' }],
      hidden: ({ document }) => document?.targetType !== 'review',
    },
    {
      name: 'reason',
      title: 'Reason',
      type: 'string',
      options: {
        list: [
          'Scam / Fraud',
          'Fake product',
          'Inappropriate content',
          'Spam',
          'Harassment',
          'Wrong category',
          'Other',
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'evidence',
      title: 'Evidence (screenshots)',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['pending', 'investigating', 'resolved', 'dismissed'],
      },
      initialValue: 'pending',
    },
    {
      name: 'adminNote',
      title: 'Admin Note',
      type: 'text',
      rows: 3,
    },
    {
      name: 'reportedAt',
      title: 'Reported At',
      type: 'datetime',
    },
    {
      name: 'resolvedAt',
      title: 'Resolved At',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      targetType: 'targetType',
      reason: 'reason',
      status: 'status',
    },
    prepare({ targetType, reason, status }) {
      const statusEmoji = { pending: '🔴', investigating: '🟡', resolved: '🟢', dismissed: '⚪' }
      return {
        title: `${statusEmoji[status] || ''} ${reason}`,
        subtitle: `Target: ${targetType}`,
      }
    },
  },
}