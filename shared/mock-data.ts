import type { User, Chat, ChatMessage, Contact, Deal, Pipeline, Workflow, EmailTemplate, SMSTemplate, Campaign, Conversation, Page, Funnel, Appointment, Availability, CalendarEvent, Integration, Organization, Workspace, Billing, Role, Ticket, Article, WorkflowState, Project, Template, ChatSession } from './types';
// --- Base Mock Data ---
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Orion Admin', email: 'agency@orionhub.io' },
  { id: 'u2', name: 'Demo Client', email: 'client@orionhub.io' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General Support' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Welcome to OrionHub support!', ts: Date.now() },
];
// --- Expanded Mock Data Generation ---
const generateMockContacts = (count: number): Contact[] => {
  const contacts: Contact[] = [];
  const tags = ['lead', 'customer', 'vip', 'newsletter', 'hot', 'cold'];
  const sources = ['Website', 'Referral', 'LinkedIn', 'Webinar'];
  for (let i = 1; i <= count; i++) {
    contacts.push({
      id: `contact-${i}`,
      name: `Contact ${i}`,
      email: `contact.${i}@orionhub.io`,
      phone: `555-01${i.toString().padStart(2, '0')}`,
      tags: [tags[i % tags.length], tags[(i + 2) % tags.length]],
      customFields: { company: `Enterprise ${i}`, source: sources[i % sources.length] },
      activities: [
        { type: 'note', content: `System initialized contact record.`, date: Date.now() - 86400000 * (i % 30) },
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
      title: `Project ${i} Expansion`,
      value: Math.floor(Math.random() * 50000) + 5000,
      stage: stages[i % stages.length],
      contactId: contactIds[i % contactIds.length],
      createdAt: Date.now() - 86400000 * (i % 60),
      updatedAt: Date.now() - 86400000 * (i % 10),
    });
  }
  return deals;
};
export const MOCK_CONTACTS: Contact[] = generateMockContacts(100);
export const MOCK_PIPELINES: Omit<Pipeline, 'deals'>[] = [
  {
    id: 'pipeline-1',
    name: 'Standard Sales Pipeline',
    stages: ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
  },
];
export const MOCK_DEALS: Deal[] = generateMockDeals(60, MOCK_PIPELINES[0].stages, MOCK_CONTACTS.map(c => c.id));
export const MOCK_WORKFLOW_TEMPLATES: WorkflowState[] = [
  { 
    id: 'wft-1', name: 'Abandoned Cart Recovery', description: 'Multi-step sequence to recover lost sales.', category: 'e-commerce', industry: 'retail', complexity: 'advanced', 
    nodes: [
      {id: '1', type: 'custom', position: {x:100,y:100}, data: {label: 'Cart Abandoned', type: 'trigger', icon: 'ShoppingCart'}}, 
      {id: '2', type: 'custom', position: {x:400,y:100}, data: {label: 'Wait 1 Hour', type: 'action', icon: 'Clock'}},
      {id: '3', type: 'custom', position: {x:700,y:100}, data: {label: 'Send Email', type: 'action', icon: 'Mail'}}
    ], 
    edges: [{id: 'e1-2', source: '1', target: '2'}, {id: 'e2-3', source: '2', target: '3'}], 
    isTemplate: true, variants: [], executions: [], paused: false, metrics: { runs: 1250, completions: 300 }, orgId: 'org-1', createdAt: Date.now(), updatedAt: Date.now() 
  },
  { 
    id: 'wft-2', name: 'SaaS Trial Onboarding', description: 'Nurture trial users into paid customers.', category: 'onboarding', industry: 'saas', complexity: 'advanced', 
    nodes: [], edges: [], isTemplate: true, variants: [], executions: [], paused: false, metrics: { runs: 800, completions: 250 }, orgId: 'org-1', createdAt: Date.now(), updatedAt: Date.now() 
  }
];
export const MOCK_WORKFLOWS: Workflow[] = [
  { id: 'wf-1', name: 'Active Lead Nurture', nodes: [], edges: [], createdAt: Date.now(), updatedAt: Date.now() },
];
export const MOCK_PAGE_TEMPLATES: Page[] = [
  { id: 'pt-1', name: 'SaaS Landing Page', description: 'High-conversion landing page.', category: 'landing', industry: 'saas', complexity: 'medium', content: [], analytics: {views: 12000, conversions: 1500}, createdAt: Date.now(), isTemplate: true, orgId: 'org-1' },
];
export const MOCK_FUNNEL_TEMPLATES: Funnel[] = [
  { id: 'funnel-t1', name: 'Lead Magnet Funnel', steps: [{id:'s1', pageId:'pt-1', order:1}], createdAt: Date.now(), isTemplate: true, category: 'lead-gen' },
];
export const MOCK_PAGES: Page[] = [...MOCK_PAGE_TEMPLATES];
export const MOCK_FUNNELS: Funnel[] = [...MOCK_FUNNEL_TEMPLATES];
export const MOCK_PROJECTS: Project[] = [
    {id:'proj-1', name:'Q4 Growth Funnel', type:'funnel', ownerId:'u1', status:'active', version:1, collaborators:[], orgId:'org-1', workspaceId: 'ws-1', createdAt: Date.now() - 86400000 * 5, analytics:{views:1200, completions:150, revenue:5000}},
];
export const MOCK_TEMPLATE_GALLERY: Template[] = [
    {id:'tg-1', type:'funnel', name:'Real Estate Lead Gen', description:'Capture buyer leads...', category:'lead-gen', industry:'real-estate', complexity:'medium', metrics:{views:1000, completions: 200, adoption: 25}, orgId:'org-1', isUserGenerated: false, public: true},
];
export const MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  { id: 'et-1', name: 'Welcome Email', subject: 'Welcome to OrionHub!', body: 'Hi {{contact.name}}, welcome!', mergeTags: ['contact.name'] },
];
export const MOCK_SMS_TEMPLATES: SMSTemplate[] = [
  { id: 'st-1', name: 'Reminder', body: 'Hi {{contact.name}}, reminder for tomorrow.', mergeTags: ['contact.name'] },
];
export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'camp-1', type: 'email', name: 'Monthly Newsletter', templateId: 'et-1', status: 'sent', analytics: { sends: 1200, deliveries: 1190, opens: 450, clicks: 80 } },
];
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1', contactId: 'contact-1', channel: 'email', status: 'open', assignedTo: 'u1', lastMessageAt: Date.now() - 3600000,
    messages: [{ id: 'msg-1', from: 'Contact 1', text: 'I have a question.', direction: 'in', timestamp: Date.now() - 3600000 }],
  },
];
export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'appt-1', title: 'Discovery Call', start: Date.now() + 86400000, end: Date.now() + 86400000 + 1800000, contactId: 'contact-1', type: 'Discovery', status: 'scheduled', bufferBefore: 15, bufferAfter: 15 },
];
export const MOCK_AVAILABILITIES: Availability[] = [
  { id: 'avail-1', userId: 'u1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
];
export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = MOCK_APPOINTMENTS.map(a => ({ id: a.id, title: a.title, start: a.start, end: a.end, color: '#F38020' }));
export const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'int-1', type: 'google', status: 'connected' },
];
export const MOCK_ORGANIZATIONS: Organization[] = [
  { id: 'org-1', name: 'Orion Agency', type: 'agency', branding: { colors: { primary: '#F38020' } }, workspaces: ['ws-1'], ownerId: 'u1', createdAt: Date.now() - 86400000 * 30 },
];
export const MOCK_WORKSPACES: Workspace[] = [
  { id: 'ws-1', orgId: 'org-1', name: 'Main Workspace', users: ['u1'], permissions: { 'u1': 'admin' } },
];
export const MOCK_BILLING: Billing[] = [
  { id: 'bill-1', orgId: 'org-1', plan: 'enterprise', status: 'active', usage: { contacts: 5000, campaigns: 150 }, nextInvoice: Date.now() + 86400000 * 15 },
];
export const MOCK_ROLES: Role[] = [{ id: 'role-1', name: 'admin', permissions: ['*:*'] }];
export const MOCK_REPORTS = [{ id: 'report-1', orgId: 'org-1', metrics: { totalRevenue: 1250 }, dateRange: { start: Date.now() - 86400000 * 30, end: Date.now() } }];
export const MOCK_WEBHOOKS = [{ id: 'wh-1', url: 'https://api.orionhub.io/webhook', events: ['contact.created'], active: true }];
export const MOCK_API_KEYS = [{ id: 'key-1', key: 'orion_live_mock_key_123', permissions: ['*:*'] }];
export const MOCK_TICKETS: Ticket[] = [{ id: 't1', title: 'Integration Issue', description: 'Stripe not syncing.', priority: 'high', type: 'bug', status: 'open', orgId: 'org-1', createdAt: Date.now() }];
export const MOCK_ARTICLES: Article[] = [{ id: 'a1', title: 'Getting Started', category: 'setup', content: 'Welcome to OrionHub...', role: 'all' }];
export const MOCK_CHAT_SESSIONS: ChatSession[] = [{ id: 'cs-1', contactId: 'contact-1', messages: [] }];
export const MOCK_FUNNEL_STEPS = [];
export const MOCK_ANALYTICS = { monthly: [] };