// schemas/transaction.js
export default {
  name: 'transaction',
  title: 'Transaction',
  type: 'document',
  fields: [
    {
      name: 'transactionId',
      title: 'Transaction ID',
      type: 'string',
      description: 'Paystack reference or internal ID',
      validation: Rule => Rule.required(),
    },
    {
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'buyer',
      title: 'Buyer',
      type: 'reference',
      to: [{ type: 'userProfile' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'seller',
      title: 'Seller',
      type: 'reference',
      to: [{ type: 'userProfile' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'amount',
      title: 'Total Amount (₦)',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    },
    {
      name: 'commissionRate',
      title: 'Commission Rate (%)',
      type: 'number',
      initialValue: 5,
      description: 'Platform commission percentage (5–10%)',
      validation: Rule => Rule.min(0).max(100),
    },
    {
      name: 'commissionAmount',
      title: 'Commission Amount (₦)',
      type: 'number',
      description: 'Computed: amount × commissionRate / 100',
    },
    {
      name: 'sellerPayout',
      title: 'Seller Payout (₦)',
      type: 'number',
      description: 'Amount minus commission',
    },
    {
      name: 'status',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: ['pending', 'success', 'failed', 'refunded'],
      },
      initialValue: 'pending',
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: ['paystack', 'bank_transfer', 'cash'],
      },
      initialValue: 'paystack',
    },
    {
      name: 'paystackReference',
      title: 'Paystack Reference',
      type: 'string',
    },
    {
      name: 'payoutStatus',
      title: 'Payout to Seller',
      type: 'string',
      options: {
        list: ['pending', 'paid'],
      },
      initialValue: 'pending',
    },
    {
      name: 'payoutDate',
      title: 'Payout Date',
      type: 'datetime',
    },
    {
      name: 'type',
      title: 'Transaction Type',
      type: 'string',
      options: {
        list: ['product_sale', 'featured_listing', 'premium_subscription'],
      },
      initialValue: 'product_sale',
    },
    {
      name: 'notes',
      title: 'Admin Notes',
      type: 'text',
      rows: 2,
    },
    {
      name: 'createdAt',
      title: 'Date',
      type: 'datetime',
      validation: Rule => Rule.required(),
    },
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      txId: 'transactionId',
      amount: 'amount',
      status: 'status',
      buyerName: 'buyer.fullName',
    },
    prepare({ txId, amount, status, buyerName }) {
      const statusEmoji = { success: '✅', pending: '⏳', failed: '❌', refunded: '↩️' }
      return {
        title: `${statusEmoji[status] || ''} ₦${(amount || 0).toLocaleString()}`,
        subtitle: `${txId} — ${buyerName || 'Unknown buyer'}`,
      }
    },
  },
}