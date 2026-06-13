CREATE TABLE IF NOT EXISTS admin_usage_events (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  feature TEXT NOT NULL,
  model TEXT,
  credits_used REAL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  duration_ms INTEGER,
  team_id TEXT,
  project_id TEXT,
  chat_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS admin_usage_events_provider_idx
  ON admin_usage_events (provider, created_at);

CREATE INDEX IF NOT EXISTS admin_usage_events_scope_idx
  ON admin_usage_events (team_id, project_id, created_at);

CREATE INDEX IF NOT EXISTS admin_usage_events_chat_idx
  ON admin_usage_events (chat_id, created_at);
