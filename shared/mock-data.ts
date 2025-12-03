import type { User, Chat, ChatMessage, Contact } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '555-0101',
    tags: ['lead', 'newsletter-subscriber'],
    customFields: { company: 'Innovate Inc.', source: 'Website Form' },
    activities: [
      { type: 'email', content: 'Sent "Welcome Series - Email 1"', date: Date.now() - 86400000 * 5 },
      { type: 'note', content: 'Initial discovery call scheduled for next week.', date: Date.now() - 86400000 * 2 },
    ],
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'contact-2',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    phone: '555-0102',
    tags: ['customer', 'vip'],
    customFields: { company: 'Solutions Co.', plan: 'Enterprise' },
    activities: [
      { type: 'automation', content: 'Entered "Onboarding" workflow', date: Date.now() - 86400000 * 30 },
      { type: 'sms', content: 'Replied: "Thanks for the update!"', date: Date.now() - 3600000 * 3 },
    ],
    createdAt: Date.now() - 86400000 * 45,
  },
  {
    id: 'contact-3',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    tags: ['prospect'],
    customFields: { source: 'Referral' },
    activities: [
      { type: 'note', content: 'Met at conference. Follow up on pricing.', date: Date.now() - 86400000 * 7 },
    ],
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: 'contact-4',
    name: 'Diana Miller',
    email: 'diana.m@example.com',
    phone: '555-0104',
    tags: ['lead', 'hot'],
    customFields: { company: 'Growth Partners', source: 'LinkedIn' },
    activities: [
      { type: 'email', content: 'Opened "Case Study" email', date: Date.now() - 3600000 * 24 },
    ],
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'contact-5',
    name: 'Ethan Davis',
    email: 'ethan.d@example.com',
    tags: ['customer'],
    customFields: { company: 'Tech Forward', plan: 'Pro' },
    activities: [
      { type: 'note', content: 'Requested feature for reporting.', date: Date.now() - 86400000 },
    ],
    createdAt: Date.now() - 86400000 * 90,
  },
  {
    id: 'contact-6',
    name: 'Fiona Garcia',
    email: 'fiona.g@example.com',
    tags: ['lead'],
    customFields: { source: 'Webinar' },
    activities: [],
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'contact-7',
    name: 'George Harris',
    email: 'george.h@example.com',
    tags: ['archived'],
    customFields: { reason: 'No longer at company' },
    activities: [],
    createdAt: Date.now() - 86400000 * 180,
  },
];