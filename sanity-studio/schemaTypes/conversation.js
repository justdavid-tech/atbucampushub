// schemas/conversation.js
export default {
  name: 'conversation',
  title: 'Conversation',
  type: 'document',
  fields: [
    {
      name: 'participants',
      title: 'Participants',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'userProfile' }],
        },
      ],
      validation: Rule => Rule.required().min(2).max(2),
    },
    {
      name: 'product',
      title: 'Product Being Discussed',
      type: 'reference',
      to: [{ type: 'product' }],
    },
    {
      name: 'messages',
      title: 'Messages',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'message',
          fields: [
            {
              name: 'sender',
              title: 'Sender',
              type: 'reference',
              to: [{ type: 'userProfile' }],
            },
            {
              name: 'text',
              title: 'Message Text',
              type: 'text',
            },
            {
              name: 'image',
              title: 'Image (optional)',
              type: 'image',
            },
            {
              name: 'sentAt',
              title: 'Sent At',
              type: 'datetime',
            },
            {
              name: 'isRead',
              title: 'Read',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              text: 'text',
              senderName: 'sender.fullName',
            },
            prepare({ text, senderName }) {
              return {
                title: senderName || 'Unknown',
                subtitle: text?.substring(0, 60) || '[image]',
              }
            },
          },
        },
      ],
    },
    {
      name: 'lastMessage',
      title: 'Last Message Preview',
      type: 'string',
    },
    {
      name: 'lastMessageAt',
      title: 'Last Message At',
      type: 'datetime',
    },
    {
      name: 'unreadCount',
      title: 'Unread Count',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'isFlagged',
      title: 'Flagged (Admin)',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'startedAt',
      title: 'Started At',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      p1: 'participants.0.fullName',
      p2: 'participants.1.fullName',
      lastMsg: 'lastMessage',
    },
    prepare({ p1, p2, lastMsg }) {
      return {
        title: `${p1 || '?'} ↔ ${p2 || '?'}`,
        subtitle: lastMsg || 'No messages yet',
      }
    },
  },
}