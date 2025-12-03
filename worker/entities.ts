import { IndexedEntity } from "./core-utils";
import type { Env } from './core-utils';
import type { User, Chat, ChatMessage, Contact, ContactActivity, Pipeline, Deal, Workflow, WorkflowNode, WorkflowEdge, EmailTemplate, SMSTemplate, Campaign, Conversation, Message, Page, Funnel, FunnelStep, Appointment, Availability, CalendarEvent, Integration, Organization, Workspace, Billing, Role, Webhook, APIKey, ReportMetrics } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_CONTACTS, MOCK_PIPELINES, MOCK_DEALS, MOCK_WORKFLOWS, MOCK_EMAIL_TEMPLATES, MOCK_SMS_TEMPLATES, MOCK_CAMPAIGNS, MOCK_CONVERSATIONS, MOCK_PAGES, MOCK_FUNNELS, MOCK_APPOINTMENTS, MOCK_AVAILABILITIES, MOCK_CALENDAR_EVENTS, MOCK_INTEGRATIONS, MOCK_ORGANIZATIONS, MOCK_WORKSPACES, MOCK_BILLING, MOCK_ROLES, MOCK_WEBHOOKS, MOCK_API_KEYS, MOCK_REPORTS } from "@shared/mock-data";
// USER ENTITY
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user"; static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" }; static seedData = MOCK_USERS;
}
// CHAT BOARD ENTITY
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({ ...c, messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id) }));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat"; static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] }; static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> { const { messages } = await this.getState(); return messages; }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] })); return msg;
  }
}
// CONTACT ENTITY
export class ContactEntity extends IndexedEntity<Contact> {
  static readonly entityName = "contact"; static readonly indexName = "contacts";
  static readonly initialState: Contact = { id: "", name: "", tags: [], customFields: {}, activities: [], createdAt: 0 }; static seedData = MOCK_CONTACTS;
}
// PIPELINE ENTITY
type PipelineState = Omit<Pipeline, 'deals'>;
export class PipelineEntity extends IndexedEntity<PipelineState> {
  static readonly entityName = "pipeline"; static readonly indexName = "pipelines";
  static readonly initialState: PipelineState = { id: "", name: "", stages: [] }; static seedData = MOCK_PIPELINES;
}
// DEAL ENTITY
export class DealEntity extends IndexedEntity<Deal> {
  static readonly entityName = "deal"; static readonly indexName = "deals";
  static readonly initialState: Deal = { id: "", title: "", value: 0, stage: "", createdAt: 0, updatedAt: 0 }; static seedData = MOCK_DEALS;
}
// WORKFLOW ENTITY
export interface ABVariant { id: string; nodes: WorkflowNode[]; edges: WorkflowEdge[]; traffic: number; metrics: { completions: number; runs: number } }
export interface ExecutionLog { id: string; contactId: string; path: string[]; status: 'completed' | 'error' | 'running'; timestamp: number }
export type WorkflowState = Workflow & { variants: ABVariant[]; executions: ExecutionLog[]; isTemplate: boolean; paused: boolean };
export const MOCK_WORKFLOW_TEMPLATES: WorkflowState[] = [
  { ...MOCK_WORKFLOWS[0], id: 'template-1', name: 'Lead Nurturing Template', isTemplate: true, variants: [], executions: [], paused: false },
  { ...MOCK_WORKFLOWS[0], id: 'template-2', name: 'Onboarding Sequence', isTemplate: true, variants: [], executions: [], paused: false, nodes: MOCK_WORKFLOWS[0].nodes.slice(0, 3), edges: MOCK_WORKFLOWS[0].edges.slice(0, 2) },
];
export class WorkflowEntity extends IndexedEntity<WorkflowState> {
  static readonly entityName = "workflow"; static readonly indexName = "workflows";
  static readonly initialState: WorkflowState = { id: "", name: "", nodes: [], edges: [], createdAt: 0, updatedAt: 0, variants: [], executions: [], isTemplate: false, paused: false };
  static seedData = [...MOCK_WORKFLOWS.map(w => ({ ...w, variants: [], executions: [], isTemplate: false, paused: false })), ...MOCK_WORKFLOW_TEMPLATES];
  async update(nodes: WorkflowNode[], edges: WorkflowEdge[]): Promise<WorkflowState> { return this.mutate(s => ({ ...s, nodes, edges, updatedAt: Date.now() })); }
  async pause(): Promise<WorkflowState> { return this.mutate(s => ({ ...s, paused: true })); }
  async resume(): Promise<WorkflowState> { return this.mutate(s => ({ ...s, paused: false })); }
  async simulateRun(contactId: string): Promise<ExecutionLog> {
    const log: ExecutionLog = { id: crypto.randomUUID(), contactId, path: this.state.nodes.map(n => n.id), status: 'completed', timestamp: Date.now() };
    await this.mutate(s => ({ ...s, executions: [...s.executions, log] })); return log;
  }
}
// OTHER ENTITIES
export class EmailTemplateEntity extends IndexedEntity<EmailTemplate> {
  static readonly entityName = "emailTemplate"; static readonly indexName = "emailTemplates";
  static readonly initialState: EmailTemplate = { id: "", name: "", subject: "", body: "", mergeTags: [] }; static seedData = MOCK_EMAIL_TEMPLATES;
}
export class SMSTemplateEntity extends IndexedEntity<SMSTemplate> {
  static readonly entityName = "smsTemplate"; static readonly indexName = "smsTemplates";
  static readonly initialState: SMSTemplate = { id: "", name: "", body: "", mergeTags: [] }; static seedData = MOCK_SMS_TEMPLATES;
}
export class CampaignEntity extends IndexedEntity<Campaign> {
  static readonly entityName = "campaign"; static readonly indexName = "campaigns";
  static readonly initialState: Campaign = { id: "", type: "email", name: "", templateId: "", status: "draft", analytics: { sends: 0, deliveries: 0, opens: 0, clicks: 0 } }; static seedData = MOCK_CAMPAIGNS;
}
export class ConversationEntity extends IndexedEntity<Conversation> {
  static readonly entityName = "conversation"; static readonly indexName = "conversations";
  static readonly initialState: Conversation = { id: "", contactId: "", channel: "email", messages: [], status: "open", lastMessageAt: 0 }; static seedData = MOCK_CONVERSATIONS;
}
export class PageEntity extends IndexedEntity<Page> {
  static readonly entityName = "page"; static readonly indexName = "pages";
  static readonly initialState: Page = { id: "", name: "", content: [], analytics: { views: 0, conversions: 0 }, createdAt: 0 }; static seedData = MOCK_PAGES;
}
export class FunnelEntity extends IndexedEntity<Funnel> {
  static readonly entityName = "funnel"; static readonly indexName = "funnels";
  static readonly initialState: Funnel = { id: "", name: "", steps: [], createdAt: 0 }; static seedData = MOCK_FUNNELS;
}
export class AppointmentEntity extends IndexedEntity<Appointment> {
  static readonly entityName = "appointment"; static readonly indexName = "appointments";
  static readonly initialState: Appointment = { id: "", title: "", start: 0, end: 0, type: "", status: "scheduled", bufferBefore: 0, bufferAfter: 0 }; static seedData = MOCK_APPOINTMENTS;
}
export class AvailabilityEntity extends IndexedEntity<Availability> {
  static readonly entityName = "availability"; static readonly indexName = "availabilities";
  static readonly initialState: Availability = { id: "", userId: "", dayOfWeek: 0, startTime: "09:00", endTime: "17:00" }; static seedData = MOCK_AVAILABILITIES;
}
export class CalendarEventEntity extends IndexedEntity<CalendarEvent> {
  static readonly entityName = "calendarEvent"; static readonly indexName = "calendarEvents";
  static readonly initialState: CalendarEvent = { id: "", title: "", start: 0, end: 0 }; static seedData = MOCK_CALENDAR_EVENTS;
}
export class IntegrationEntity extends IndexedEntity<Integration> {
  static readonly entityName = "integration"; static readonly indexName = "integrations";
  static readonly initialState: Integration = { id: "", type: "google", status: "disconnected" }; static seedData = MOCK_INTEGRATIONS;
}
export class OrganizationEntity extends IndexedEntity<Organization> {
  static readonly entityName = "organization"; static readonly indexName = "organizations";
  static readonly initialState: Organization = { id: "", name: "", type: "client", branding: {}, workspaces: [], ownerId: "", createdAt: 0 }; static seedData = MOCK_ORGANIZATIONS;
  static async exists(env: Env, id: string): Promise<boolean> { return (await new this(env, id).exists()); }
  async updateBranding(branding: Organization['branding']) { return this.patch({ branding }); }
}
export class WorkspaceEntity extends IndexedEntity<Workspace> {
  static readonly entityName = "workspace"; static readonly indexName = "workspaces";
  static readonly initialState: Workspace = { id: "", orgId: "", name: "", users: [], permissions: {} }; static seedData = MOCK_WORKSPACES;
}
export class BillingEntity extends IndexedEntity<Billing> {
  static readonly entityName = "billing"; static readonly indexName = "billings";
  static readonly initialState: Billing = { id: "", orgId: "", plan: "free", status: "active", usage: { contacts: 0, campaigns: 0 }, nextInvoice: 0 }; static seedData = MOCK_BILLING;
}
export class RoleEntity extends IndexedEntity<Role> {
  static readonly entityName = "role"; static readonly indexName = "roles";
  static readonly initialState: Role = { id: "", name: "user", permissions: [] }; static seedData = MOCK_ROLES;
}
// --- NEW ENTITIES FOR PHASE 13 ---
export class WebhookEntity extends IndexedEntity<Webhook> {
  static readonly entityName = "webhook"; static readonly indexName = "webhooks";
  static readonly initialState: Webhook = { id: "", url: "", events: [], active: false };
  static seedData = MOCK_WEBHOOKS;
  async test() { console.log(`[MOCK WEBHOOK] Firing test event for ${this.state.url}`); }
}
export class APIKeyEntity extends IndexedEntity<APIKey> {
  static readonly entityName = "apiKey"; static readonly indexName = "apiKeys";
  static readonly initialState: APIKey = { id: "", key: "", permissions: [] };
  static seedData = MOCK_API_KEYS;
  static async generate(env: Env, userId: string, permissions: string[]): Promise<APIKey> {
    const key = `orion_sk_${crypto.randomUUID().replace(/-/g, '')}`;
    const apiKey: APIKey = { id: crypto.randomUUID(), key, permissions };
    await this.create(env, apiKey);
    return apiKey;
  }
}
export class ReportEntity extends IndexedEntity<{ id: string; orgId: string; metrics: ReportMetrics }> {
    static readonly entityName = "report"; static readonly indexName = "reports";
    static readonly initialState = { id: "", orgId: "", metrics: {} };
    static seedData = MOCK_REPORTS;
}