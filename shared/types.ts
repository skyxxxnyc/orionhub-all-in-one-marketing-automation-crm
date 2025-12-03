import type { Node as RFNode, Edge as RFEdge } from 'reactflow';
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
  email?: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// Contact types
export interface ContactActivity {
  type: 'email' | 'sms' | 'note' | 'automation';
  content: string;
  date: number; // epoch millis
}
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  tags: string[];
  customFields: Record<string, any>;
  activities: ContactActivity[];
  createdAt: number; // epoch millis
}
// Pipeline & Deal types
export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string; // The name of the stage
  contactId?: string;
  createdAt: number;
  updatedAt: number;
  notes?: string;
}
export interface Stage {
  id: string;
  name: string;
  pipelineId: string;
}
export interface Pipeline {
  id: string;
  name: string;
  stages: string[]; // Ordered list of stage names
  deals: Deal[]; // This is for API responses, not stored directly in PipelineEntity
}
// Workflow types
export type NodeType = 'trigger' | 'action' | 'condition';
export interface NodeData {
  label: string;
  type: NodeType;
  icon: string; // Lucide icon name
  config?: Record<string, any>;
}
export type WorkflowNode = RFNode<NodeData>;
export type WorkflowEdge = RFEdge;
export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: number;
  updatedAt: number;
}
// Communication Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  mergeTags: string[];
}
export interface SMSTemplate {
  id: string;
  name: string;
  body: string;
  mergeTags: string[];
}
export interface Campaign {
  id: string;
  type: 'email' | 'sms';
  name: string;
  templateId: string;
  scheduledAt?: number;
  status: 'draft' | 'scheduled' | 'sent';
  analytics: {
    opens: number;
    clicks: number;
    deliveries: number;
    sends: number;
  };
}
export interface Message {
  id: string;
  from: string; // 'user' or contact name/email
  text: string;
  timestamp: number;
  direction: 'in' | 'out';
}
export interface Conversation {
  id: string;
  contactId: string;
  channel: 'email' | 'sms';
  messages: Message[];
  status: 'open' | 'closed';
  assignedTo?: string; // User ID
  lastMessageAt: number;
}
// Funnels & Pages Types
export interface PageElement {
  id: string;
  type: 'text' | 'image' | 'form' | 'button';
  content: string; // For text/button label/image URL
  position: { x: number; y: number };
  config?: Record<string, any>; // For styles, form fields, etc.
}
export interface Page {
  id: string;
  name: string;
  content: PageElement[];
  analytics: {
    views: number;
    conversions: number;
  };
  createdAt: number;
}
export interface FunnelStep {
  id: string;
  pageId: string;
  order: number;
}
export interface Funnel {
  id: string;
  name: string;
  steps: FunnelStep[];
  createdAt: number;
}
// Calendar & Scheduling Types
export interface Appointment {
  id: string;
  title: string;
  start: number; // epoch millis
  end: number; // epoch millis
  contactId?: string;
  type: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  bufferBefore: number; // minutes
  bufferAfter: number; // minutes
}
export interface Availability {
  id: string;
  userId: string;
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}
export interface CalendarEvent {
  id: string;
  title: string;
  start: number; // epoch millis
  end: number; // epoch millis
  color?: string;
}
export interface Integration {
  id: string;
  type: 'google' | 'outlook';
  status: 'connected' | 'disconnected';
  syncToken?: string;
}
// Multi-Tenant & Admin Types
export interface Organization {
  id: string;
  name: string;
  type: 'agency' | 'client';
  branding: {
    logo?: string;
    colors?: Record<string, string>;
  };
  workspaces: string[];
  ownerId: string;
  createdAt: number;
}
export interface Workspace {
  id: string;
  orgId: string;
  name: string;
  users: string[]; // user IDs
  permissions: Record<string, 'read' | 'write' | 'admin'>; // { [userId]: permission }
}
export interface Billing {
  id: string;
  orgId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'cancelled';
  usage: {
    contacts: number;
    campaigns: number;
  };
  nextInvoice: number; // epoch millis
}
export interface Role {
  id: string;
  name: 'admin' | 'user' | 'client';
  permissions: string[]; // e.g., ['contacts:write', 'billing:read']
}