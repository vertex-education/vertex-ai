ALTER TABLE workspace_actions ADD COLUMN asana_task_gid TEXT;
ALTER TABLE workspace_actions ADD COLUMN asana_synced_at INTEGER;
ALTER TABLE workspace_actions ADD COLUMN asana_sync_error TEXT;
ALTER TABLE asana_connections ADD COLUMN auto_sync_tasks_enabled INTEGER DEFAULT 0 NOT NULL;
