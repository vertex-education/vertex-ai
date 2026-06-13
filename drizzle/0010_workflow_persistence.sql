ALTER TABLE `workspace_actions` ADD COLUMN `project_id` text REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null;--> statement-breakpoint
ALTER TABLE `workspace_actions` ADD COLUMN `original_text` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `ideas` ADD COLUMN `project_id` text REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null;--> statement-breakpoint
ALTER TABLE `ideas` ADD COLUMN `original_text` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX `workspace_actions_project_idx` ON `workspace_actions` (`workspace_id`,`project_id`);--> statement-breakpoint
CREATE INDEX `ideas_project_idx` ON `ideas` (`workspace_id`,`project_id`);
