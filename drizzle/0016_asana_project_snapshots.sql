CREATE TABLE IF NOT EXISTS asana_project_snapshots (
  id TEXT PRIMARY KEY,
  mapping_id TEXT NOT NULL REFERENCES asana_project_mappings(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  vertex_workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  vertex_team_id TEXT,
  vertex_mode TEXT NOT NULL CHECK (vertex_mode IN ('Personal', 'Team', 'Org')),
  vertex_project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  asana_project_gid TEXT NOT NULL,
  asana_project_name TEXT NOT NULL,
  snapshot_hash TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,
  task_count INTEGER NOT NULL,
  status_update_count INTEGER NOT NULL,
  story_count INTEGER NOT NULL,
  diff_summary TEXT NOT NULL,
  r2_key TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS asana_project_snapshots_mapping_created_idx ON asana_project_snapshots (mapping_id, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS asana_project_snapshots_mapping_hash_idx ON asana_project_snapshots (mapping_id, snapshot_hash);
CREATE INDEX IF NOT EXISTS asana_project_snapshots_vertex_project_idx ON asana_project_snapshots (vertex_project_id, created_at);
