import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ContactEntity, PipelineEntity, DealEntity, WorkflowEntity, EmailTemplateEntity, SMSTemplateEntity, CampaignEntity, ConversationEntity, PageEntity, FunnelEntity, AppointmentEntity, AvailabilityEntity, CalendarEventEntity, IntegrationEntity, OrganizationEntity, WorkspaceEntity, BillingEntity, RoleEntity, WebhookEntity, APIKeyEntity, ReportEntity, TicketEntity, ProjectEntity, TemplateEntity, ChatSessionEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Contact, Pipeline, Deal, Workflow, WorkflowNode, WorkflowEdge, Campaign, Conversation, Message, Page, Funnel, Appointment, Availability, Integration, Organization, Workspace, Billing, APIKey, Ticket, CalendarEvent, WorkflowState, Project, Template, ChatSession } from "@shared/types";
import { MOCK_REPORTS, MOCK_WEBHOOKS, MOCK_API_KEYS, MOCK_PAGES, MOCK_BILLING, MOCK_WORKSPACES, MOCK_PAGE_TEMPLATES } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Seed all data on first request to any user route
  app.use('/api/*', async (c, next) => {
    await Promise.all([
      UserEntity.ensureSeed(c.env), ChatBoardEntity.ensureSeed(c.env), ContactEntity.ensureSeed(c.env),
      PipelineEntity.ensureSeed(c.env), DealEntity.ensureSeed(c.env), WorkflowEntity.ensureSeed(c.env),
      WebhookEntity.ensureSeed(c.env), APIKeyEntity.ensureSeed(c.env), ReportEntity.ensureSeed(c.env),
      BillingEntity.ensureSeed(c.env), OrganizationEntity.ensureSeed(c.env), WorkspaceEntity.ensureSeed(c.env),
      TicketEntity.ensureSeed(c.env), CalendarEventEntity.ensureSeed(c.env), PageEntity.ensureSeed(c.env),
      ProjectEntity.ensureSeed(c.env), TemplateEntity.ensureSeed(c.env), ChatSessionEntity.ensureSeed(c.env),
    ]);
    await next();
  });
  // --- Project & Template Routes ---
  app.get('/api/projects', async (c) => {
    const { orgId } = c.req.query();
    if (!orgId) return bad(c, 'orgId required');
    const all = await ProjectEntity.list(c.env);
    const filtered = all.items.filter(p => p.orgId === orgId);
    return ok(c, { items: filtered });
  });
  app.post('/api/projects', async (c) => {
    const data = await c.req.json() as Partial<Project>;
    if (!data.orgId) return bad(c, 'orgId required');
    const projectData = { ...ProjectEntity.initialState, ...data, id: crypto.randomUUID(), createdAt: Date.now() };
    const project = await ProjectEntity.create(c.env, projectData);
    return ok(c, project);
  });
  app.get('/api/templates', async (c) => {
    const { type, orgId } = c.req.query();
    let { items } = await TemplateEntity.list(c.env);
    if (type) items = items.filter(t => t.type === type);
    if (orgId) items = items.filter(t => t.orgId === orgId || t.public);
    return ok(c, { items });
  });
  app.post('/api/ai/templates', async (c) => {
    const { prompt, type, orgId } = await c.req.json();
    if (!prompt || !type || !orgId) return bad(c, 'prompt, type, and orgId are required');
    // Mock Perplexity response parsing
    const generatedTemplate: Template = {
      id: `template-ai-${crypto.randomUUID()}`,
      name: `AI: ${prompt.substring(0, 20)}...`,
      description: prompt,
      type: type as Template['type'],
      category: 'AI Generated',
      industry: 'various',
      complexity: 'medium',
      isUserGenerated: true,
      public: false,
      orgId,
      metrics: { views: 0, completions: 0, adoption: 0 },
    };
    await TemplateEntity.create(c.env, generatedTemplate);
    return ok(c, generatedTemplate);
  });
  // --- Integration Routes ---
  const checkSecret = (c: any) => c.req.header('PICA_SECRET_KEY') === 'mock-secret';
  app.post('/api/gmail/send', async (c) => {
    if (!checkSecret(c)) return bad(c, 'Unauthorized');
    return ok(c, { success: true, messageId: crypto.randomUUID() });
  });
  app.post('/api/calendar/quickAdd', async (c) => {
    if (!checkSecret(c)) return bad(c, 'Unauthorized');
    const { text } = await c.req.json();
    const eventData: CalendarEvent = { id: crypto.randomUUID(), title: text, start: Date.now(), end: Date.now() + 3600000 };
    await CalendarEventEntity.create(c.env, eventData);
    return ok(c, eventData);
  });
  app.post('/api/perplexity/completions', async (c) => {
    if (!checkSecret(c)) return bad(c, 'Unauthorized');
    const { prompt } = await c.req.json();
    const mockResponse = { choices: [{ message: { content: `Mock research for "${prompt}"` } }] };
    return ok(c, mockResponse);
  });
  // --- Chatbot Routes ---
  app.get('/api/chat/:contactId/sessions', async (c) => {
    const { contactId } = c.req.param();
    const all = await ChatSessionEntity.list(c.env);
    const items = all.items.filter(s => s.contactId === contactId);
    return ok(c, { items });
  });
  app.post('/api/chat/sessions/:id/message', async (c) => {
    const session = new ChatSessionEntity(c.env, c.req.param('id'));
    if (!await session.exists()) return notFound(c);
    const { text } = await c.req.json();
    const userMessage: Message = { id: crypto.randomUUID(), from: 'user', text, direction: 'out', timestamp: Date.now() };
    const aiResponse: Message = { id: crypto.randomUUID(), from: 'AI Assistant', text: `This is a mock AI response to: "${text}"`, direction: 'in', timestamp: Date.now() + 1000 };
    await session.mutate(s => ({ ...s, messages: [...s.messages, userMessage, aiResponse] }));
    return ok(c, await session.getState());
  });
  app.post('/api/chat/sessions/:id/escalate', async (c) => {
    const session = new ChatSessionEntity(c.env, c.req.param('id'));
    if (!await session.exists()) return notFound(c);
    const { orgId } = await c.req.json();
    const sessionState = await session.getState();
    const ticketData: Ticket = {
      ...TicketEntity.initialState,
      id: crypto.randomUUID(),
      title: `Chat Escalation: ${sessionState.contactId}`,
      description: sessionState.messages.map(m => `${m.from}: ${m.text}`).join('\n'),
      orgId,
      createdAt: Date.now(),
    };
    const ticket = await TicketEntity.create(c.env, ticketData);
    await session.patch({ escalatedToTicket: ticket.id });
    return ok(c, ticket);
  });
  // --- Existing Routes ---
  app.get('/api/users', async (c) => ok(c, await UserEntity.list(c.env)));
  app.get('/api/chats', async (c) => ok(c, await ChatBoardEntity.list(c.env)));
  app.get('/api/contacts', async (c) => ok(c, await ContactEntity.list(c.env)));
  app.get('/api/pipelines/:id', async (c) => {
    const pipelineEntity = new PipelineEntity(c.env, c.req.param('id'));
    if (!await pipelineEntity.exists()) return notFound(c, 'pipeline not found');
    const pipeline = await pipelineEntity.getState();
    const allDeals = (await DealEntity.list(c.env)).items;
    const pipelineDeals = allDeals.filter(deal => pipeline.stages.includes(deal.stage));
    return ok(c, { ...pipeline, deals: pipelineDeals });
  });
  app.put('/api/deals/:id', async (c) => {
    const deal = new DealEntity(c.env, c.req.param('id'));
    if (!await deal.exists()) return notFound(c);
    const { stage } = await c.req.json() as Partial<Deal>;
    if (!stage) return bad(c, 'stage required');
    await deal.patch({ stage, updatedAt: Date.now() });
    return ok(c, await deal.getState());
  });
  app.get('/api/workflows', async (c) => {
    const page = await WorkflowEntity.list(c.env);
    page.items = page.items.filter(w => !w.isTemplate);
    return ok(c, page);
  });
  app.get('/api/workflows/:id', async (c) => {
    const workflow = new WorkflowEntity(c.env, c.req.param('id'));
    if (!await workflow.exists()) return notFound(c, 'workflow not found');
    return ok(c, await workflow.getState());
  });
  app.put('/api/workflows/:id', async (c) => {
    const workflow = new WorkflowEntity(c.env, c.req.param('id'));
    if (!await workflow.exists()) return notFound(c, 'workflow not found');
    const { nodes, edges } = (await c.req.json()) as { nodes?: WorkflowNode[]; edges?: WorkflowEdge[] };
    if (!nodes || !edges) return bad(c, 'nodes and edges are required');
    return ok(c, await workflow.update(nodes, edges));
  });
  app.get('/api/pages/:id', async (c) => {
    const page = new PageEntity(c.env, c.req.param('id'));
    if (!await page.exists()) return notFound(c);
    return ok(c, await page.getState());
  });
  app.get('/api/tickets', async (c) => {
    const { orgId } = c.req.query();
    if (orgId) return ok(c, await TicketEntity.listByOrg(c.env, orgId));
    return ok(c, await TicketEntity.list(c.env));
  });
  app.post('/api/tickets', async (c) => {
    const data = await c.req.json() as Partial<Ticket>;
    if (!data.title || !data.description || !data.orgId) return bad(c, 'Missing required fields');
    const ticketData: Ticket = { ...TicketEntity.initialState, ...data, id: crypto.randomUUID(), createdAt: Date.now() };
    const ticket = await TicketEntity.create(c.env, ticketData);
    return ok(c, ticket);
  });
  app.get('/api/:entity/export', async (c) => {
    const { entity } = c.req.param();
    let EntityClass;
    switch (entity) {
      case 'contacts': EntityClass = ContactEntity; break;
      case 'deals': EntityClass = DealEntity; break;
      case 'projects': EntityClass = ProjectEntity; break;
      default: return bad(c, 'Invalid entity type for export');
    }
    const { items } = await EntityClass.list(c.env, null, 1000);
    return ok(c, items);
  });
}