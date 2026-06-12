CREATE TABLE IF NOT EXISTS "user" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "emailVerified" integer DEFAULT 0 NOT NULL,
  "image" text,
  "createdAt" integer NOT NULL,
  "updatedAt" integer NOT NULL,
  "role" text DEFAULT 'user' NOT NULL,
  "banned" integer DEFAULT 0 NOT NULL,
  "banReason" text,
  "banExpires" integer
);
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_idx" ON "user" ("email");
CREATE INDEX IF NOT EXISTS "user_role_idx" ON "user" ("role");

CREATE TABLE IF NOT EXISTS "session" (
  "id" text PRIMARY KEY NOT NULL,
  "expiresAt" integer NOT NULL,
  "token" text NOT NULL,
  "createdAt" integer NOT NULL,
  "updatedAt" integer NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL,
  "impersonatedBy" text,
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS "session_token_idx" ON "session" ("token");
CREATE INDEX IF NOT EXISTS "session_user_idx" ON "session" ("userId");

CREATE TABLE IF NOT EXISTS "account" (
  "id" text PRIMARY KEY NOT NULL,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" integer,
  "refreshTokenExpiresAt" integer,
  "scope" text,
  "password" text,
  "createdAt" integer NOT NULL,
  "updatedAt" integer NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS "account_user_idx" ON "account" ("userId");
CREATE INDEX IF NOT EXISTS "account_provider_idx" ON "account" ("providerId", "accountId");

CREATE TABLE IF NOT EXISTS "verification" (
  "id" text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expiresAt" integer NOT NULL,
  "createdAt" integer,
  "updatedAt" integer
);
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier");

CREATE TABLE IF NOT EXISTS "auth_invites" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "name" text NOT NULL,
  "role" text DEFAULT 'user' NOT NULL,
  "token_hash" text NOT NULL,
  "invited_by_user_id" text,
  "expires_at" integer NOT NULL,
  "accepted_at" integer,
  "created_at" integer NOT NULL,
  FOREIGN KEY ("invited_by_user_id") REFERENCES "user"("id") ON UPDATE no action ON DELETE set null
);
CREATE INDEX IF NOT EXISTS "auth_invites_email_idx" ON "auth_invites" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "auth_invites_token_hash_idx" ON "auth_invites" ("token_hash");

CREATE TABLE IF NOT EXISTS "auth_email_events" (
  "id" text PRIMARY KEY NOT NULL,
  "recipient" text NOT NULL,
  "subject" text NOT NULL,
  "action_url" text,
  "sent" integer DEFAULT 0 NOT NULL,
  "failure_reason" text,
  "created_at" integer NOT NULL
);
CREATE INDEX IF NOT EXISTS "auth_email_events_recipient_idx" ON "auth_email_events" ("recipient", "created_at");
