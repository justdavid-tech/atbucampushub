export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required(),
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 5,
            validation: Rule => Rule.required(),
        },
        {
            name: 'price',
            title: 'Price (₦)',
            type: 'number',
            validation: Rule => Rule.required().min(0),
        },
        {
            name: 'images',
            title: 'Product Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            validation: Rule => Rule.required().min(1).max(5),
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    'Phones & Gadgets',
                    'Fashion & Clothing',
                    'Computer & Accessories',
                    'Textbooks & Stationery',
                    'Food & Drinks',
                    'Furniture & Decor',
                    'Beauty & Health',
                    'Sports & Fitness',
                    'Services',
                    'Other'
                ],
            },
            validation: Rule => Rule.required(),
        },
        {
            name: 'condition',
            title: 'Condition',
            type: 'string',
            options: {
                list: ['New', 'Like New', 'Used - Good', 'Used - Fair'],
            },
            initialValue: 'Used - Good',
        },
        {
            name: 'location',
            title: 'Location (e.g. Yelwa Campus, Gubi Campus)',
            type: 'string',
            initialValue: 'Gubi Campus',
        },
        {
            name: 'status',
            title: 'Stock Status',
            type: 'string',
            options: {
                list: ['available', 'pending', 'sold'],
            },
            initialValue: 'available',
        },
        {
            name: 'seller',
            title: 'Seller',
            type: 'reference',
            to: [{ type: 'userProfile' }],
            validation: Rule => Rule.required(),
        },
        {
            name: 'isFeatured',
            title: 'Featured Listing',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'featuredUntil',
            title: 'Featured Until',
            type: 'datetime',
            hidden: ({ document }) => !document?.isFeatured,
        },
        {
            name: 'isFlagged',
            title: 'Flagged (Admin)',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'isHidden',
            title: 'Hidden/Removed',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'views',
            title: 'Views',
            type: 'number',
            initialValue: 0,
        },
        {
            name: 'saves',
            title: 'Saves',
            type: 'number',
            initialValue: 0,
        },
        {
            name: 'originalPrice',
            title: 'Original Price (₦) - For Discount',
            type: 'number',
            description: 'If set, this will show as a strikethrough price to indicate a discount.',
        },
        {
            name: 'stockCount',
            title: 'Stock Count',
            type: 'number',
            initialValue: 1,
            validation: Rule => Rule.required().min(0),
        },
        {
            name: 'sizes',
            title: 'Sizes',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'S', value: 'S' },
                    { title: 'M', value: 'M' },
                    { title: 'L', value: 'L' },
                    { title: 'XL', value: 'XL' },
                    { title: 'XXL', value: 'XXL' },
                ],
            },
        },
        {
            name: 'availableSizes',
            title: 'Currently Available Sizes',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'S', value: 'S' },
                    { title: 'M', value: 'M' },
                    { title: 'L', value: 'L' },
                    { title: 'XL', value: 'XL' },
                    { title: 'XXL', value: 'XXL' },
                ],
            },
            description: 'Sizes that are currently in stock.',
        },
        {
            name: 'colors',
            title: 'Available Colors',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Add color names or hex codes (e.g. "Red", "#FF0000").',
        },
        {
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        },
        {
            name: 'postedAt',
            title: 'Date Posted',
            type: 'datetime',
            initialValue: (new Date()).toISOString(),
        },
    ],
    preview: {
        select: {
            title: 'title',
            price: 'price',
            media: 'images.0',
            seller: 'seller.fullName',
        },
        prepare({ title, price, media, seller }) {
            return {
                title,
                subtitle: `₦${(price || 0).toLocaleString()} — Seller: ${seller || 'Unknown'}`,
                media,
            }
        },
    },
}
