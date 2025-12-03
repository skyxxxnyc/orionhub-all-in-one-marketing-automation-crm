import type { User, Chat, ChatMessage, Contact, Deal, Pipeline, Workflow, EmailTemplate, SMSTemplate, Campaign, Conversation, Page, Funnel, Appointment, Availability, CalendarEvent, Integration, Organization, Workspace, Billing, Role } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A', email: 'agency@orionhub.io' },
  { id: 'u2', name: 'User B', email: 'client@orionhub.io' }
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
];
export const MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  { id: 'et-1', name: 'Welcome Email', subject: 'Welcome to OrionHub!', body: 'Hi {{contact.name}}, thanks for joining!', mergeTags: ['contact.name'] },
  { id: 'et-2', name: 'Follow-up', subject: 'Following up on our chat', body: 'Hi {{contact.name}}, just wanted to follow up.', mergeTags: ['contact.name'] },
];
export const MOCK_SMS_TEMPLATES: SMSTemplate[] = [
  { id: 'st-1', name: 'Appointment Reminder', body: 'Hi {{contact.name}}, your appointment is tomorrow at {{appointment.time}}.', mergeTags: ['contact.name', 'appointment.time'] },
];
export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'camp-1', type: 'email', name: 'Q3 Newsletter', templateId: 'et-1', status: 'sent', analytics: { sends: 1200, deliveries: 1190, opens: 450, clicks: 80 } },
  { id: 'camp-2', type: 'sms', name: 'Black Friday Promo', templateId: 'st-1', status: 'scheduled', scheduledAt: Date.now() + 86400000 * 7, analytics: { sends: 0, deliveries: 0, opens: 0, clicks: 0 } },
];
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1', contactId: 'contact-1', channel: 'email', status: 'open', assignedTo: 'u1', lastMessageAt: Date.now() - 3600000,
    messages: [
      { id: 'msg-1-1', from: 'Alice Johnson', text: 'Hi, I have a question about pricing.', direction: 'in', timestamp: Date.now() - 3600000 * 2 },
      { id: 'msg-1-2', from: 'user', text: 'Hi Alice, I can help with that. What would you like to know?', direction: 'out', timestamp: Date.now() - 3600000 },
    ],
  },
];
export const MOCK_PAGES: Page[] = [
  {
    id: 'page-1', name: 'SaaS Landing Page', createdAt: Date.now() - 86400000 * 5, analytics: { views: 10234, conversions: 876 },
    content: [],
  },
];
export const MOCK_FUNNELS: Funnel[] = [
  {
    id: 'funnel-1', name: 'Main Lead Funnel', createdAt: Date.now() - 86400000 * 5,
    steps: [{ id: 'step-1', pageId: 'page-1', order: 1 }],
  },
];
const today = new Date();
const setTime = (date: Date, hours: number, minutes: number) => new Date(date).setHours(hours, minutes, 0, 0);
export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'appt-1', title: 'Discovery Call with Alice', start: setTime(today, 10, 0), end: setTime(today, 10, 30), contactId: 'contact-1', type: 'Discovery Call', status: 'scheduled', bufferBefore: 15, bufferAfter: 15 },
];
export const MOCK_AVAILABILITIES: Availability[] = [
  { id: 'avail-1', userId: 'u1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
];
export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = MOCK_APPOINTMENTS.filter(a => a.status === 'scheduled').map(a => ({
  id: a.id, title: a.title, start: a.start, end: a.end, color: '#3b82f6',
}));
export const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'int-1', type: 'google', status: 'connected', syncToken: 'sync-token-123' },
  { id: 'int-2', type: 'outlook', status: 'disconnected' },
];
export const MOCK_ORGANIZATIONS: Organization[] = [
  { id: 'org-1', name: 'Orion Digital Agency', type: 'agency', branding: { logo: '/logo-orion.png', colors: { primary: '#F38020' } }, workspaces: ['ws-1', 'ws-2', 'ws-3'], ownerId: 'u1', createdAt: Date.now() - 86400000 * 30 },
  { id: 'org-2', name: 'Innovate Inc.', type: 'client', branding: {}, workspaces: ['ws-4'], ownerId: 'u2', createdAt: Date.now() - 86400000 * 10 },
  { id: 'org-3', name: 'Solutions Co.', type: 'client', branding: {}, workspaces: ['ws-5'], ownerId: 'u2', createdAt: Date.now() - 86400000 * 5 },
];
export const MOCK_WORKSPACES: Workspace[] = [
  { id: 'ws-1', orgId: 'org-1', name: 'Agency Workspace', users: ['u1'], permissions: { 'u1': 'admin' } },
  { id: 'ws-2', orgId: 'org-1', name: 'Innovate Inc. (Sub-account)', users: ['u1', 'u2'], permissions: { 'u1': 'admin', 'u2': 'read' } },
  { id: 'ws-3', orgId: 'org-1', name: 'Solutions Co. (Sub-account)', users: ['u1'], permissions: { 'u1': 'admin' } },
  { id: 'ws-4', orgId: 'org-2', name: 'Main Workspace', users: ['u2'], permissions: { 'u2': 'admin' } },
  { id: 'ws-5', orgId: 'org-3', name: 'Main Workspace', users: ['u2'], permissions: { 'u2': 'admin' } },
];
export const MOCK_BILLING: Billing[] = [
  { id: 'bill-1', orgId: 'org-1', plan: 'enterprise', status: 'active', usage: { contacts: 5000, campaigns: 150 }, nextInvoice: Date.now() + 86400000 * 15 },
  { id: 'bill-2', orgId: 'org-2', plan: 'pro', status: 'active', usage: { contacts: 800, campaigns: 25 }, nextInvoice: Date.now() + 86400000 * 10 },
];
export const MOCK_ROLES: Role[] = [
  { id: 'role-1', name: 'admin', permissions: ['*:*'] },
  { id: 'role-2', name: 'user', permissions: ['contacts:read', 'contacts:write', 'campaigns:read'] },
  { id: 'role-3', name: 'client', permissions: ['dashboard:read', 'contacts:read'] },
];
export const MOCK_REPORTS = [
  { id: 'report-1', orgId: 'org-1', metrics: { totalRevenue: 1250, subAccounts: 3, conversionRate: 24.5 }, dateRange: { start: Date.now() - 86400000 * 30, end: Date.now() } }
];
export const MOCK_WEBHOOKS = [
  { id: 'wh-1', url: 'https://example.com/webhook', events: ['contact.created'], active: true }
];
export const MOCK_API_KEYS = [
  { id: 'key-1', userId: 'u1', key: 'mock-api-key-123', permissions: ['contacts:read'] }
];