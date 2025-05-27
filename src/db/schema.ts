// db/schema.ts
import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  varchar,
  boolean,
  pgEnum,
  vector,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const timestamps = {
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
};

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  emailVerified: boolean("email_verified"),
  username: text("username").unique().notNull(),
  ...timestamps,
});

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  systemPrompt: text("system_prompt"),
  temperature: integer("temperature").default(7),
  maxTokens: integer("max_tokens").default(2000),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  ...timestamps,
});

export const documentStatus = pgEnum("status", ["pending", "processing", "completed", "failed"]);

export const documentType = pgEnum("type", ["link", "pdf", "txt", "csv", "json"]);

// Documents table
export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    type: documentType("type").notNull(),
    content: text("content").notNull(),
    status: documentStatus().default("pending"),
    fileSize: integer("file_size").notNull(),
    url: text("url").notNull(),
    mimeType: varchar("mime_type", { length: 100 }),
    metadata: jsonb("metadata"),
    errorMessage: text("error_message"),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps,
  },
  (table) => [
    index("status_idx").on(table.status),
    index("type_idx").on(table.type),
    index("project_id_idx").on(table.projectId),
  ]
);

export const embeddings = pgTable(
  "embeddings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    documentId: uuid("document_id")
      .references(() => documents.id, { onDelete: "cascade" })
      .notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
    chunkIndex: integer("chunk_index").notNull(),
    metadata: jsonb("metadata"),
    model: varchar("model", { length: 100 }),
    ...timestamps,
  },
  (table) => [index("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops"))]
);

// Chats table
export const chats = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  ...timestamps,
});

export const messageRole = pgEnum("role", ["system", "user", "assistant"]);
// Messages table
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  role: messageRole(),
  chatId: uuid("chat_id")
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  ...timestamps,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  chats: many(chats),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  documents: many(documents),
  chats: many(chats),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [chats.projectId],
    references: [projects.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  project: one(projects, {
    fields: [documents.projectId],
    references: [projects.id],
  }),
  embeddings: many(embeddings),
}));
