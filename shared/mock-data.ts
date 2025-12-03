import type { User, Chat, ChatMessage, Contact, Deal, Pipeline, Workflow, EmailTemplate, SMSTemplate, Campaign, Conversation, Page, Funnel, Appointment, Availability, CalendarEvent, Integration, Organization, Workspace, Billing, Role, Ticket, Article } from './types';
// --- Base Mock Data ---
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
// --- Expanded Mock Data Generation ---
const generateMockContacts = (count: number): Contact[] => {
  const contacts: Contact[] = [];
  const tags = ['lead', 'customer', 'vip', 'newsletter-subscriber', 'hot', 'archived'];
  const sources = ['Website Form', 'Referral', 'LinkedIn', 'Webinar'];
  for (let i = 1; i <= count; i++) {
    contacts.push({
      id: `contact-${i}`,
      name: `Contact ${i}`,
      email: `contact.${i}@example.com`,
      phone: `555-01${i.toString().padStart(2, '0')}`,
      tags: [tags[i % tags.length], tags[(i + 2) % tags.length]],
      customFields: { company: `Company ${i}`, source: sources[i % sources.length] },
      activities: [
        { type: 'note', content: `Initial contact made.`, date: Date.now() - 86400000 * (i % 30) },
      ],
      createdAt: Date.now() - 86400000 * (i % 365),
    });
  }
  return contacts;
};
const generateMockDeals = (count: number, stages: string[], contactIds: string[]): Deal[] => {
  const deals: Deal[] = [];
  for (let i = 1; i <= count; i++) {
    deals.push({
      id: `deal-${i}`,
      title: `Deal Project ${i}`,
      value: Math.floor(Math.random() * 20000) + 1000,
      stage: stages[i % stages.length],
      contactId: contactIds[i % contactIds.length],
      createdAt: Date.now() - 86400000 * (i % 60),
      updatedAt: Date.now() - 86400000 * (i % 10),
    });
  }
  return deals;
};
export const MOCK_CONTACTS: Contact[] = generateMockContacts(120);
export const MOCK_PIPELINES: Omit<Pipeline, 'deals'>[] = [
  {
    id: 'pipeline-1',
    name: 'Sales Pipeline',
    stages: ['New Lead', 'Contact Made', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
  },
];
export const MOCK_DEALS: Deal[] = generateMockDeals(60, MOCK_PIPELINES[0].stages, MOCK_CONTACTS.map(c => c.id));
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
  // Add more workflow mocks if needed
];
// --- Other Mock Data ---
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
  { id: 'appt-1', title: 'Discovery Call with Contact 1', start: setTime(today, 10, 0), end: setTime(today, 10, 30), contactId: 'contact-1', type: 'Discovery Call', status: 'scheduled', bufferBefore: 15, bufferAfter: 15 },
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
export const MOCK_TICKETS: Ticket[] = [
  { id: 't1', title: 'Bug in automations', description: 'Workflow builder crashes on drag.', priority: 'high', type: 'bug', status: 'open', orgId: 'org-1', createdAt: Date.now() - 86400000 * 2 },
  { id: 't2', title: 'Feature request: SMS A/B testing', description: 'Add variant support for SMS campaigns.', priority: 'medium', type: 'feature', status: 'open', orgId: 'org-2', createdAt: Date.now() - 86400000 },
  { id: 't3', title: 'Question about billing', description: 'How do I upgrade my plan?', priority: 'low', type: 'other', status: 'resolved', orgId: 'org-1', createdAt: Date.now() - 86400000 * 5, resolvedAt: Date.now() - 86400000 * 4 },
  { id: 't4', title: 'Funnel page not loading', description: 'The editor for my landing page is stuck on the loading screen.', priority: 'high', type: 'bug', status: 'open', orgId: 'org-2', createdAt: Date.now() - 3600000 * 3 },
  { id: 't5', title: 'Add more email templates', description: 'It would be great to have more templates for e-commerce.', priority: 'low', type: 'feature', status: 'open', orgId: 'org-1', createdAt: Date.now() - 86400000 * 10 },
];
export const MOCK_ARTICLES: Article[] = [
  { id: 'a1', title: 'How to Build Your First Automation', category: 'automations', content: 'A step-by-step guide to creating powerful workflows that save you time and engage your customers.', role: 'all' },
  { id: 'a2', title: 'Managing Contacts and Tags', category: 'crm', content: 'Learn best practices for organizing your contacts, using tags for segmentation, and leveraging custom fields.', role: 'user' },
  { id: 'a3', title: 'Creating a High-Converting Funnel', category: 'funnels', content: 'From landing page to thank you page, learn how to build a funnel that turns visitors into customers.', role: 'all' },
  { id: 'a4', title: 'Understanding Your Sales Pipeline', category: 'pipelines', content: 'Get the most out of your visual pipeline. Learn how to customize stages and track deal progress.', role: 'user' },
  { id: 'a5', title: 'Launching an Email Campaign', category: 'campaigns', content: 'Everything you need to know about creating, scheduling, and analyzing email marketing campaigns.', role: 'all' },
  { id: 'a6', title: 'Using the Unified Inbox', category: 'inbox', content: 'Manage all your customer conversations from email and SMS in one centralized inbox.', role: 'all' },
  { id: 'a7', title: 'Setting Up Your Calendar and Appointments', category: 'calendar', content: 'Configure your availability, create appointment types, and share your booking link with the world.', role: 'user' },
  { id: 'a8', title: 'Agency Guide: Managing Sub-accounts', category: 'agency', content: 'Learn how to create and manage client sub-accounts, set permissions, and apply custom branding.', role: 'admin' },
  { id: 'a9', title: 'Interpreting Your Dashboard Analytics', category: 'reporting', content: 'A deep dive into the metrics on your main dashboard and what they mean for your business.', role: 'all' },
  { id: 'a10', title: 'Connecting Integrations', category: 'settings', content: 'Sync your Google or Outlook calendar, connect to Stripe, and set up webhooks for custom integrations.', role: 'user' },
];
export const MOCK_INVOICES = [
    { id: 'inv-1', date: Date.now() - 86400000 * 30, amount: 99, status: 'paid' },
    { id: 'inv-2', date: Date.now() - 86400000 * 60, amount: 99, status: 'paid' },
    { id: 'inv-3', date: Date.now() - 86400000 * 90, amount: 99, status: 'paid' },
];
export const MOCK_ANALYTICS = {
    monthly: Array.from({ length: 12 }).map((_, i) => ({
        month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        contacts: 1204 + i * 100 + Math.floor(Math.random() * 200),
        revenue: 45231 + i * 2000 + Math.floor(Math.random() * 5000),
    }))
};