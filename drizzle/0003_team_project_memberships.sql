CREATE TABLE IF NOT EXISTS "teams" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "created_by_user_id" text,
  "created_at" integer NOT NULL,
  FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON UPDATE no action ON DELETE set null
);

CREATE TABLE IF NOT EXISTS "team_members" (
  "team_id" text NOT NULL,
  "user_id" text NOT NULL,
  "role" text NOT NULL DEFAULT 'member',
  "created_at" integer NOT NULL,
  PRIMARY KEY ("team_id", "user_id"),
  FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY ("user_id") REFERENCES "user"("id") ON UPDATE no action ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "project_members" (
  "project_id" text NOT NULL,
  "user_id" text NOT NULL,
  "team_id" text,
  "created_at" integer NOT NULL,
  PRIMARY KEY ("project_id", "user_id"),
  FOREIGN KEY ("user_id") REFERENCES "user"("id") ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON UPDATE no action ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "scoped_invites" (
  "id" text PRIMARY KEY NOT NULL,
  "scope" text NOT NULL,
  "target_id" text NOT NULL,
  "target_team_id" text,
  "target_name" text NOT NULL,
  "email" text NOT NULL,
  "invited_by_user_id" text,
  "accepted_at" integer,
  "revoked_at" integer,
  "created_at" integer NOT NULL,
  FOREIGN KEY ("invited_by_user_id") REFERENCES "user"("id") ON UPDATE no action ON DELETE set null,
  FOREIGN KEY ("target_team_id") REFERENCES "teams"("id") ON UPDATE no action ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "chat_members" (
  "chat_id" text NOT NULL,
  "user_id" text,
  "team_id" text,
  "created_at" integer NOT NULL,
  FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY ("user_id") REFERENCES "user"("id") ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON UPDATE no action ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS "teams_name_idx" ON "teams" ("name");
CREATE INDEX IF NOT EXISTS "team_members_user_idx" ON "team_members" ("user_id");
CREATE INDEX IF NOT EXISTS "project_members_user_idx" ON "project_members" ("user_id");
CREATE INDEX IF NOT EXISTS "scoped_invites_email_idx" ON "scoped_invites" ("email", "created_at");
CREATE INDEX IF NOT EXISTS "scoped_invites_target_idx" ON "scoped_invites" ("scope", "target_id");
CREATE INDEX IF NOT EXISTS "chat_members_user_idx" ON "chat_members" ("user_id", "chat_id");
CREATE INDEX IF NOT EXISTS "chat_members_team_idx" ON "chat_members" ("team_id", "chat_id");
