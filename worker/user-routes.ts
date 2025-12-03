import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ContactEntity, PipelineEntity, DealEntity, WorkflowEntity, EmailTemplateEntity, SMSTemplateEntity, CampaignEntity, ConversationEntity, PageEntity, FunnelEntity, AppointmentEntity, AvailabilityEntity, CalendarEventEntity, IntegrationEntity, OrganizationEntity, WorkspaceEntity, BillingEntity, RoleEntity, WebhookEntity, APIKeyEntity, ReportEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Contact, Pipeline, Deal, Workflow, WorkflowNode, WorkflowEdge, Campaign, Conversation, Message, Page, Funnel, Appointment, Availability, Integration, Organization, Workspace, Billing, APIKey } from "@shared/types";
import { MOCK_REPORTS, MOCK_WEBHOOKS, MOCK_API_KEYS, MOCK_PAGES, MOCK_BILLING } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Seed all data on first request to any user route
  app.use('/api/*', async (c, next) => {
    await Promise.all([
      UserEntity.ensureSeed(c.env), ChatBoardEntity.ensureSeed(c.env), ContactEntity.ensureSeed(c.env),
      PipelineEntity.ensureSeed(c.env), DealEntity.ensureSeed(c.env), WorkflowEntity.ensureSeed(c.env),
      WebhookEntity.ensureSeed(c.env), APIKeyEntity.ensureSeed(c.env), ReportEntity.ensureSeed(c.env),
      BillingEntity.ensureSeed(c.env)
    ]);
    await next();
  });
  // Existing routes...
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
  // Workflow routes...
  app.get('/api/workflows', async (c) => {
    const page = await WorkflowEntity.list(c.env);
    page.items = page.items.filter(w => !w.isTemplate);
    return ok(c, page);
  });
  app.get('/api/workflows/templates', async (c) => {
    const page = await WorkflowEntity.list(c.env);
    page.items = page.items.filter(w => w.isTemplate);
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
  // --- NEW ROUTES FOR PHASE 13 ---
  // Webhooks
  app.get('/api/webhooks', async (c) => ok(c, await WebhookEntity.list(c.env)));
  app.post('/api/webhooks/:id/test', async (c) => {
    const webhook = new WebhookEntity(c.env, c.req.param('id'));
    if (!await webhook.exists()) return notFound(c);
    await webhook.test(); // This just console.logs in the mock
    return ok(c, { message: 'Test event sent' });
  });
  // API Keys
  app.get('/api/apikeys', async (c) => ok(c, await APIKeyEntity.list(c.env)));
  app.post('/api/apikeys', async (c) => {
    // In a real app, you'd get userId from auth context
    const key = await APIKeyEntity.generate(c.env, 'u1', ['*:*']);
    return ok(c, key);
  });
  // Billing
  app.get('/api/billing/:orgId', async (c) => {
    const billing = new BillingEntity(c.env, `bill-${c.req.param('orgId').slice(-1)}`);
    if (!await billing.exists()) return notFound(c);
    return ok(c, await billing.getState());
  });
  app.post('/api/billing/:orgId/upgrade', async (c) => {
    return ok(c, { url: 'https://stripe.com/mock-checkout' });
  });
  // Reports
  app.get('/api/reports', async (c) => ok(c, await ReportEntity.list(c.env)));
  // Other routes...
  app.get('/api/campaigns', async (c) => { await CampaignEntity.ensureSeed(c.env); return ok(c, await CampaignEntity.list(c.env)); });
  app.get('/api/inbox', async (c) => { await ConversationEntity.ensureSeed(c.env); return ok(c, await ConversationEntity.list(c.env)); });
  app.get('/api/calendar/events', async (c) => { await CalendarEventEntity.ensureSeed(c.env); return ok(c, await CalendarEventEntity.list(c.env)); });
  app.get('/api/funnels', async (c) => { await FunnelEntity.ensureSeed(c.env); return ok(c, await FunnelEntity.list(c.env)); });
  app.get('/api/pages/:id', async (c) => {
    const page = new PageEntity(c.env, c.req.param('id'));
    if (!await page.exists()) {
      const mockPage = MOCK_PAGES.find(p => p.id === c.req.param('id'));
      if (mockPage) { await PageEntity.create(c.env, mockPage); return ok(c, mockPage); }
      return notFound(c);
    }
    return ok(c, await page.getState());
  });
}