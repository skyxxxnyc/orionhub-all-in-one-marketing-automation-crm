/**
 * Minimal real-world demo: One Durable Object instance per entity (User, ChatBoard), with Indexes for listing.
 */
import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, Contact, ContactActivity } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_CONTACTS } from "@shared/mock-data";
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