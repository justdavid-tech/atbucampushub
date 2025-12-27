// schemas/newsPost.js
// Complete Sanity CMS Schema for ATBU CampusHub News System

export default {
  name: 'newsPost',
  title: 'News Posts',
  type: 'document',

  // ========== FIELDS ==========
  fields: [

    // ===== BASIC INFORMATION (REQUIRED FOR ALL) =====
    {
      name: 'title',
      title: 'Post Title',
      type: 'string',
      description: 'Main headline for your post',
      validation: Rule => Rule.required().min(10).max(100).warning('Title should be between 10-100 characters')
    },

    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Click "Generate" to create URL from title',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .slice(0, 96)
      },
      validation: Rule => Rule.required()
    },

    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Select the appropriate category for this post',
      options: {
        list: [
          { title: ' Announcements', value: 'announcements' },
          { title: ' Events', value: 'events' },
          { title: ' Academics', value: 'academics' },
          { title: ' Sports', value: 'sports' },
          { title: ' Entertainment', value: 'entertainment' }
        ],
        layout: 'dropdown'
      },
      validation: Rule => Rule.required()
    },

    // ===== CONTENT =====
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Main image for this post (recommended: 1200x630px)',
      options: {
        hotspot: true, // Allows image cropping
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Describe the image for accessibility',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },

    {
      name: 'excerpt',
      title: 'Short Preview',
      type: 'text',
      rows: 4,
      description: 'Brief summary shown on cards (150-200 characters)',
      validation: Rule => Rule.required().min(100).max(250)
    },

    {
      name: 'body',
      title: 'Full Content',
      type: 'array',
      description: 'Main content of your post',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 1', value: 'h1' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' }
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: Rule => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              validation: Rule => Rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        }
      ],
      validation: Rule => Rule.required()
    },

    // ===== ORGANIZATION & FILTERING =====
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      description: 'Add relevant keywords (e.g., exams, urgent, registration)',
      validation: Rule => Rule.max(10)
    },

    {
      name: 'isFeatured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Pin this post to the top of the category',
      initialValue: false
    },

    // ===== ANNOUNCEMENTS SPECIFIC =====
    {
      name: 'priority',
      title: 'Priority Level',
      type: 'string',
      description: 'How urgent is this announcement?',
      options: {
        list: [
          { title: '🔴 Urgent - Immediate attention needed', value: 'urgent' },
          { title: '🟡 Important - Should be read soon', value: 'important' },
          { title: '⚪ Normal - Regular announcement', value: 'normal' }
        ],
        layout: 'radio'
      },
      initialValue: 'normal',
      hidden: ({ document }) => document?.category !== 'announcements'
    },

    {
      name: 'deadline',
      title: 'Deadline (if applicable)',
      type: 'datetime',
      description: 'When does this announcement expire or have a deadline?',
      hidden: ({ document }) => document?.category !== 'announcements'
    },

    // ===== EVENTS SPECIFIC =====
    {
      name: 'eventDate',
      title: 'Event Date & Time',
      type: 'datetime',
      description: 'When will this event take place?',
      validation: Rule => Rule.custom((eventDate, context) => {
        if (context.document.category === 'events' && !eventDate) {
          return 'Event date is required for events'
        }
        return true
      }),
      hidden: ({ document }) => document?.category !== 'events'
    },

    {
      name: 'eventEndDate',
      title: 'Event End Date (Optional)',
      type: 'datetime',
      description: 'For multi-day events',
      hidden: ({ document }) => document?.category !== 'events'
    },

    {
      name: 'eventLocation',
      title: 'Event Location',
      type: 'string',
      description: 'Where will this event happen?',
      placeholder: 'e.g., Main Auditorium, ATBU Stadium, Online',
      hidden: ({ document }) => document?.category !== 'events'
    },

    {
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: ' Cultural', value: 'cultural' },
          { title: ' Academic', value: 'academic' },
          { title: ' Sports', value: 'sports' },
          { title: ' Social', value: 'social' },
          { title: ' Career/Workshop', value: 'career' },
          { title: ' Competition', value: 'competition' },
          { title: ' Other', value: 'other' }
        ],
        layout: 'dropdown'
      },
      hidden: ({ document }) => document?.category !== 'events'
    },

    {
      name: 'registrationLink',
      title: 'Registration/RSVP Link',
      type: 'url',
      description: 'Link for students to register or RSVP',
      hidden: ({ document }) => document?.category !== 'events'
    },

    {
      name: 'isFreeEvent',
      title: 'Free Event',
      type: 'boolean',
      description: 'Is this event free to attend?',
      initialValue: true,
      hidden: ({ document }) => document?.category !== 'events'
    },

    {
      name: 'eventPrice',
      title: 'Event Price',
      type: 'string',
      description: 'Ticket price if not free',
      placeholder: 'e.g., ₦500, ₦1000-2000',
      hidden: ({ document }) => document?.category !== 'events' || document?.isFreeEvent
    },

    // ===== ACADEMICS SPECIFIC =====
    {
      name: 'department',
      title: 'Target Department',
      type: 'string',
      description: 'Which department is this for?',
      options: {
        list: [
          { title: ' All Students', value: 'all' },
          { title: ' Engineering', value: 'engineering' },
          { title: ' Science', value: 'science' },
          { title: ' Agriculture', value: 'agriculture' },
          { title: ' Environmental Sciences', value: 'environmental' },
          { title: ' Education', value: 'education' },
          { title: ' Management Sciences', value: 'management' },
          { title: ' Veterinary Medicine', value: 'veterinary' }
        ],
        layout: 'dropdown'
      },
      hidden: ({ document }) => document?.category !== 'academics'
    },

    {
      name: 'level',
      title: 'Target Level',
      type: 'string',
      description: 'Which year/level is this for?',
      options: {
        list: [
          { title: ' All Levels', value: 'all' },
          { title: ' 100 Level', value: '100' },
          { title: ' 200 Level', value: '200' },
          { title: ' 300 Level', value: '300' },
          { title: ' 400 Level', value: '400' },
          { title: ' 500 Level', value: '500' },
          { title: ' Postgraduate', value: 'postgraduate' }
        ],
        layout: 'dropdown'
      },
      hidden: ({ document }) => document?.category !== 'academics'
    },

    {
      name: 'academicType',
      title: 'Academic Post Type',
      type: 'string',
      options: {
        list: [
          { title: ' Timetable', value: 'timetable' },
          { title: ' Exam Info', value: 'exam' },
          { title: ' Scholarship', value: 'scholarship' },
          { title: ' Research', value: 'research' },
          { title: ' Course Material', value: 'course-material' },
          { title: ' Lecture Notice', value: 'lecture' },
          { title: ' General', value: 'general' }
        ],
        layout: 'dropdown'
      },
      hidden: ({ document }) => document?.category !== 'academics'
    },

    // ===== SPORTS SPECIFIC =====
    {
      name: 'sportType',
      title: 'Sport Type',
      type: 'string',
      options: {
        list: [
          { title: 'Football', value: 'football' },
          { title: 'Basketball', value: 'basketball' },
          { title: 'Athletics', value: 'athletics' },
          { title: 'Volleyball', value: 'volleyball' },
          { title: 'Table Tennis', value: 'table-tennis' },
          { title: 'Boxing', value: 'boxing' },
          { title: ' Chess', value: 'chess' },
          { title: ' Other', value: 'other' }
        ],
        layout: 'dropdown'
      },
      hidden: ({ document }) => document?.category !== 'sports'
    },

    {
      name: 'matchType',
      title: 'Match/Competition Type',
      type: 'string',
      options: {
        list: [
          { title: 'General News', value: 'general' },
          { title: 'Match Result', value: 'result' },
          { title: 'Upcoming Match', value: 'upcoming' },
          { title: 'Team News', value: 'team-news' },
          { title: 'Training/Tryouts', value: 'training' },
          { title: 'Tournament', value: 'tournament' }
        ],
        layout: 'dropdown'
      },
      hidden: ({ document }) => document?.category !== 'sports'
    },

    {
      name: 'matchScore',
      title: 'Match Score (if applicable)',
      type: 'string',
      placeholder: 'e.g., ATBU 3 - 1 UNIJOS',
      hidden: ({ document }) => document?.category !== 'sports'
    },

    // ===== ENTERTAINMENT SPECIFIC =====
    {
      name: 'entertainmentType',
      title: 'Entertainment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Music', value: 'music' },
          { title: 'Comedy', value: 'comedy' },
          { title: 'Movies/Cinema', value: 'movies' },
          { title: 'Gaming', value: 'gaming' },
          { title: 'Shows/Performances', value: 'shows' },
          { title: 'Arts & Culture', value: 'arts' },
          { title: 'General Entertainment', value: 'general' }
        ],
        layout: 'dropdown'
      },
      hidden: ({ document }) => document?.category !== 'entertainment'
    },

    // ===== PUBLISHING INFO =====
    {
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      description: 'When should this post go live?',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required()
    },

    {
      name: 'status',
      title: 'Publication Status',
      type: 'string',
      options: {
        list: [
          { title: '✅ Published', value: 'published' },
          { title: '📝 Draft', value: 'draft' },
          { title: '📅 Scheduled', value: 'scheduled' }
        ],
        layout: 'radio'
      },
      initialValue: 'draft',
      validation: Rule => Rule.required()
    },

    // ===== SOCIAL INTERACTIONS =====
    {
      name: 'likes',
      title: 'Likes',
      type: 'number',
      initialValue: 0,
      readOnly: true, // Only modifiable via API
      description: 'Number of likes this post has received'
    },

    {
      name: 'comments',
      title: 'Comments',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'text', type: 'text', title: 'Comment' },
            { name: 'timestamp', type: 'datetime', title: 'Time' }
          ]
        }
      ],
      description: 'User comments on this post'
    }
  ],

  // ========== PREVIEW CONFIGURATION ==========
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'featuredImage',
      status: 'status',
      priority: 'priority'
    },
    prepare(selection) {
      const { title, category, media, status, priority } = selection

      // Category icons
      const categoryIcons = {
        'announcements': '📢',
        'events': '🎉',
        'academics': '📚',
        'sports': '⚽',
        'entertainment': '🎭'
      }

      // Status icons
      const statusIcons = {
        'published': '✅',
        'draft': '📝',
        'scheduled': '📅'
      }

      const subtitle = [
        categoryIcons[category] || '📰',
        category,
        '•',
        statusIcons[status] || '📝',
        status,
        priority && `• ${priority}`
      ].filter(Boolean).join(' ')

      return {
        title: title,
        subtitle: subtitle,
        media: media
      }
    }
  },

  // ========== INITIAL VALUE ==========
  initialValue: {
    status: 'draft',
    isFeatured: false,
    priority: 'normal',
    isFreeEvent: true
  },

  // ========== ORDERING ==========
  orderings: [
    {
      title: 'Publish Date, New',
      name: 'publishedAtDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' }
      ]
    },
    {
      title: 'Publish Date, Old',
      name: 'publishedAtAsc',
      by: [
        { field: 'publishedAt', direction: 'asc' }
      ]
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'publishedAt', direction: 'desc' }
      ]
    }
  ]
}