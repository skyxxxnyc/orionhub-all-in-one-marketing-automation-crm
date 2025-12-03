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