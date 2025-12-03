import type { User, Chat, ChatMessage, Contact, Deal, Pipeline, Workflow, EmailTemplate, SMSTemplate, Campaign, Conversation, Page, Funnel, Appointment, Availability, CalendarEvent, Integration, Organization, Workspace, Billing, Role, Ticket, Article, WorkflowState, Project, Template } from './types';
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
export const MOCK_CONTACTS: Contact[] = generateMockContacts(150);
export const MOCK_PIPELINES: Omit<Pipeline, 'deals'>[] = [
  {
    id: 'pipeline-1',
    name: 'Sales Pipeline',
    stages: ['New Lead', 'Contact Made', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
  },
];
export const MOCK_DEALS: Deal[] = generateMockDeals(100, MOCK_PIPELINES[0].stages, MOCK_CONTACTS.map(c => c.id));
// --- NEW EXPANDED WORKFLOW TEMPLATES ---
export const MOCK_WORKFLOW_TEMPLATES: WorkflowState[] = [
  // E-commerce
  { id: 'wft-1', name: 'Abandoned Cart Recovery', description: 'Multi-step email and SMS sequence to recover abandoned carts.', category: 'e-commerce', industry: 'retail', complexity: 'advanced', nodes: [{id: '1', type: 'custom', position: {x:50,y:100}, data: {label: 'Cart Abandoned', type: 'trigger', icon: 'ShoppingCart'}}, {id: '2', type: 'custom', position: {x:300,y:100}, data: {label: 'Send Reminder Email', type: 'action', icon: 'Mail'}}], edges: [{id: 'e1-2', source: '1', target: '2'}], isTemplate: true, variants: [], executions: [], paused: false, metrics: { runs: 1250, completions: 300 }, orgId: 'org-1', createdAt: Date.now(), updatedAt: Date.now() },
  // SaaS
  { id: 'wft-2', name: 'SaaS Trial Nurturing', description: 'Engage users during their trial period to increase conversion.', category: 'lead-nurturing', industry: 'saas', complexity: 'advanced', nodes: [], edges: [], isTemplate: true, variants: [], executions: [], paused: false, metrics: { runs: 800, completions: 250 }, orgId: 'org-1', createdAt: Date.now(), updatedAt: Date.now() },
  // Agency
  { id: 'wft-3', name: 'New Client Onboarding', description: 'Automate welcome emails, task creation, and initial follow-ups for new clients.', category: 'onboarding', industry: 'agency', complexity: 'medium', nodes: [], edges: [], isTemplate: true, variants: [], executions: [], paused: false, metrics: { runs: 50, completions: 48 }, orgId: 'org-1', createdAt: Date.now(), updatedAt: Date.now() },
];
export const MOCK_WORKFLOWS: Workflow[] = [
  { id: 'wf-1', name: 'Live Abandoned Cart Flow', nodes: [], edges: [], createdAt: Date.now(), updatedAt: Date.now() },
];
// --- NEW EXPANDED PAGE TEMPLATES ---
export const MOCK_PAGE_TEMPLATES: Page[] = [
  { id: 'pt-1', name: 'SaaS Trial Signup', description: 'A high-conversion page for SaaS free trials.', category: 'landing', industry: 'saas', complexity: 'medium', content: [], analytics: {views: 12000, conversions: 1500}, createdAt: Date.now(), isTemplate: true, orgId: 'org-1' },
  { id: 'pt-2', name: 'Real Estate Open House RSVP', description: 'Capture RSVPs and showcase property details.', category: 'funnel', industry: 'real-estate', complexity: 'advanced', content: [], analytics: {views: 5000, conversions: 400}, createdAt: Date.now(), isTemplate: true, orgId: 'org-1' },
];
export const MOCK_PAGES: Page[] = [
  { ...MOCK_PAGE_TEMPLATES[0], id: 'page-1', name: 'Live SaaS Landing Page', isTemplate: false, orgId: 'org-1' },
];
// --- NEW MOCK PROJECTS & TEMPLATE GALLERY ---
export const MOCK_PROJECTS: Project[] = [
    {id:'proj-1', name:'SaaS Lead Funnel v2', type:'funnel', ownerId:'u1', status:'active', version:3, collaborators:['u2'], orgId:'org-1', workspaceId: 'ws-1', createdAt: Date.now() - 86400000 * 5, templateId:'pt-1', analytics:{views:1200, completions:150, revenue:5000}},
    {id:'proj-2', name:'Abandoned Cart Automation', type:'automation', ownerId:'u1', status:'active', version:1, collaborators:[], orgId:'org-1', workspaceId: 'ws-2', createdAt: Date.now() - 86400000 * 10, templateId:'wft-1', analytics:{views:0, completions:300, revenue:12000}},
    {id:'proj-3', name:'Product Launch Page', type:'page', ownerId:'u2', status:'draft', version:1, collaborators:[], orgId:'org-2', workspaceId: 'ws-4', createdAt: Date.now() - 86400000 * 2, analytics:{views:0, completions:0, revenue:0}},
];
export const MOCK_TEMPLATE_GALLERY: Template[] = [
    {id:'tg-f1', type:'funnel', name:'Real Estate Open House', description:'RSVP form with map...', category:'lead-gen', industry:'real-estate', complexity:'medium', metrics:{views:1000, completions: 200, adoption: 25}, orgId:'org-1', isUserGenerated: false, public: true},
    {id:'tg-a1', type:'automation', name:'E-commerce Cart Recovery', description:'Recover abandoned carts...', category:'e-commerce', industry:'retail', complexity:'advanced', metrics:{views:500, completions:120, adoption:15}, orgId:'org-1', isUserGenerated: false, public: true},
    {id:'tg-p1', type:'page', name:'SaaS Free Trial', description:'High-conversion page for SaaS trials.', category:'saas', industry:'software', complexity:'medium', metrics:{views:2500, completions:400, adoption:50}, orgId:'org-2', isUserGenerated: false, public: true},
];
// --- Other Mock Data ---
export const MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  { id: 'et-1', name: 'Welcome Email', subject: 'Welcome to OrionHub!', body: 'Hi {{contact.name}}, thanks for joining!', mergeTags: ['contact.name'] },
];
export const MOCK_SMS_TEMPLATES: SMSTemplate[] = [
  { id: 'st-1', name: 'Appointment Reminder', body: 'Hi {{contact.name}}, your appointment is tomorrow at {{appointment.time}}.', mergeTags: ['contact.name', 'appointment.time'] },
];
export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'camp-1', type: 'email', name: 'Q3 Newsletter', templateId: 'et-1', status: 'sent', analytics: { sends: 1200, deliveries: 1190, opens: 450, clicks: 80 } },
];
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1', contactId: 'contact-1', channel: 'email', status: 'open', assignedTo: 'u1', lastMessageAt: Date.now() - 3600000,
    messages: [
      { id: 'msg-1-1', from: 'Alice Johnson', text: 'Hi, I have a question about pricing.', direction: 'in', timestamp: Date.now() - 3600000 * 2 },
    ],
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
];
export const MOCK_ORGANIZATIONS: Organization[] = [
  { id: 'org-1', name: 'Orion Digital Agency', type: 'agency', branding: { logo: '/logo-orion.png', colors: { primary: '#F38020' } }, workspaces: ['ws-1', 'ws-2', 'ws-3'], ownerId: 'u1', createdAt: Date.now() - 86400000 * 30 },
  { id: 'org-2', name: 'Innovate Inc.', type: 'client', branding: {}, workspaces: ['ws-4'], ownerId: 'u2', createdAt: Date.now() - 86400000 * 10 },
];
export const MOCK_WORKSPACES: Workspace[] = [
  { id: 'ws-1', orgId: 'org-1', name: 'Agency Workspace', users: ['u1'], permissions: { 'u1': 'admin' } },
  { id: 'ws-2', orgId: 'org-1', name: 'Innovate Inc. (Sub-account)', users: ['u1', 'u2'], permissions: { 'u1': 'admin', 'u2': 'read' } },
  { id: 'ws-3', orgId: 'org-1', name: 'Solutions Co. (Sub-account)', users: ['u1'], permissions: { 'u1': 'admin' } },
  { id: 'ws-4', orgId: 'org-2', name: 'Main Workspace', users: ['u2'], permissions: { 'u2': 'admin' } },
];
export const MOCK_BILLING: Billing[] = [
  { id: 'bill-1', orgId: 'org-1', plan: 'enterprise', status: 'active', usage: { contacts: 5000, campaigns: 150 }, nextInvoice: Date.now() + 86400000 * 15 },
];
export const MOCK_ROLES: Role[] = [
  { id: 'role-1', name: 'admin', permissions: ['*:*'] },
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
];
export const MOCK_ARTICLES: Article[] = [
  { id: 'a1', title: 'How to Build Your First Automation', category: 'automations', content: 'A step-by-step guide to creating powerful workflows that save you time and engage your customers.', role: 'all' },
];
export const MOCK_INVOICES = [
    { id: 'inv-1', date: Date.now() - 86400000 * 30, amount: 99, status: 'paid' },
];
export const MOCK_ANALYTICS = {
    monthly: Array.from({ length: 12 }).map((_, i) => ({
        month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        contacts: 1204 + i * 100 + Math.floor(Math.random() * 200),
        revenue: 45231 + i * 2000 + Math.floor(Math.random() * 5000),
    }))
};