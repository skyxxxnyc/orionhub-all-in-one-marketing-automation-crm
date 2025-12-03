import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ContactEntity, PipelineEntity, DealEntity, WorkflowEntity, EmailTemplateEntity, SMSTemplateEntity, CampaignEntity, ConversationEntity, PageEntity, FunnelEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Contact, Pipeline, Deal, Workflow, WorkflowNode, WorkflowEdge, Campaign, Conversation, Message, Page, Funnel } from "@shared/types";
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
  app.delete('/api/workflows/:id', async (c) => {
    const deleted = await WorkflowEntity.delete(c.env, c.req.param('id'));
    return ok(c, { id: c.req.param('id'), deleted });
  });
  app.post('/api/workflows/:id/simulate', async (c) => {
    // Mock simulation
    const workflow = new WorkflowEntity(c.env, c.req.param('id'));
    if (!await workflow.exists()) return notFound(c, 'workflow not found');
    const state = await workflow.getState();
    const path = state.nodes.map(n => n.id);
    return ok(c, { path, results: 'Simulation complete' });
  });
  // TEMPLATES
  app.get('/api/templates/email', async (c) => {
    await EmailTemplateEntity.ensureSeed(c.env);
    return ok(c, await EmailTemplateEntity.list(c.env));
  });
  app.get('/api/templates/sms', async (c) => {
    await SMSTemplateEntity.ensureSeed(c.env);
    return ok(c, await SMSTemplateEntity.list(c.env));
  });
  // CAMPAIGNS
  app.get('/api/campaigns', async (c) => {
    await CampaignEntity.ensureSeed(c.env);
    const page = await CampaignEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/campaigns', async (c) => {
    const body = (await c.req.json()) as Partial<Campaign>;
    if (!isStr(body.name) || !isStr(body.type) || !isStr(body.templateId)) return bad(c, 'name, type, and templateId required');
    const newCampaign: Campaign = {
      id: crypto.randomUUID(),
      name: body.name,
      type: body.type,
      templateId: body.templateId,
      status: 'draft',
      analytics: { sends: 0, deliveries: 0, opens: 0, clicks: 0 },
      scheduledAt: body.scheduledAt,
    };
    if (body.scheduledAt) newCampaign.status = 'scheduled';
    return ok(c, await CampaignEntity.create(c.env, newCampaign));
  });
  app.post('/api/campaigns/:id/send', async (c) => {
    const campaign = new CampaignEntity(c.env, c.req.param('id'));
    if (!await campaign.exists()) return notFound(c, 'campaign not found');
    await campaign.send();
    return ok(c, { success: true, deliveryId: crypto.randomUUID() });
  });
  // INBOX / CONVERSATIONS
  app.get('/api/inbox', async (c) => {
    await ConversationEntity.ensureSeed(c.env);
    const page = await ConversationEntity.list(c.env);
    // Sort by most recent message
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
  app.put('/api/conversations/:id/status', async (c) => {
    const conversation = new ConversationEntity(c.env, c.req.param('id'));
    if (!await conversation.exists()) return notFound(c, 'conversation not found');
    const { status } = (await c.req.json()) as { status?: 'open' | 'closed' };
    if (status !== 'open' && status !== 'closed') return bad(c, 'valid status is required');
    return ok(c, await conversation.updateStatus(status));
  });
  // PAGES & FUNNELS
  app.get('/api/pages', async (c) => {
    await PageEntity.ensureSeed(c.env);
    return ok(c, await PageEntity.list(c.env));
  });
  app.post('/api/pages', async (c) => {
    const { name } = (await c.req.json()) as Partial<Page>;
    if (!isStr(name)) return bad(c, 'name is required');
    const newPage: Page = {
      id: crypto.randomUUID(),
      name,
      content: [],
      analytics: { views: 0, conversions: 0 },
      createdAt: Date.now(),
    };
    return ok(c, await PageEntity.create(c.env, newPage));
  });
  app.get('/api/pages/:id', async (c) => {
    const page = new PageEntity(c.env, c.req.param('id'));
    if (!await page.exists()) return notFound(c, 'page not found');
    return ok(c, await page.getState());
  });
  app.put('/api/pages/:id', async (c) => {
    const page = new PageEntity(c.env, c.req.param('id'));
    if (!await page.exists()) return notFound(c, 'page not found');
    const patch = (await c.req.json()) as Partial<Page>;
    await page.patch(patch);
    return ok(c, await page.getState());
  });
  app.post('/api/pages/:id/track', async (c) => {
    const page = new PageEntity(c.env, c.req.param('id'));
    if (!await page.exists()) return notFound(c, 'page not found');
    const { type } = (await c.req.json()) as { type: 'view' | 'conversion' };
    if (type === 'conversion') {
      await page.trackConversion();
    } else {
      await page.trackView();
    }
    return ok(c, { success: true });
  });
  app.get('/api/funnels', async (c) => {
    await FunnelEntity.ensureSeed(c.env);
    return ok(c, await FunnelEntity.list(c.env));
  });
  app.post('/api/funnels', async (c) => {
    const { name } = (await c.req.json()) as Partial<Funnel>;
    if (!isStr(name)) return bad(c, 'name is required');
    const newFunnel: Funnel = {
      id: crypto.randomUUID(),
      name,
      steps: [],
      createdAt: Date.now(),
    };
    return ok(c, await FunnelEntity.create(c.env, newFunnel));
  });
  app.get('/api/funnels/:id', async (c) => {
    const funnel = new FunnelEntity(c.env, c.req.param('id'));
    if (!await funnel.exists()) return notFound(c, 'funnel not found');
    return ok(c, await funnel.getState());
  });
  // DELETE: Users
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/users/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await UserEntity.deleteMany(c.env, list), ids: list });
  });
  // DELETE: Chats
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/chats/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await ChatBoardEntity.deleteMany(c.env, list), ids: list });
  });
}