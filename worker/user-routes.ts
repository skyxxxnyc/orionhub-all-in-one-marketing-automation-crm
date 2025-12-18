import { Hono } from "hono";
import type { Env } from './core-utils';
import { 
  UserEntity, ChatBoardEntity, ContactEntity, PipelineEntity, DealEntity, 
  WorkflowEntity, EmailTemplateEntity, SMSTemplateEntity, CampaignEntity, 
  ConversationEntity, PageEntity, FunnelEntity, AppointmentEntity, 
  AvailabilityEntity, CalendarEventEntity, IntegrationEntity, 
  OrganizationEntity, WorkspaceEntity, BillingEntity, RoleEntity, 
  WebhookEntity, APIKeyEntity, ReportEntity, TicketEntity, 
  ProjectEntity, TemplateEntity, ChatSessionEntity, ArticleEntity 
} from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { 
  Contact, Pipeline, Deal, Workflow, WorkflowNode, WorkflowEdge, 
  Campaign, Conversation, Message, Page, Funnel, Appointment, 
  Availability, Integration, Organization, Workspace, Billing, 
  APIKey, Ticket, CalendarEvent, WorkflowState, Project, 
  Template, ChatSession, Article 
} from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Seed all data on first request
  app.use('/api/*', async (c, next) => {
    await Promise.all([
      UserEntity.ensureSeed(c.env), ChatBoardEntity.ensureSeed(c.env), ContactEntity.ensureSeed(c.env),
      PipelineEntity.ensureSeed(c.env), DealEntity.ensureSeed(c.env), WorkflowEntity.ensureSeed(c.env),
      WebhookEntity.ensureSeed(c.env), APIKeyEntity.ensureSeed(c.env), ReportEntity.ensureSeed(c.env),
      BillingEntity.ensureSeed(c.env), OrganizationEntity.ensureSeed(c.env), WorkspaceEntity.ensureSeed(c.env),
      TicketEntity.ensureSeed(c.env), CalendarEventEntity.ensureSeed(c.env), PageEntity.ensureSeed(c.env),
      ProjectEntity.ensureSeed(c.env), TemplateEntity.ensureSeed(c.env), ChatSessionEntity.ensureSeed(c.env),
      ArticleEntity.ensureSeed(c.env), FunnelEntity.ensureSeed(c.env), CampaignEntity.ensureSeed(c.env),
      ConversationEntity.ensureSeed(c.env), AppointmentEntity.ensureSeed(c.env)
    ]);
    await next();
  });
  // --- Contacts API ---
  app.get('/api/contacts', async (c) => {
    const { orgId, search, cursor, limit } = c.req.query();
    const { items, next } = await ContactEntity.list(c.env, cursor, limit ? parseInt(limit) : 50);
    let filtered = items;
    if (orgId) filtered = filtered.filter(item => (item as any).orgId === orgId || !item.id.includes(':')); // Basic isolation
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(s) || item.email?.toLowerCase().includes(s));
    }
    return ok(c, { items: filtered, next });
  });
  app.get('/api/contacts/:id', async (c) => {
    const contact = new ContactEntity(c.env, c.req.param('id'));
    if (!await contact.exists()) return notFound(c);
    return ok(c, await contact.getState());
  });
  app.post('/api/contacts', async (c) => {
    const data = await c.req.json();
    const contact = await ContactEntity.create(c.env, { 
      ...ContactEntity.initialState, 
      ...data, 
      id: crypto.randomUUID(), 
      createdAt: Date.now() 
    });
    return ok(c, contact);
  });
  app.put('/api/contacts/:id', async (c) => {
    const contact = new ContactEntity(c.env, c.req.param('id'));
    if (!await contact.exists()) return notFound(c);
    const data = await c.req.json();
    await contact.patch(data);
    return ok(c, await contact.getState());
  });
  app.post('/api/contacts/deleteMany', async (c) => {
    const { ids } = await c.req.json();
    if (!Array.isArray(ids)) return bad(c, 'ids array required');
    const count = await ContactEntity.deleteMany(c.env, ids);
    return ok(c, { count });
  });
  // --- Inbox / Conversations ---
  app.get('/api/inbox', async (c) => {
    const { orgId, cursor, limit } = c.req.query();
    const { items, next } = await ConversationEntity.list(c.env, cursor, limit ? parseInt(limit) : 50);
    const filtered = orgId ? items.filter(i => (i as any).orgId === orgId || true) : items;
    return ok(c, { items: filtered, next });
  });
  app.post('/api/conversations/:id/messages', async (c) => {
    const conv = new ConversationEntity(c.env, c.req.param('id'));
    if (!await conv.exists()) return notFound(c);
    const { text } = await c.req.json();
    const msg: Message = { id: crypto.randomUUID(), from: 'user', text, direction: 'out', timestamp: Date.now() };
    await conv.mutate(s => ({ ...s, messages: [...s.messages, msg], lastMessageAt: Date.now() }));
    return ok(c, msg);
  });
  // --- Campaigns ---
  app.get('/api/campaigns', async (c) => {
    const { orgId, type } = c.req.query();
    const { items } = await CampaignEntity.list(c.env);
    let filtered = items;
    if (orgId) filtered = filtered.filter(i => (i as any).orgId === orgId);
    if (type) filtered = filtered.filter(i => i.type === type);
    return ok(c, { items: filtered });
  });
  app.post('/api/campaigns', async (c) => {
    const data = await c.req.json();
    const campaign = await CampaignEntity.create(c.env, { 
      ...CampaignEntity.initialState, 
      ...data, 
      id: crypto.randomUUID() 
    });
    return ok(c, campaign);
  });
  // --- Funnels ---
  app.get('/api/funnels', async (c) => {
    const { orgId } = c.req.query();
    const { items } = await FunnelEntity.list(c.env);
    const filtered = items.filter(f => !f.isTemplate && (!orgId || (f as any).orgId === orgId));
    return ok(c, { items: filtered });
  });
  app.post('/api/funnels', async (c) => {
    const { templateId, orgId, name } = await c.req.json();
    let base: Partial<Funnel> = {};
    if (templateId) {
      const template = new FunnelEntity(c.env, templateId);
      if (await template.exists()) base = await template.getState();
    }
    const funnel = await FunnelEntity.create(c.env, {
      ...FunnelEntity.initialState,
      ...base,
      id: crypto.randomUUID(),
      name: name || base.name || 'New Funnel',
      isTemplate: false,
      orgId,
      createdAt: Date.now()
    });
    return ok(c, funnel);
  });
  // --- Calendar & Appointments ---
  app.get('/api/calendar/events', async (c) => {
    const { items } = await CalendarEventEntity.list(c.env);
    return ok(c, { items });
  });
  app.post('/api/appointments', async (c) => {
    const data = await c.req.json();
    const appt = await AppointmentEntity.create(c.env, {
      ...AppointmentEntity.initialState,
      ...data,
      id: crypto.randomUUID(),
      status: 'scheduled'
    });
    // Also create a calendar event
    await CalendarEventEntity.create(c.env, {
      id: appt.id,
      title: appt.title,
      start: appt.start,
      end: appt.end,
      color: '#F38020'
    });
    return ok(c, appt);
  });
  app.get('/api/appointments/:id', async (c) => {
    const appt = new AppointmentEntity(c.env, c.req.param('id'));
    if (!await appt.exists()) return notFound(c);
    return ok(c, await appt.getState());
  });
  // --- Billing, Webhooks, API Keys ---
  app.get('/api/billing/:orgId', async (c) => {
    const { items } = await BillingEntity.list(c.env);
    const billing = items.find(b => b.orgId === c.req.param('orgId'));
    if (!billing) return notFound(c);
    return ok(c, billing);
  });
  app.get('/api/webhooks', async (c) => {
    const { items } = await WebhookEntity.list(c.env);
    return ok(c, { items });
  });
  app.get('/api/apikeys', async (c) => {
    const { items } = await APIKeyEntity.list(c.env);
    return ok(c, { items });
  });
  app.post('/api/apikeys', async (c) => {
    const key = await APIKeyEntity.create(c.env, {
      id: crypto.randomUUID(),
      key: `orion_live_${crypto.randomUUID().replace(/-/g, '')}`,
      permissions: ['*:*']
    });
    return ok(c, key);
  });
  // --- Existing Routes (Workflows, Projects, etc.) ---
  app.get('/api/workflows', async (c) => {
    const { orgId } = c.req.query();
    const { items } = await WorkflowEntity.list(c.env);
    const filtered = items.filter(w => !w.isTemplate && (!orgId || w.orgId === orgId));
    return ok(c, { items: filtered });
  });
  app.get('/api/workflows/templates', async (c) => {
    const { items } = await WorkflowEntity.list(c.env);
    return ok(c, { items: items.filter(w => w.isTemplate) });
  });
  app.get('/api/pipelines/:id', async (c) => {
    const pipelineEntity = new PipelineEntity(c.env, c.req.param('id'));
    if (!await pipelineEntity.exists()) return notFound(c);
    const pipeline = await pipelineEntity.getState();
    const { items: allDeals } = await DealEntity.list(c.env);
    const pipelineDeals = allDeals.filter(deal => pipeline.stages.includes(deal.stage));
    return ok(c, { ...pipeline, deals: pipelineDeals });
  });
  app.get('/api/users', async (c) => ok(c, await UserEntity.list(c.env)));
  app.get('/api/articles', async (c) => {
    const { role } = c.req.query();
    const { items } = await ArticleEntity.list(c.env);
    return ok(c, { items: items.filter(a => a.role === 'all' || a.role === role) });
  });
  app.get('/api/projects', async (c) => {
    const { orgId } = c.req.query();
    const { items } = await ProjectEntity.list(c.env);
    return ok(c, { items: orgId ? items.filter(p => p.orgId === orgId) : items });
  });
  app.get('/api/templates', async (c) => {
    const { type } = c.req.query();
    const { items } = await TemplateEntity.list(c.env);
    return ok(c, { items: type ? items.filter(t => t.type === type) : items });
  });
  app.get('/api/tickets', async (c) => {
    const { orgId } = c.req.query();
    const { items } = await TicketEntity.list(c.env);
    return ok(c, { items: orgId ? items.filter(t => t.orgId === orgId) : items });
  });
  app.post('/api/tickets', async (c) => {
    const data = await c.req.json();
    const ticket = await TicketEntity.create(c.env, { ...TicketEntity.initialState, ...data, id: crypto.randomUUID(), createdAt: Date.now() });
    return ok(c, ticket);
  });
  app.get('/api/:entity/export', async (c) => {
    const { entity } = c.req.param();
    let EntityClass: any;
    if (entity === 'contacts') EntityClass = ContactEntity;
    else if (entity === 'deals') EntityClass = DealEntity;
    else if (entity === 'projects') EntityClass = ProjectEntity;
    else return bad(c, 'Invalid entity for export');
    const { items } = await EntityClass.list(c.env, null, 1000);
    return ok(c, items);
  });
}