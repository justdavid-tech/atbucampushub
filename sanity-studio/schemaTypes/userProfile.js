// schemas/userProfile.js
export default {
  name: 'userProfile',
  title: 'User Profile',
  type: 'document',
  fields: [
    // Basic Info
    {
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'department',
      title: 'Department',
      type: 'string',
    },
    {
      name: 'level',
      title: 'Level',
      type: 'string',
      options: {
        list: ['100L', '200L', '300L', '400L', '500L', 'Postgrad'],
      },
    },
    {
      name: 'profilePicture',
      title: 'Profile Picture',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
    },
    // Limits & Permissions
    {
      name: 'productLimit',
      title: 'Product Limit',
      type: 'number',
      description: 'Max products user can list (default 5). Admin can increase.',
      initialValue: 5,
      validation: Rule => Rule.required().min(0),
    },
    {
      name: 'totalProductsPosted',
      title: 'Total Products Posted',
      type: 'number',
      initialValue: 0,
    },
    // Status
    {
      name: 'isVerifiedSeller',
      title: 'Verified Seller',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'verificationStatus',
      title: 'Verification Request Status',
      type: 'string',
      options: {
        list: ['none', 'pending', 'approved', 'rejected'],
      },
      initialValue: 'none',
    },
    {
      name: 'isPremium',
      title: 'Premium Member',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'premiumExpiresAt',
      title: 'Premium Expires At',
      type: 'datetime',
    },
    {
      name: 'isBanned',
      title: 'Banned',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'banReason',
      title: 'Ban Reason',
      type: 'string',
    },
    // Stats
    {
      name: 'totalSales',
      title: 'Total Sales',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'rating',
      title: 'Average Rating',
      type: 'number',
      initialValue: 0,
      validation: Rule => Rule.min(0).max(5),
    },
    {
      name: 'ratingCount',
      title: 'Number of Ratings',
      type: 'number',
      initialValue: 0,
    },
    // Auth
    {
      name: 'uid',
      title: 'Auth UID',
      description: 'Firebase/Supabase/Auth user ID',
      type: 'string',
    },
    {
      name: 'joinedAt',
      title: 'Join Date',
      type: 'datetime',
    },
    {
      name: 'lastLogin',
      title: 'Last Login',
      type: 'datetime',
    },
    // Hidden Metadata (admin only)
    {
      name: 'metadata',
      title: 'Metadata (Admin)',
      type: 'object',
      fields: [
        { name: 'ipAddress', title: 'IP Address', type: 'string' },
        { name: 'sessionId', title: 'Session ID', type: 'string' },
        { name: 'location', title: 'Location', type: 'string' },
        { name: 'deviceType', title: 'Device Type', type: 'string' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'email',
      media: 'profilePicture',
    },
  },
}