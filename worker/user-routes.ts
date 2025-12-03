import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ContactEntity, PipelineEntity, DealEntity, WorkflowEntity, EmailTemplateEntity, SMSTemplateEntity, CampaignEntity, ConversationEntity, PageEntity, FunnelEntity, AppointmentEntity, AvailabilityEntity, CalendarEventEntity, IntegrationEntity, OrganizationEntity, WorkspaceEntity, BillingEntity, RoleEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Contact, Pipeline, Deal, Workflow, WorkflowNode, WorkflowEdge, Campaign, Conversation, Message, Page, Funnel, Appointment, Availability, Integration, Organization, Workspace, Billing } from "@shared/types";
import { MOCK_REPORTS, MOCK_WEBHOOKS, MOCK_API_KEYS, MOCK_PAGES } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Existing routes (Users, Chats, Contacts, etc.) are unchanged...
  app.get('/api/users', async (c) => { await UserEntity.ensureSeed(c.env); const p = await UserEntity.list(c.env); return ok(c, p); });
  app.get('/api/chats', async (c) => { await ChatBoardEntity.ensureSeed(c.env); const p = await ChatBoardEntity.list(c.env); return ok(c, p); });
  app.get('/api/contacts', async (c) => { await ContactEntity.ensureSeed(c.env); const p = await ContactEntity.list(c.env); return ok(c, p); });
  app.get('/api/pipelines/:id', async (c) => {
    await PipelineEntity.ensureSeed(c.env); await DealEntity.ensureSeed(c.env);
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
  // --- NEW & ENHANCED WORKFLOW ROUTES ---
  // List workflows (excluding templates)
  app.get('/api/workflows', async (c) => {
    await WorkflowEntity.ensureSeed(c.env);
    const page = await WorkflowEntity.list(c.env);
    page.items = page.items.filter(w => !w.isTemplate);
    return ok(c, page);
  });
  // List workflow templates
  app.get('/api/workflows/templates', async (c) => {
    await WorkflowEntity.ensureSeed(c.env);
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
  // Simulate a workflow run
  app.post('/api/workflows/:id/simulate', async (c) => {
    const workflow = new WorkflowEntity(c.env, c.req.param('id'));
    if (!await workflow.exists()) return notFound(c, 'workflow not found');
    const { contactId } = await c.req.json() as { contactId: string };
    if (!contactId) return bad(c, 'contactId is required');
    const log = await workflow.simulateRun(contactId);
    return ok(c, log);
  });
  // Pause/Resume a workflow
  app.patch('/api/workflows/:id/pause', async (c) => {
    const workflow = new WorkflowEntity(c.env, c.req.param('id'));
    if (!await workflow.exists()) return notFound(c);
    return ok(c, await workflow.pause());
  });
  app.patch('/api/workflows/:id/resume', async (c) => {
    const workflow = new WorkflowEntity(c.env, c.req.param('id'));
    if (!await workflow.exists()) return notFound(c);
    return ok(c, await workflow.resume());
  });
  // Get analytics for a workflow (mocked)
  app.get('/api/workflows/:id/analytics', (c) => {
    return ok(c, { runs: 125, completions: 110, dropoffs: 15 });
  });
  // Get journey for a contact (mocked)
  app.get('/api/journeys/:contactId', async (c) => {
    const contact = new ContactEntity(c.env, c.req.param('contactId'));
    if (!await contact.exists()) return notFound(c);
    const state = await contact.getState();
    // Mock journey from activities
    const journey = state.activities.filter(a => a.type === 'automation');
    return ok(c, journey);
  });
  // Other existing routes...
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
  app.put('/api/pages/:id', async (c) => {
    const page = new PageEntity(c.env, c.req.param('id'));
    if (!await page.exists()) return notFound(c);
    const patch = await c.req.json() as Partial<Page>;
    await page.patch(patch);
    return ok(c, await page.getState());
  });
}