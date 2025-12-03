/**
 * Minimal real-world demo: One Durable Object instance per entity (User, ChatBoard), with Indexes for listing.
 */
import { IndexedEntity } from "./core-utils";
import type { Env } from './core-utils';
import type { User, Chat, ChatMessage, Contact, ContactActivity, Pipeline, Deal, Workflow, WorkflowNode, WorkflowEdge, EmailTemplate, SMSTemplate, Campaign, Conversation, Message, Page, Funnel, FunnelStep, Appointment, Availability, CalendarEvent, Integration, Organization, Workspace, Billing, Role, PageElement } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_CONTACTS, MOCK_PIPELINES, MOCK_DEALS, MOCK_WORKFLOWS, MOCK_EMAIL_TEMPLATES, MOCK_SMS_TEMPLATES, MOCK_CAMPAIGNS, MOCK_CONVERSATIONS, MOCK_PAGES, MOCK_FUNNELS, MOCK_APPOINTMENTS, MOCK_AVAILABILITIES, MOCK_CALENDAR_EVENTS, MOCK_INTEGRATIONS, MOCK_ORGANIZATIONS, MOCK_WORKSPACES, MOCK_BILLING, MOCK_ROLES } from "@shared/mock-data";
// USER ENTITY: one DO instance per user
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
// CHAT BOARD ENTITY: one DO instance per chat board, stores its own messages
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}
// CONTACT ENTITY: one DO instance per contact
export class ContactEntity extends IndexedEntity<Contact> {
  static readonly entityName = "contact";
  static readonly indexName = "contacts";
  static readonly initialState: Contact = {
    id: "",
    name: "",
    tags: [],
    customFields: {},
    activities: [],
    createdAt: 0,
  };
  static seedData = MOCK_CONTACTS;
  async addTag(tag: string): Promise<Contact> {
    return this.mutate(s => ({ ...s, tags: [...new Set([...s.tags, tag])] }));
  }
  async removeTag(tag: string): Promise<Contact> {
    return this.mutate(s => ({ ...s, tags: s.tags.filter(t => t !== tag) }));
  }
  async updateCustomField(key: string, value: any): Promise<Contact> {
    return this.mutate(s => ({
      ...s,
      customFields: { ...s.customFields, [key]: value },
    }));
  }
  async addActivity(type: ContactActivity['type'], content: string): Promise<Contact> {
    const activity: ContactActivity = { type, content, date: Date.now() };
    return this.mutate(s => ({
      ...s,
      activities: [activity, ...s.activities], // Prepend new activity
    }));
  }
}
// PIPELINE ENTITY
type PipelineState = Omit<Pipeline, 'deals'>;
export class PipelineEntity extends IndexedEntity<PipelineState> {
  static readonly entityName = "pipeline";
  static readonly indexName = "pipelines";
  static readonly initialState: PipelineState = { id: "", name: "", stages: [] };
  static seedData = MOCK_PIPELINES;
  async updateStages(stages: string[]): Promise<PipelineState> {
    return this.mutate(s => ({ ...s, stages }));
  }
}
// DEAL ENTITY
export class DealEntity extends IndexedEntity<Deal> {
  static readonly entityName = "deal";
  static readonly indexName = "deals";
  static readonly initialState: Deal = {
    id: "",
    title: "",
    value: 0,
    stage: "",
    createdAt: 0,
    updatedAt: 0,
  };
  static seedData = MOCK_DEALS;
  async updateStage(newStage: string): Promise<Deal> {
    return this.mutate(s => ({ ...s, stage: newStage, updatedAt: Date.now() }));
  }
}
// WORKFLOW ENTITY
export class WorkflowEntity extends IndexedEntity<Workflow> {
  static readonly entityName = "workflow";
  static readonly indexName = "workflows";
  static readonly initialState: Workflow = {
    id: "",
    name: "",
    nodes: [],
    edges: [],
    createdAt: 0,
    updatedAt: 0,
  };
  static seedData = MOCK_WORKFLOWS;
  async update(nodes: WorkflowNode[], edges: WorkflowEdge[]): Promise<Workflow> {
    return this.mutate(s => ({ ...s, nodes, edges, updatedAt: Date.now() }));
  }
}
// EMAIL TEMPLATE ENTITY
export class EmailTemplateEntity extends IndexedEntity<EmailTemplate> {
  static readonly entityName = "emailTemplate";
  static readonly indexName = "emailTemplates";
  static readonly initialState: EmailTemplate = { id: "", name: "", subject: "", body: "", mergeTags: [] };
  static seedData = MOCK_EMAIL_TEMPLATES;
}
// SMS TEMPLATE ENTITY
export class SMSTemplateEntity extends IndexedEntity<SMSTemplate> {
  static readonly entityName = "smsTemplate";
  static readonly indexName = "smsTemplates";
  static readonly initialState: SMSTemplate = { id: "", name: "", body: "", mergeTags: [] };
  static seedData = MOCK_SMS_TEMPLATES;
}
// CAMPAIGN ENTITY
export class CampaignEntity extends IndexedEntity<Campaign> {
  static readonly entityName = "campaign";
  static readonly indexName = "campaigns";
  static readonly initialState: Campaign = {
    id: "",
    type: "email",
    name: "",
    templateId: "",
    status: "draft",
    analytics: { sends: 0, deliveries: 0, opens: 0, clicks: 0 },
  };
  static seedData = MOCK_CAMPAIGNS;
  async schedule(date: number): Promise<Campaign> {
    return this.mutate(s => ({ ...s, status: 'scheduled', scheduledAt: date }));
  }
  async send(): Promise<Campaign> {
    return this.mutate(s => ({ ...s, status: 'sent', scheduledAt: Date.now() }));
  }
}
// CONVERSATION ENTITY
export class ConversationEntity extends IndexedEntity<Conversation> {
  static readonly entityName = "conversation";
  static readonly indexName = "conversations";
  static readonly initialState: Conversation = {
    id: "",
    contactId: "",
    channel: "email",
    messages: [],
    status: "open",
    lastMessageAt: 0,
  };
  static seedData = MOCK_CONVERSATIONS;
  async addMessage(message: Omit<Message, 'id'>): Promise<Conversation> {
    const newMessage: Message = { ...message, id: crypto.randomUUID() };
    return this.mutate(s => ({
      ...s,
      messages: [...s.messages, newMessage],
      lastMessageAt: newMessage.timestamp,
      status: 'open',
    }));
  }
  async updateStatus(status: 'open' | 'closed'): Promise<Conversation> {
    return this.mutate(s => ({ ...s, status }));
  }
}
// PAGE ENTITY
export class PageEntity extends IndexedEntity<Page> {
  static readonly entityName = "page";
  static readonly indexName = "pages";
  static readonly initialState: Page = {
    id: "",
    name: "",
    content: [],
    analytics: { views: 0, conversions: 0 },
    createdAt: 0,
  };
  static seedData = MOCK_PAGES;
  async trackView(): Promise<Page> {
    return this.mutate(s => ({ ...s, analytics: { ...s.analytics, views: s.analytics.views + 1 } }));
  }
  async trackConversion(): Promise<Page> {
    return this.mutate(s => ({ ...s, analytics: { ...s.analytics, conversions: s.analytics.conversions + 1 } }));
  }
}
// FUNNEL ENTITY
export class FunnelEntity extends IndexedEntity<Funnel> {
  static readonly entityName = "funnel";
  static readonly indexName = "funnels";
  static readonly initialState: Funnel = {
    id: "",
    name: "",
    steps: [],
    createdAt: 0,
  };
  static seedData = MOCK_FUNNELS;
  async addStep(pageId: string): Promise<Funnel> {
    return this.mutate(s => {
      const newStep: FunnelStep = { id: crypto.randomUUID(), pageId, order: s.steps.length + 1 };
      return { ...s, steps: [...s.steps, newStep] };
    });
  }
}
// APPOINTMENT ENTITY
export class AppointmentEntity extends IndexedEntity<Appointment> {
  static readonly entityName = "appointment";
  static readonly indexName = "appointments";
  static readonly initialState: Appointment = {
    id: "",
    title: "",
    start: 0,
    end: 0,
    type: "",
    status: "scheduled",
    bufferBefore: 0,
    bufferAfter: 0,
  };
  static seedData = MOCK_APPOINTMENTS;
  async updateStatus(status: 'scheduled' | 'cancelled' | 'completed'): Promise<Appointment> {
    return this.mutate(s => ({ ...s, status }));
  }
}
// AVAILABILITY ENTITY
export class AvailabilityEntity extends IndexedEntity<Availability> {
  static readonly entityName = "availability";
  static readonly indexName = "availabilities";
  static readonly initialState: Availability = {
    id: "",
    userId: "",
    dayOfWeek: 0,
    startTime: "09:00",
    endTime: "17:00",
  };
  static seedData = MOCK_AVAILABILITIES;
}
// CALENDAR EVENT ENTITY (Read-only view for demo)
export class CalendarEventEntity extends IndexedEntity<CalendarEvent> {
  static readonly entityName = "calendarEvent";
  static readonly indexName = "calendarEvents";
  static readonly initialState: CalendarEvent = { id: "", title: "", start: 0, end: 0 };
  static seedData = MOCK_CALENDAR_EVENTS;
}
// INTEGRATION ENTITY
export class IntegrationEntity extends IndexedEntity<Integration> {
  static readonly entityName = "integration";
  static readonly indexName = "integrations";
  static readonly initialState: Integration = { id: "", type: "google", status: "disconnected" };
  static seedData = MOCK_INTEGRATIONS;
  async connect(): Promise<Integration> {
    return this.mutate(s => ({ ...s, status: 'connected', syncToken: `mock-sync-token-${crypto.randomUUID()}` }));
  }
  async disconnect(): Promise<Integration> {
    return this.mutate(s => ({ ...s, status: 'disconnected', syncToken: undefined }));
  }
}
// ORGANIZATION ENTITY
export class OrganizationEntity extends IndexedEntity<Organization> {
  static readonly entityName = "organization";
  static readonly indexName = "organizations";
  static readonly initialState: Organization = { id: "", name: "", type: "client", branding: {}, workspaces: [], ownerId: "", createdAt: 0 };
  static seedData = MOCK_ORGANIZATIONS;
  static async exists(env: Env, id: string): Promise<boolean> {
    return (await new this(env, id).exists());
  }
  async addWorkspace(workspaceId: string): Promise<Organization> {
    return this.mutate(s => ({ ...s, workspaces: [...s.workspaces, workspaceId] }));
  }
  async updateBranding(branding: Organization['branding']): Promise<Organization> {
    return this.mutate(s => ({ ...s, branding }));
  }
}
// WORKSPACE ENTITY
export class WorkspaceEntity extends IndexedEntity<Workspace> {
  static readonly entityName = "workspace";
  static readonly indexName = "workspaces";
  static readonly initialState: Workspace = { id: "", orgId: "", name: "", users: [], permissions: {} };
  static seedData = MOCK_WORKSPACES;
  async addUser(userId: string, permission: 'read' | 'write' | 'admin'): Promise<Workspace> {
    return this.mutate(s => ({
      ...s,
      users: [...new Set([...s.users, userId])],
      permissions: { ...s.permissions, [userId]: permission },
    }));
  }
}
// BILLING ENTITY
export class BillingEntity extends IndexedEntity<Billing> {
  static readonly entityName = "billing";
  static readonly indexName = "billings";
  static readonly initialState: Billing = { id: "", orgId: "", plan: "free", status: "active", usage: { contacts: 0, campaigns: 0 }, nextInvoice: 0 };
  static seedData = MOCK_BILLING;
  async updateUsage(type: 'contacts' | 'campaigns', count: number): Promise<Billing> {
    return this.mutate(s => ({
      ...s,
      usage: { ...s.usage, [type]: s.usage[type] + count },
    }));
  }
}
// ROLE ENTITY
export class RoleEntity extends IndexedEntity<Role> {
  static readonly entityName = "role";
  static readonly indexName = "roles";
  static readonly initialState: Role = { id: "", name: "user", permissions: [] };
  static seedData = MOCK_ROLES;
}