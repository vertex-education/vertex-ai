import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const workspaces = sqliteTable(
  "workspaces",
  {
    id: text("id").primaryKey(),
    scope: text("scope", { enum: ["personal", "team", "org"] }).notNull(),
    name: text("name").notNull(),
    accessLevel: text("access_level", { enum: ["Read / Write", "View only"] }).notNull().default("Read / Write"),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    scopeIdx: uniqueIndex("workspaces_scope_idx").on(table.scope),
  }),
);

export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    status: text("status", { enum: ["Active", "Watch", "Planning"] }).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => ({
    workspaceIdx: index("projects_workspace_idx").on(table.workspaceId),
  }),
);

export const chats = sqliteTable(
  "chats",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
    section: text("section", { enum: ["project", "workspace"] }).notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => ({
    scopeProjectIdx: index("chats_workspace_project_idx").on(table.workspaceId, table.projectId),
    sectionIdx: index("chats_section_idx").on(table.workspaceId, table.section),
  }),
);

export const chatMessages = sqliteTable(
  "chat_messages",
  {
    id: text("id").primaryKey(),
    chatId: text("chat_id").notNull().references(() => chats.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    author: text("author").notNull(),
    role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
    avatar: text("avatar"),
    messageTime: text("message_time").notNull(),
    body: text("body").notNull(),
    artifactTitle: text("artifact_title"),
    artifactType: text("artifact_type", { enum: ["doc", "ppt", "sheet"] }),
    artifactMeta: text("artifact_meta"),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    chatIdx: index("chat_messages_chat_idx").on(table.chatId, table.createdAt),
    workspaceIdx: index("chat_messages_workspace_idx").on(table.workspaceId),
  }),
);

export const ideas = sqliteTable(
  "ideas",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    status: text("status", { enum: ["New", "Review", "Pilot", "Approved", "Implemented", "Blocked"] }).notNull(),
    category: text("category").notNull(),
    owner: text("owner").notNull(),
    avatar: text("avatar").notNull(),
    createdLabel: text("created_label").notNull(),
    votes: integer("votes").notNull().default(0),
    impact: integer("impact").notNull(),
    effort: integer("effort").notNull(),
    confidence: integer("confidence").notNull(),
    summary: text("summary").notNull(),
    nextStep: text("next_step").notNull(),
    tagsJson: text("tags_json").notNull(),
    metricsJson: text("metrics_json").notNull(),
    threadJson: text("thread_json").notNull(),
    pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
  },
  (table) => ({
    workspaceIdx: index("ideas_workspace_idx").on(table.workspaceId),
    statusIdx: index("ideas_workspace_status_idx").on(table.workspaceId, table.status),
  }),
);

export const artifacts = sqliteTable(
  "artifacts",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    fileType: text("file_type").notNull(),
    owner: text("owner").notNull(),
    artifactDate: text("artifact_date").notNull(),
    status: text("status", { enum: ["Final", "Draft", "Pinned"] }).notNull(),
    summary: text("summary").notNull(),
    r2Key: text("r2_key").notNull(),
    href: text("href").notNull(),
    previewJson: text("preview_json").notNull(),
    pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
  },
  (table) => ({
    workspaceIdx: index("artifacts_workspace_idx").on(table.workspaceId),
    r2KeyIdx: uniqueIndex("artifacts_r2_key_idx").on(table.r2Key),
  }),
);

export const workspaceActions = sqliteTable(
  "workspace_actions",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    kind: text("kind", { enum: ["decision", "approval", "task"] }).notNull(),
    title: text("title").notNull(),
    owner: text("owner").notNull(),
    due: text("due").notNull(),
    source: text("source"),
    status: text("status").notNull(),
  },
  (table) => ({
    workspaceKindIdx: index("workspace_actions_workspace_kind_idx").on(table.workspaceId, table.kind),
  }),
);
