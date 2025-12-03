import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ContactEntity, PipelineEntity, DealEntity, WorkflowEntity, EmailTemplateEntity, SMSTemplateEntity, CampaignEntity, ConversationEntity, PageEntity, FunnelEntity, AppointmentEntity, AvailabilityEntity, CalendarEventEntity, IntegrationEntity, OrganizationEntity, WorkspaceEntity, BillingEntity, RoleEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Contact, Pipeline, Deal, Workflow, WorkflowNode, WorkflowEdge, Campaign, Conversation, Message, Page, Funnel, Appointment, Availability, Integration, Organization, Workspace, Billing } from "@shared/types";
import { MOCK_REPORTS, MOCK_WEBHOOKS, MOCK_API_KEYS, MOCK_PAGES } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // CONTACTS
  app.get('/api/contacts', async (c) => {
    await ContactEntity.ensureSeed(c.env);
    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit');
    const search = c.req.query('search');
    const page = await ContactEntity.list(c.env, cursor ?? null, limit ? Math.max(1, (Number(limit) | 0)) : 20);
    if (search) {
      const lowerSearch = search.toLowerCase();
      page.items = page.items.filter(
        (contact) =>
          contact.name.toLowerCase().includes(lowerSearch) ||
          contact.email?.toLowerCase().includes(lowerSearch)
      );
    }
    return ok(c, page);
  });
  app.post('/api/contacts', async (c) => {
    const { name, email } = (await c.req.json()) as Partial<Contact>;
    if (!name?.trim()) return bad(c, 'name is required');
    const newContact: Contact = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email?.trim(),
      tags: [],
      customFields: {},
      activities: [],
      createdAt: Date.now(),
    };
    return ok(c, await ContactEntity.create(c.env, newContact));
  });
  app.post('/api/contacts/import', async (c) => {
    const contacts = (await c.req.json()) as Partial<Contact>[];
    if (!Array.isArray(contacts) || contacts.length === 0) return bad(c, 'contacts array is required');
    const createdContacts: Contact[] = [];
    for (const contact of contacts) {
      if (!contact.name) continue;
      const newContact: Contact = {
        id: crypto.randomUUID(),
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        tags: contact.tags || [],
        customFields: contact.customFields || {},
        activities: [],
        createdAt: Date.now(),
      };
      createdContacts.push(await ContactEntity.create(c.env, newContact));
    }
    return ok(c, createdContacts);
  });
  app.get('/api/contacts/:id', async (c) => {
    const contact = new ContactEntity(c.env, c.req.param('id'));
    if (!await contact.exists()) return notFound(c, 'contact not found');
    return ok(c, await contact.getState());
  });
  app.put('/api/contacts/:id', async (c) => {
    const contact = new ContactEntity(c.env, c.req.param('id'));
    if (!await contact.exists()) return notFound(c, 'contact not found');
    const patch = (await c.req.json()) as Partial<Contact>;
    await contact.patch(patch);
    return ok(c, await contact.getState());
  });
  app.delete('/api/contacts/:id', async (c) => {
    const deleted = await ContactEntity.delete(c.env, c.req.param('id'));
    return ok(c, { id: c.req.param('id'), deleted });
  });
  app.post('/api/contacts/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    const deletedCount = await ContactEntity.deleteMany(c.env, list);
    return ok(c, { deletedCount, ids: list });
  });
  // PIPELINES
  app.get('/api/pipelines', async (c) => {
    await PipelineEntity.ensureSeed(c.env);
    const page = await PipelineEntity.list(c.env);
    return ok(c, page.items);
  });
  app.get('/api/pipelines/:id', async (c) => {
    await PipelineEntity.ensureSeed(c.env);
    await DealEntity.ensureSeed(c.env);
    const pipelineEntity = new PipelineEntity(c.env, c.req.param('id'));
    if (!await pipelineEntity.exists()) return notFound(c, 'pipeline not found');
    const pipeline = await pipelineEntity.getState();
    const allDeals = (await DealEntity.list(c.env)).items;
    const pipelineDeals = allDeals.filter(deal => pipeline.stages.includes(deal.stage));
    const response: Pipeline = { ...pipeline, deals: pipelineDeals };
    return ok(c, response);
  });
  // DEALS
  app.put('/api/deals/:id', async (c) => {
    const dealEntity = new DealEntity(c.env, c.req.param('id'));
    if (!await dealEntity.exists()) return notFound(c, 'deal not found');
    const { stage } = (await c.req.json()) as Partial<Deal>;
    if (!isStr(stage)) return bad(c, 'stage is required');
    const updatedDeal = await dealEntity.updateStage(stage);
    return ok(c, updatedDeal);
  });
  // WORKFLOWS
  app.get('/api/workflows', async (c) => {
    await WorkflowEntity.ensureSeed(c.env);
    const page = await WorkflowEntity.list(c.env);
    return ok(c, page);
  });
  app.get('/api/workflows/:id', async (c) => {
    const workflow = new WorkflowEntity(c.env, c.req.param('id'));
    if (!await workflow.exists()) return notFound(c, 'workflow not found');
    return ok(c, await workflow.getState());
  });
  app.post('/api/workflows', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!isStr(name)) return bad(c, 'name is required');
    const newWorkflow: Workflow = {
      id: crypto.randomUUID(),
      name,
      nodes: [],
      edges: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return ok(c, await WorkflowEntity.create(c.env, newWorkflow));
  });
  app.put('/api/workflows/:id', async (c) => {
    const workflow = new WorkflowEntity(c.env, c.req.param('id'));
    if (!await workflow.exists()) return notFound(c, 'workflow not found');
    const { nodes, edges } = (await c.req.json()) as { nodes?: WorkflowNode[]; edges?: WorkflowEdge[] };
    if (!nodes || !edges) return bad(c, 'nodes and edges are required');
    return ok(c, await workflow.update(nodes, edges));
  });
  // CAMPAIGNS
  app.get('/api/campaigns', async (c) => {
    await CampaignEntity.ensureSeed(c.env);
    const page = await CampaignEntity.list(c.env);
    return ok(c, page);
  });
  // INBOX
  app.get('/api/inbox', async (c) => {
    await ConversationEntity.ensureSeed(c.env);
    const page = await ConversationEntity.list(c.env);
    page.items.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    return ok(c, page);
  });
  app.post('/api/conversations/:id/messages', async (c) => {
    const conversation = new ConversationEntity(c.env, c.req.param('id'));
    if (!await conversation.exists()) return notFound(c, 'conversation not found');
    const { text, from } = (await c.req.json()) as { text?: string; from?: string };
    if (!isStr(text)) return bad(c, 'text is required');
    const message: Omit<Message, 'id'> = {
      text,
      from: from || 'user',
      direction: 'out',
      timestamp: Date.now(),
    };
    return ok(c, await conversation.addMessage(message));
  });
  // CALENDAR
  app.get('/api/calendar/events', async (c) => {
    await CalendarEventEntity.ensureSeed(c.env);
    return ok(c, await CalendarEventEntity.list(c.env));
  });
  app.get('/api/appointments/:id', async (c) => {
    const appointment = new AppointmentEntity(c.env, c.req.param('id'));
    if (!await appointment.exists()) return notFound(c, 'appointment not found');
    return ok(c, await appointment.getState());
  });
  app.post('/api/appointments', async (c) => {
    const body = (await c.req.json()) as Partial<Appointment>;
    if (!isStr(body.title) || !body.start || !body.end) return bad(c, 'title, start, and end are required');
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      title: body.title,
      start: body.start,
      end: body.end,
      type: body.type || 'Meeting',
      status: 'scheduled',
      bufferBefore: body.bufferBefore || 0,
      bufferAfter: body.bufferAfter || 0,
      contactId: body.contactId,
    };
    return ok(c, await AppointmentEntity.create(c.env, newAppointment));
  });
  app.put('/api/appointments/:id', async (c) => {
    const appointment = new AppointmentEntity(c.env, c.req.param('id'));
    if (!await appointment.exists()) return notFound(c, 'appointment not found');
    const patch = (await c.req.json()) as Partial<Appointment>;
    await appointment.patch(patch);
    return ok(c, await appointment.getState());
  });
  // INTEGRATIONS
  app.get('/api/integrations', async (c) => {
    await IntegrationEntity.ensureSeed(c.env);
    return ok(c, await IntegrationEntity.list(c.env));
  });
  app.post('/api/integrations/connect', async (c) => {
    const { type } = (await c.req.json()) as { type?: 'google' | 'outlook' };
    if (!type) return bad(c, 'type is required');
    const all = (await IntegrationEntity.list(c.env)).items;
    const integration = all.find(i => i.type === type);
    if (!integration) return notFound(c, 'integration not found');
    const entity = new IntegrationEntity(c.env, integration.id);
    await entity.connect();
    return ok(c, { success: true, message: `${type} connected` });
  });
  // BILLING
  app.get('/api/billing/:orgId', async (c) => {
    await BillingEntity.ensureSeed(c.env);
    const all = (await BillingEntity.list(c.env)).items;
    const billing = all.find(b => b.orgId === c.req.param('orgId'));
    if (!billing) return notFound(c, 'billing info not found');
    return ok(c, billing);
  });
  // FUNNELS & PAGES
  app.get('/api/funnels', async (c) => {
    await FunnelEntity.ensureSeed(c.env);
    return ok(c, await FunnelEntity.list(c.env));
  });
  app.get('/api/pages/:id', async (c) => {
    const page = new PageEntity(c.env, c.req.param('id'));
    if (!await page.exists()) {
      // Seed if not found for demo purposes
      const mockPage = MOCK_PAGES.find(p => p.id === c.req.param('id'));
      if (mockPage) {
        await PageEntity.create(c.env, mockPage);
        return ok(c, mockPage);
      }
      return notFound(c, 'page not found');
    }
    return ok(c, await page.getState());
  });
  app.put('/api/pages/:id', async (c) => {
    const page = new PageEntity(c.env, c.req.param('id'));
    if (!await page.exists()) return notFound(c, 'page not found');
    const patch = await c.req.json() as Partial<Page>;
    await page.patch(patch);
    return ok(c, await page.getState());
  });
  // REPORTS
  app.get('/api/reports/:orgId', async (c) => {
    const orgId = c.req.param('orgId');
    if (!await OrganizationEntity.exists(c.env, orgId)) return notFound(c, 'organization not found');
    const report = MOCK_REPORTS.find(r => r.orgId === orgId);
    return ok(c, report || { metrics: { totalRevenue: 0, subAccounts: 0, conversionRate: 0 } });
  });
  app.get('/api/webhooks', (c) => ok(c, MOCK_WEBHOOKS));
  app.post('/api/webhooks', async (c) => {
    const { url, events } = await c.req.json() as { url?: string, events?: string[] };
    if (!isStr(url) || !Array.isArray(events)) return bad(c, 'url and events are required');
    const newWebhook = { id: `wh-${crypto.randomUUID()}`, url, events, active: true };
    MOCK_WEBHOOKS.push(newWebhook);
    return ok(c, newWebhook);
  });
  app.get('/api/api-keys', (c) => ok(c, MOCK_API_KEYS));
  app.post('/api/api-keys', async (c) => {
    const { userId, permissions } = await c.req.json() as { userId?: string, permissions?: string[] };
    if (!isStr(userId) || !Array.isArray(permissions)) return bad(c, 'userId and permissions are required');
    const newKey = { id: `key-${crypto.randomUUID()}`, userId, key: `mock-api-key-${crypto.randomUUID()}`, permissions };
    MOCK_API_KEYS.push(newKey);
    return ok(c, newKey);
  });
  app.post('/api/export', async (c) => {
    const { entity } = await c.req.json() as { entity?: 'contacts' | 'deals' };
    if (entity === 'contacts') {
      const contacts = await ContactEntity.list(c.env);
      return ok(c, contacts.items);
    }
    if (entity === 'deals') {
      const deals = await DealEntity.list(c.env);
      return ok(c, deals.items);
    }
    return bad(c, 'Invalid entity type for export');
  });
}