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
// New Contact types for Phase 2
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