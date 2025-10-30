import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').unique(),
  createdAt: integer('created_at'),
});

export const chatSessions = sqliteTable('chat_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  title: text('title'),
  createdAt: integer('created_at'),
  updatedAt: integer('updated_at'),
});

export const chatMessages = sqliteTable('chat_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: integer('session_id').references(() => chatSessions.id),
  message: text('message'),
  isAi: integer('is_ai'),
  timestamp: integer('timestamp'),
});
