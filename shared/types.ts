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