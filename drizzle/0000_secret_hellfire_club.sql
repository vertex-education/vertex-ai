CREATE TABLE `artifacts` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`title` text NOT NULL,
	`file_type` text NOT NULL,
	`owner` text NOT NULL,
	`artifact_date` text NOT NULL,
	`status` text NOT NULL,
	`summary` text NOT NULL,
	`r2_key` text NOT NULL,
	`href` text NOT NULL,
	`preview_json` text NOT NULL,
	`pinned` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `artifacts_workspace_idx` ON `artifacts` (`workspace_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `artifacts_r2_key_idx` ON `artifacts` (`r2_key`);--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`workspace_id` text NOT NULL,
	`author` text NOT NULL,
	`role` text NOT NULL,
	`avatar` text,
	`message_time` text NOT NULL,
	`body` text NOT NULL,
	`artifact_title` text,
	`artifact_type` text,
	`artifact_meta` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `chat_messages_chat_idx` ON `chat_messages` (`chat_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `chat_messages_workspace_idx` ON `chat_messages` (`workspace_id`);--> statement-breakpoint
CREATE TABLE `chats` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`project_id` text,
	`section` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `chats_workspace_project_idx` ON `chats` (`workspace_id`,`project_id`);--> statement-breakpoint
CREATE INDEX `chats_section_idx` ON `chats` (`workspace_id`,`section`);--> statement-breakpoint
CREATE TABLE `ideas` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`category` text NOT NULL,
	`owner` text NOT NULL,
	`avatar` text NOT NULL,
	`created_label` text NOT NULL,
	`votes` integer DEFAULT 0 NOT NULL,
	`impact` integer NOT NULL,
	`effort` integer NOT NULL,
	`confidence` integer NOT NULL,
	`summary` text NOT NULL,
	`next_step` text NOT NULL,
	`tags_json` text NOT NULL,
	`metrics_json` text NOT NULL,
	`thread_json` text NOT NULL,
	`pinned` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ideas_workspace_idx` ON `ideas` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `ideas_workspace_status_idx` ON `ideas` (`workspace_id`,`status`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`status` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `projects_workspace_idx` ON `projects` (`workspace_id`);--> statement-breakpoint
CREATE TABLE `workspace_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`owner` text NOT NULL,
	`due` text NOT NULL,
	`source` text,
	`status` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `workspace_actions_workspace_kind_idx` ON `workspace_actions` (`workspace_id`,`kind`);--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` text PRIMARY KEY NOT NULL,
	`scope` text NOT NULL,
	`name` text NOT NULL,
	`access_level` text DEFAULT 'Read / Write' NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workspaces_scope_idx` ON `workspaces` (`scope`);