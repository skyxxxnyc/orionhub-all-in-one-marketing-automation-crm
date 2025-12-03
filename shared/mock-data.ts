import type { User, Chat, ChatMessage, Contact, Deal, Pipeline, Workflow, EmailTemplate, SMSTemplate, Campaign, Conversation, Page, Funnel } from './types';
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
export const MOCK_DEALS: Deal[] = [
  { id: 'deal-1', title: 'Website Redesign', value: 5000, stage: 'New Lead', contactId: 'contact-1', createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() - 86400000 * 2 },
  { id: 'deal-2', title: 'Marketing Campaign', value: 12000, stage: 'New Lead', contactId: 'contact-4', createdAt: Date.now() - 86400000 * 3, updatedAt: Date.now() - 86400000 * 1 },
  { id: 'deal-3', title: 'SEO Audit', value: 2500, stage: 'Contact Made', contactId: 'contact-3', createdAt: Date.now() - 86400000 * 10, updatedAt: Date.now() - 86400000 * 5 },
  { id: 'deal-4', title: 'App Development', value: 25000, stage: 'Proposal Sent', contactId: 'contact-2', createdAt: Date.now() - 86400000 * 20, updatedAt: Date.now() - 86400000 * 3 },
  { id: 'deal-5', title: 'Consulting Retainer', value: 7500, stage: 'Proposal Sent', contactId: 'contact-5', createdAt: Date.now() - 86400000 * 15, updatedAt: Date.now() - 86400000 * 4 },
  { id: 'deal-6', title: 'Social Media Management', value: 1500, stage: 'Won', contactId: 'contact-6', createdAt: Date.now() - 86400000 * 30, updatedAt: Date.now() - 86400000 * 10 },
  { id: 'deal-7', title: 'Email Platform Migration', value: 4000, stage: 'Lost', contactId: 'contact-7', createdAt: Date.now() - 86400000 * 25, updatedAt: Date.now() - 86400000 * 12 },
];
export const MOCK_PIPELINES: Omit<Pipeline, 'deals'>[] = [
  {
    id: 'pipeline-1',
    name: 'Sales Pipeline',
    stages: ['New Lead', 'Contact Made', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
  },
];
export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Lead Nurturing Sequence',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 1,
    nodes: [
      { id: '1', type: 'custom', position: { x: 50, y: 100 }, data: { label: 'Form Submitted', type: 'trigger', icon: 'FileText' } },
      { id: '2', type: 'custom', position: { x: 300, y: 100 }, data: { label: 'Send Welcome Email', type: 'action', icon: 'Mail' } },
      { id: '3', type: 'custom', position: { x: 550, y: 100 }, data: { label: 'Wait 3 Days', type: 'action', icon: 'Clock' } },
      { id: '4', type: 'custom', position: { x: 800, y: 100 }, data: { label: 'Email Opened?', type: 'condition', icon: 'GitBranch' } },
      { id: '5', type: 'custom', position: { x: 1050, y: 0 }, data: { label: 'Send Follow-up SMS', type: 'action', icon: 'MessageSquare' } },
      { id: '6', type: 'custom', position: { x: 1050, y: 200 }, data: { label: 'Add Tag "Unresponsive"', type: 'action', icon: 'Tag' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3', animated: true },
      { id: 'e3-4', source: '3', target: '4', animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'yes', label: 'Yes' },
      { id: 'e4-6', source: '4', target: '6', sourceHandle: 'no', label: 'No' },
    ],
  },
  {
    id: 'wf-2',
    name: 'Re-engagement Campaign',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 3,
    nodes: [
      { id: '1', type: 'custom', position: { x: 50, y: 100 }, data: { label: 'Tag Added: "Inactive"', type: 'trigger', icon: 'Tag' } },
      { id: '2', type: 'custom', position: { x: 300, y: 100 }, data: { label: 'Send "We Miss You" Email', type: 'action', icon: 'Mail' } },
      { id: '3', type: 'custom', position: { x: 550, y: 100 }, data: { label: 'Wait 7 Days', type: 'action', icon: 'Clock' } },
      { id: '4', type: 'custom', position: { x: 800, y: 100 }, data: { label: 'Archive Contact', type: 'action', icon: 'Archive' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3', animated: true },
      { id: 'e3-4', source: '3', target: '4', animated: true },
    ],
  },
];
export const MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  { id: 'et-1', name: 'Welcome Email', subject: 'Welcome to OrionHub!', body: 'Hi {{contact.name}}, thanks for joining!', mergeTags: ['contact.name'] },
  { id: 'et-2', name: 'Follow-up', subject: 'Following up on our chat', body: 'Hi {{contact.name}}, just wanted to follow up.', mergeTags: ['contact.name'] },
  { id: 'et-3', name: 'Newsletter', subject: 'This Week in OrionHub', body: 'Check out our latest updates...', mergeTags: [] },
];
export const MOCK_SMS_TEMPLATES: SMSTemplate[] = [
  { id: 'st-1', name: 'Appointment Reminder', body: 'Hi {{contact.name}}, your appointment is tomorrow at {{appointment.time}}.', mergeTags: ['contact.name', 'appointment.time'] },
  { id: 'st-2', name: 'Promo Offer', body: 'Get 20% off with code PROMO20!', mergeTags: [] },
];
export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'camp-1', type: 'email', name: 'Q3 Newsletter', templateId: 'et-3', status: 'sent', analytics: { sends: 1200, deliveries: 1190, opens: 450, clicks: 80 } },
  { id: 'camp-2', type: 'sms', name: 'Black Friday Promo', templateId: 'st-2', status: 'scheduled', scheduledAt: Date.now() + 86400000 * 7, analytics: { sends: 0, deliveries: 0, opens: 0, clicks: 0 } },
  { id: 'camp-3', type: 'email', name: 'Welcome Series', templateId: 'et-1', status: 'draft', analytics: { sends: 0, deliveries: 0, opens: 0, clicks: 0 } },
  { id: 'camp-4', type: 'email', name: 'Re-engagement', templateId: 'et-2', status: 'sent', analytics: { sends: 500, deliveries: 490, opens: 120, clicks: 15 } },
];
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1', contactId: 'contact-1', channel: 'email', status: 'open', assignedTo: 'u1', lastMessageAt: Date.now() - 3600000,
    messages: [
      { id: 'msg-1-1', from: 'Alice Johnson', text: 'Hi, I have a question about pricing.', direction: 'in', timestamp: Date.now() - 3600000 * 2 },
      { id: 'msg-1-2', from: 'user', text: 'Hi Alice, I can help with that. What would you like to know?', direction: 'out', timestamp: Date.now() - 3600000 },
    ],
  },
  {
    id: 'conv-2', contactId: 'contact-2', channel: 'sms', status: 'closed', lastMessageAt: Date.now() - 86400000,
    messages: [
      { id: 'msg-2-1', from: 'user', text: 'Your invoice is ready.', direction: 'out', timestamp: Date.now() - 86400000 * 2 },
      { id: 'msg-2-2', from: 'Bob Williams', text: 'Thanks!', direction: 'in', timestamp: Date.now() - 86400000 },
    ],
  },
  {
    id: 'conv-3', contactId: 'contact-4', channel: 'email', status: 'open', lastMessageAt: Date.now() - 3600000 * 5,
    messages: [
      { id: 'msg-3-1', from: 'Diana Miller', text: 'Interested in learning more about your services.', direction: 'in', timestamp: Date.now() - 3600000 * 5 },
    ],
  },
];
export const MOCK_PAGES: Page[] = [
  {
    id: 'page-1',
    name: 'SaaS Landing Page',
    createdAt: Date.now() - 86400000 * 5,
    analytics: { views: 10234, conversions: 876 },
    content: [
      { id: 'el-1', type: 'text', content: '<h1>The Future of SaaS</h1>', position: { x: 100, y: 50 } },
      { id: 'el-2', type: 'image', content: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070', position: { x: 100, y: 150 } },
      { id: 'el-3', type: 'button', content: 'Get Started', position: { x: 100, y: 300 } },
    ],
  },
  {
    id: 'page-2',
    name: 'Thank You Page',
    createdAt: Date.now() - 86400000 * 4,
    analytics: { views: 870, conversions: 0 },
    content: [
      { id: 'el-4', type: 'text', content: '<h2>Thanks for signing up!</h2>', position: { x: 100, y: 50 } },
    ],
  },
  {
    id: 'page-3',
    name: 'Upsell Offer',
    createdAt: Date.now() - 86400000 * 3,
    analytics: { views: 850, conversions: 120 },
    content: [
      { id: 'el-5', type: 'text', content: '<h3>One-Time Offer!</h3>', position: { x: 100, y: 50 } },
      { id: 'el-6', type: 'button', content: 'Add to My Order', position: { x: 100, y: 150 } },
    ],
  },
];
export const MOCK_FUNNELS: Funnel[] = [
  {
    id: 'funnel-1',
    name: 'Main Lead Funnel',
    createdAt: Date.now() - 86400000 * 5,
    steps: [
      { id: 'step-1', pageId: 'page-1', order: 1 },
      { id: 'step-2', pageId: 'page-2', order: 2 },
      { id: 'step-3', pageId: 'page-3', order: 3 },
    ],
  },
  {
    id: 'funnel-2',
    name: 'Webinar Signup Funnel',
    createdAt: Date.now() - 86400000 * 2,
    steps: [
      { id: 'step-4', pageId: 'page-1', order: 1 },
      { id: 'step-5', pageId: 'page-2', order: 2 },
    ],
  },
];