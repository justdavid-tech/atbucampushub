// schemas/review.js
export default {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    {
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'reviewer',
      title: 'Reviewer',
      type: 'reference',
      to: [{ type: 'userProfile' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5).integer(),
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'text',
      rows: 4,
    },
    {
      name: 'photos',
      title: 'Review Photos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: Rule => Rule.max(3),
    },
    {
      name: 'isAnonymous',
      title: 'Anonymous Review',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'isVerifiedPurchase',
      title: 'Verified Purchase',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['pending', 'approved', 'rejected'],
      },
      initialValue: 'pending',
    },
    {
      name: 'isFlagged',
      title: 'Flagged as Spam',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'adminReply',
      title: 'Admin Reply',
      type: 'text',
      rows: 3,
    },
    {
      name: 'postedAt',
      title: 'Posted At',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      productTitle: 'product.title',
      reviewerName: 'reviewer.fullName',
      rating: 'rating',
    },
    prepare({ productTitle, reviewerName, rating }) {
      const stars = '⭐'.repeat(rating || 0)
      return {
        title: `${stars} — ${productTitle || 'Unknown Product'}`,
        subtitle: `by ${reviewerName || 'Anonymous'}`,
      }
    },
  },
}