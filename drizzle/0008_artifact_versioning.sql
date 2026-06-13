ALTER TABLE `artifacts` ADD `version` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `artifacts` ADD `parent_artifact_id` text REFERENCES `artifacts`(`id`) ON UPDATE no action ON DELETE set null;--> statement-breakpoint
ALTER TABLE `artifacts` ADD `commit_message` text DEFAULT 'Initial artifact version' NOT NULL;--> statement-breakpoint
CREATE INDEX `artifacts_parent_idx` ON `artifacts` (`parent_artifact_id`);--> statement-breakpoint
CREATE INDEX `artifacts_version_idx` ON `artifacts` (`workspace_id`,`title`,`version`);
