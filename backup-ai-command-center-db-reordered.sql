PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE `workspaces` (
	`id` text PRIMARY KEY NOT NULL,
	`scope` text NOT NULL,
	`name` text NOT NULL,
	`access_level` text DEFAULT 'Read / Write' NOT NULL,
	`updated_at` text NOT NULL
);
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
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`status` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
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
CREATE TABLE IF NOT EXISTS "verification" (
  "id" text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expiresAt" integer NOT NULL,
  "createdAt" integer,
  "updatedAt" integer
);
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
CREATE TABLE IF NOT EXISTS "auth_email_events" (
  "id" text PRIMARY KEY NOT NULL,
  "recipient" text NOT NULL,
  "subject" text NOT NULL,
  "action_url" text,
  "sent" integer DEFAULT 0 NOT NULL,
  "failure_reason" text,
  "created_at" integer NOT NULL
);
INSERT INTO "workspaces" ("id","scope","name","access_level","updated_at") VALUES('ws-personal','personal','Personal','Read / Write','2026-06-11T09:21:00-04:00');
INSERT INTO "workspaces" ("id","scope","name","access_level","updated_at") VALUES('ws-team','team','Team','Read / Write','2026-06-11T09:21:00-04:00');
INSERT INTO "workspaces" ("id","scope","name","access_level","updated_at") VALUES('ws-org','org','Org','Read / Write','2026-06-11T09:21:00-04:00');
INSERT INTO "user" ("id","name","email","emailVerified","image","createdAt","updatedAt","role","banned","banReason","banExpires") VALUES('XU5Gz3n5y6wdzaltFNz7lis8xMqRPJvf','Roger Cormier','roger.cormier@vertexeducation.com',1,NULL,'2026-06-11T23:59:41.490Z','2026-06-12T00:39:50.236Z','admin',0,NULL,NULL);
INSERT INTO "projects" ("id","workspace_id","name","description","status","sort_order") VALUES('personal-certification-plan','ws-personal','Certification Plan','Private credential and milestone tracking.','Active',1);
INSERT INTO "projects" ("id","workspace_id","name","description","status","sort_order") VALUES('personal-weekly-reset','ws-personal','Weekly Reset','Personal planning workspace for recurring follow-up.','Planning',2);
INSERT INTO "projects" ("id","workspace_id","name","description","status","sort_order") VALUES('team-vertex-hub','ws-team','Vertex Hub','Shared PMO launch execution.','Active',1);
INSERT INTO "projects" ("id","workspace_id","name","description","status","sort_order") VALUES('team-lms-next-gen','ws-team','LMS Next Gen','Team delivery, vendor, and UAT coordination.','Watch',2);
INSERT INTO "projects" ("id","workspace_id","name","description","status","sort_order") VALUES('team-data-migration','ws-team','Data Migration','Cross-functional cutover and validation.','Active',3);
INSERT INTO "projects" ("id","workspace_id","name","description","status","sort_order") VALUES('org-enterprise-ai','ws-org','Enterprise AI Governance','Organization-wide AI operating model.','Active',1);
INSERT INTO "projects" ("id","workspace_id","name","description","status","sort_order") VALUES('org-portfolio-health','ws-org','Portfolio Health','Executive portfolio reporting and decisions.','Watch',2);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('personal-assistant','ws-personal',NULL,'workspace','Personal Command Chat','Private planning and follow-up.',1);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('personal-notes','ws-personal',NULL,'workspace','Personal Chats','Notes that are not tied to a project.',2);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('personal-ideas','ws-personal',NULL,'workspace','Idea Scratchpad','Private improvement thinking.',3);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('personal-certification-plan-chat-1','ws-personal','personal-certification-plan','project','Certification Plan Project Notes','Personal project chat scoped to Certification Plan.',1);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('personal-certification-plan-chat-2','ws-personal','personal-certification-plan','project','Certification Plan Project Chats','Personal project chat scoped to Certification Plan.',2);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('personal-certification-plan-chat-3','ws-personal','personal-certification-plan','project','Certification Plan Private Risks','Personal project chat scoped to Certification Plan.',3);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('personal-weekly-reset-chat-1','ws-personal','personal-weekly-reset','project','Weekly Reset Project Notes','Personal project chat scoped to Weekly Reset.',1);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('personal-weekly-reset-chat-2','ws-personal','personal-weekly-reset','project','Weekly Reset Project Chats','Personal project chat scoped to Weekly Reset.',2);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('personal-weekly-reset-chat-3','ws-personal','personal-weekly-reset','project','Weekly Reset Private Risks','Personal project chat scoped to Weekly Reset.',3);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('team-command','ws-team',NULL,'workspace','Team Chats','PMO team-wide working thread.',1);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('team-intake','ws-team',NULL,'workspace','Intake Council','Shared intake triage and prioritization.',2);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('team-risks','ws-team',NULL,'workspace','Risk & Escalations','Team-level risks outside a single project.',3);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('team-vertex-hub-chat-1','ws-team','team-vertex-hub','project','Vertex Hub Shared Project Chat','Team project chat scoped to Vertex Hub.',1);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('team-vertex-hub-chat-2','ws-team','team-vertex-hub','project','Vertex Hub Project Chats','Team project chat scoped to Vertex Hub.',2);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('team-vertex-hub-chat-3','ws-team','team-vertex-hub','project','Vertex Hub Decision Log','Team project chat scoped to Vertex Hub.',3);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('team-lms-next-gen-chat-1','ws-team','team-lms-next-gen','project','LMS Next Gen Shared Project Chat','Team project chat scoped to LMS Next Gen.',1);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('team-lms-next-gen-chat-2','ws-team','team-lms-next-gen','project','LMS Next Gen Project Chats','Team project chat scoped to LMS Next Gen.',2);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('team-lms-next-gen-chat-3','ws-team','team-lms-next-gen','project','LMS Next Gen Decision Log','Team project chat scoped to LMS Next Gen.',3);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('team-data-migration-chat-1','ws-team','team-data-migration','project','Data Migration Shared Project Chat','Team project chat scoped to Data Migration.',1);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('team-data-migration-chat-2','ws-team','team-data-migration','project','Data Migration Project Chats','Team project chat scoped to Data Migration.',2);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('team-data-migration-chat-3','ws-team','team-data-migration','project','Data Migration Decision Log','Team project chat scoped to Data Migration.',3);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('org-command','ws-org',NULL,'workspace','Org Chats','Organization-level executive workspace.',1);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('org-policy','ws-org',NULL,'workspace','Policy Review','Governance and data handling decisions.',2);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('org-briefings','ws-org',NULL,'workspace','Executive Briefings','Leadership-ready summaries.',3);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('org-enterprise-ai-chat-1','ws-org','org-enterprise-ai','project','Enterprise AI Governance Org Project Chat','Org project chat scoped to Enterprise AI Governance.',1);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('org-enterprise-ai-chat-2','ws-org','org-enterprise-ai','project','Enterprise AI Governance Project Chats','Org project chat scoped to Enterprise AI Governance.',2);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('org-enterprise-ai-chat-3','ws-org','org-enterprise-ai','project','Enterprise AI Governance Leadership Decisions','Org project chat scoped to Enterprise AI Governance.',3);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('org-portfolio-health-chat-1','ws-org','org-portfolio-health','project','Portfolio Health Org Project Chat','Org project chat scoped to Portfolio Health.',1);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('org-portfolio-health-chat-2','ws-org','org-portfolio-health','project','Portfolio Health Project Chats','Org project chat scoped to Portfolio Health.',2);
INSERT INTO "chats" ("id","workspace_id","project_id","section","title","description","sort_order") VALUES('org-portfolio-health-chat-3','ws-org','org-portfolio-health','project','Portfolio Health Leadership Decisions','Org project chat scoped to Portfolio Health.',3);
INSERT INTO "artifacts" ("id","workspace_id","title","file_type","owner","artifact_date","status","summary","r2_key","href","preview_json","pinned") VALUES('artifact-personal-doc','ws-personal','Personal Focus Plan','DOCX','Alex Morgan','Jun 8, 2026','Pinned','Personal dummy DOCX artifact.','personal/artifacts/personal-focus-plan.docx','/artifacts/personal-focus-plan.docx','["Personal-only file"]',1);
INSERT INTO "artifacts" ("id","workspace_id","title","file_type","owner","artifact_date","status","summary","r2_key","href","preview_json","pinned") VALUES('artifact-personal-xlsx','ws-personal','Personal Tracker','XLSX','Alex Morgan','Jun 9, 2026','Draft','Personal dummy XLSX artifact.','personal/artifacts/personal-tracker.xlsx','/artifacts/personal-tracker.xlsx','["Personal tracker file"]',0);
INSERT INTO "artifacts" ("id","workspace_id","title","file_type","owner","artifact_date","status","summary","r2_key","href","preview_json","pinned") VALUES('artifact-personal-pptx','ws-personal','Private Planning Brief','PPTX','Alex Morgan','Jun 10, 2026','Final','Personal dummy PPTX artifact.','personal/artifacts/personal-planning-brief.pptx','/artifacts/personal-planning-brief.pptx','["Personal briefing file"]',0);
INSERT INTO "artifacts" ("id","workspace_id","title","file_type","owner","artifact_date","status","summary","r2_key","href","preview_json","pinned") VALUES('artifact-team-xlsx','ws-team','Team Improvement Register','XLSX','PMO Team','Jun 10, 2026','Pinned','Team dummy XLSX artifact.','team/artifacts/team-improvement-register.xlsx','/artifacts/team-improvement-register.xlsx','["Team-only file"]',1);
INSERT INTO "artifacts" ("id","workspace_id","title","file_type","owner","artifact_date","status","summary","r2_key","href","preview_json","pinned") VALUES('artifact-team-pptx','ws-team','Vertex Hub Roadmap Brief','PPTX','Taylor Kim','Jun 7, 2026','Final','Team dummy PPTX artifact.','team/artifacts/team-vertex-roadmap-brief.pptx','/artifacts/team-vertex-roadmap-brief.pptx','["Team project file"]',0);
INSERT INTO "artifacts" ("id","workspace_id","title","file_type","owner","artifact_date","status","summary","r2_key","href","preview_json","pinned") VALUES('artifact-team-doc','ws-team','Team Launch Checklist','DOCX','Maya Chen','Jun 6, 2026','Draft','Team dummy DOCX artifact.','team/artifacts/team-launch-checklist.docx','/artifacts/team-launch-checklist.docx','["Team launch file"]',0);
INSERT INTO "artifacts" ("id","workspace_id","title","file_type","owner","artifact_date","status","summary","r2_key","href","preview_json","pinned") VALUES('artifact-org-doc','ws-org','Org AI Governance Charter','DOCX','Priya Shah','Jun 11, 2026','Final','Org dummy DOCX artifact.','org/artifacts/org-ai-governance-charter.docx','/artifacts/org-ai-governance-charter.docx','["Org-only file"]',0);
INSERT INTO "artifacts" ("id","workspace_id","title","file_type","owner","artifact_date","status","summary","r2_key","href","preview_json","pinned") VALUES('artifact-org-xlsx','ws-org','Portfolio Health Model','XLSX','Finance Ops','Jun 10, 2026','Pinned','Org dummy XLSX artifact.','org/artifacts/org-portfolio-health-model.xlsx','/artifacts/org-portfolio-health-model.xlsx','["Org model file"]',1);
INSERT INTO "artifacts" ("id","workspace_id","title","file_type","owner","artifact_date","status","summary","r2_key","href","preview_json","pinned") VALUES('artifact-org-pptx','ws-org','Executive AI Briefing','PPTX','Strategy Office','Jun 9, 2026','Draft','Org dummy PPTX artifact.','org/artifacts/org-executive-ai-briefing.pptx','/artifacts/org-executive-ai-briefing.pptx','["Org briefing file"]',0);
INSERT INTO "ideas" ("id","workspace_id","title","status","category","owner","avatar","created_label","votes","impact","effort","confidence","summary","next_step","tags_json","metrics_json","thread_json","pinned") VALUES('personal-idea-1','ws-personal','Private meeting follow-up assistant','Pilot','Planning','Alex Morgan','','Today',16,85,42,84,'Personal-only follow-up assistant.','Confirm private evidence sources.','["Personal","Planning","Pilot"]','["Scoped evidence only"]','["Captured in Personal"]',1);
INSERT INTO "ideas" ("id","workspace_id","title","status","category","owner","avatar","created_label","votes","impact","effort","confidence","summary","next_step","tags_json","metrics_json","thread_json","pinned") VALUES('team-idea-1','ws-team','Team RAID Copilot','Pilot','Risk and issue management','Taylor Kim','','Today',18,92,44,83,'Team-only RAID automation.','Pilot in Team Projects.','["Team","RAID","Pilot"]','["Team evidence only"]','["Captured in Team"]',1);
INSERT INTO "ideas" ("id","workspace_id","title","status","category","owner","avatar","created_label","votes","impact","effort","confidence","summary","next_step","tags_json","metrics_json","thread_json","pinned") VALUES('org-idea-1','ws-org','Org AI governance classifier','Approved','Governance','Priya Shah','','Today',20,90,50,88,'Org-only governance classifier.','Approve org rollout path.','["Org","Governance","Approved"]','["Org evidence only"]','["Captured in Org"]',1);
INSERT INTO "workspace_actions" ("id","workspace_id","kind","title","owner","due","source","status") VALUES('personal-decision-1','ws-personal','decision','Confirm private planning scope','Alex Morgan','Due Jun 14',NULL,'Open');
INSERT INTO "workspace_actions" ("id","workspace_id","kind","title","owner","due","source","status") VALUES('team-decision-1','ws-team','decision','Approve Team RAID pilot','Taylor Kim','Due Jun 14',NULL,'Open');
INSERT INTO "workspace_actions" ("id","workspace_id","kind","title","owner","due","source","status") VALUES('org-decision-1','ws-org','decision','Approve org AI governance charter','Priya Shah','Due Jun 14',NULL,'Open');
INSERT INTO "workspace_actions" ("id","workspace_id","kind","title","owner","due","source","status") VALUES('personal-task-1','ws-personal','task','Refresh personal tracker','Alex Morgan','Due Jun 13','Personal Tracker','Open');
INSERT INTO "workspace_actions" ("id","workspace_id","kind","title","owner","due","source","status") VALUES('team-task-1','ws-team','task','Package Vertex Hub roadmap evidence','Maya Chen','Due Jun 13','Vertex Hub Roadmap Brief','In progress');
INSERT INTO "workspace_actions" ("id","workspace_id","kind","title","owner","due","source","status") VALUES('org-task-1','ws-org','task','Publish governance briefing','Strategy Office','Due Jun 13','Executive AI Briefing','Open');
INSERT INTO "chat_messages" ("id","chat_id","workspace_id","author","role","avatar","message_time","body","artifact_title","artifact_type","artifact_meta","created_at") VALUES('msg-personal-1','personal-assistant','ws-personal','Alex Morgan','user',NULL,'9:15 AM','Summarize my private planning work and do not include team or org records.',NULL,NULL,NULL,'2026-06-11T09:15:00-04:00');
INSERT INTO "chat_messages" ("id","chat_id","workspace_id","author","role","avatar","message_time","body","artifact_title","artifact_type","artifact_meta","created_at") VALUES('msg-personal-2','personal-assistant','ws-personal','AI Command Center','assistant',NULL,'9:16 AM','I reviewed only personal chats, ideas, and artifacts. Team and org records are outside this scope.','Personal Scope Snapshot','doc','DOCX - Personal scoped','2026-06-11T09:16:00-04:00');
INSERT INTO "chat_messages" ("id","chat_id","workspace_id","author","role","avatar","message_time","body","artifact_title","artifact_type","artifact_meta","created_at") VALUES('msg-team-1','team-command','ws-team','Taylor Kim','user',NULL,'9:15 AM','Summarize team project readiness without private notes or org strategy.',NULL,NULL,NULL,'2026-06-11T09:15:00-04:00');
INSERT INTO "chat_messages" ("id","chat_id","workspace_id","author","role","avatar","message_time","body","artifact_title","artifact_type","artifact_meta","created_at") VALUES('msg-team-2','team-command','ws-team','AI Command Center','assistant',NULL,'9:16 AM','I reviewed only team-scoped records, including Team Projects and Team Chats.','Team Scope Snapshot','ppt','PPTX - Team scoped','2026-06-11T09:16:00-04:00');
INSERT INTO "chat_messages" ("id","chat_id","workspace_id","author","role","avatar","message_time","body","artifact_title","artifact_type","artifact_meta","created_at") VALUES('msg-org-1','org-command','ws-org','Priya Shah','user',NULL,'9:15 AM','Prepare the organization-level AI governance snapshot.',NULL,NULL,NULL,'2026-06-11T09:15:00-04:00');
INSERT INTO "chat_messages" ("id","chat_id","workspace_id","author","role","avatar","message_time","body","artifact_title","artifact_type","artifact_meta","created_at") VALUES('msg-org-2','org-command','ws-org','AI Command Center','assistant',NULL,'9:16 AM','I reviewed only org-scoped projects, chats, and artifacts. These records are not surfaced to Team or Personal.','Org Scope Snapshot','ppt','PPTX - Org scoped','2026-06-11T09:16:00-04:00');
INSERT INTO "session" ("id","expiresAt","token","createdAt","updatedAt","ipAddress","userAgent","userId","impersonatedBy") VALUES('I1uFAt1NhsphzMlL6F6Q82R15HCZgTfC','2026-06-19T00:40:06.324Z','lTFXc1lx7xOsWaSyiRjG0ABHYYp9Duyv','2026-06-12T00:40:06.324Z','2026-06-12T00:40:06.324Z','','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0','XU5Gz3n5y6wdzaltFNz7lis8xMqRPJvf',NULL);
INSERT INTO "account" ("id","accountId","providerId","userId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","createdAt","updatedAt") VALUES('4ms5fyKwIX9W7pRQGskl3E48LcEimFXh','XU5Gz3n5y6wdzaltFNz7lis8xMqRPJvf','credential','XU5Gz3n5y6wdzaltFNz7lis8xMqRPJvf',NULL,NULL,NULL,NULL,NULL,NULL,'1a7d68f91ec6fbdd70bef919feb90205:e13739653f1245ff104ebaed3f4f4c66272e390dbb4d0899dce90bcd55ba04a8928ea3601af1e9dd78e47d88bceec6d4824e80530753a9a74cbc052cd3492dba','2026-06-11T23:59:41.545Z','2026-06-11T23:59:41.545Z');
INSERT INTO "auth_invites" ("id","email","name","role","token_hash","invited_by_user_id","expires_at","accepted_at","created_at") VALUES('invite-8c58d55d-198d-4593-997c-56fdd5a1f1a4','roger.cormier@vertexeducation.com','Roger Cormier','admin','735ca668c2bcbf4864de85c71b26df637deb6f4a3734f3289f82edcf18a0365a',NULL,1781815437682,NULL,1781210637682);
INSERT INTO "auth_invites" ("id","email","name","role","token_hash","invited_by_user_id","expires_at","accepted_at","created_at") VALUES('invite-6fd2b791-d4b9-4a58-ada9-f1fc0bc45bd5','roger.cormier@vertexeducation.com','Roger Cormier','admin','528e0629e1acc29d930e53566fdd2f25b2bef115fc1b1ae3c3905df972333190',NULL,1781815950856,NULL,1781211150856);
INSERT INTO "auth_invites" ("id","email","name","role","token_hash","invited_by_user_id","expires_at","accepted_at","created_at") VALUES('invite-a472e117-933b-4ce6-bd40-ccbaefde2a4b','roger.cormier@vertexeducation.com','Roger Cormier','admin','0c2fdd86fe7e868fe516bbcd5ab2041c8450d8c6a06429c053d962ba7d877e16',NULL,1781816933318,NULL,1781212133318);
INSERT INTO "auth_invites" ("id","email","name","role","token_hash","invited_by_user_id","expires_at","accepted_at","created_at") VALUES('invite-4ce8763b-ed60-4aec-af5c-340604d57a0f','roger.cormier@vertexeducation.com','Roger Cormier','admin','578d7b3b3f29a8d22ee3b74671ad2ce279b79c22ef6d274ebcf4b28a8034db44',NULL,1781827161773,1781222381701,1781222361773);
INSERT INTO "auth_email_events" ("id","recipient","subject","action_url","sent","failure_reason","created_at") VALUES('email-b7d31571-953f-4877-9964-28a37f529248','roger.cormier@vertexeducation.com','Your AI Command Center invite','https://ai-command-center.roger-cormier.workers.dev/accept-invite?token=4dcd5ce9ecd7f6c04a5120cba193a9ce4c6b9c02a7f849f64a71ab39a075ad29',0,'email from vertexeducation.com not allowed because domain was not found',1781211151122);
INSERT INTO "auth_email_events" ("id","recipient","subject","action_url","sent","failure_reason","created_at") VALUES('email-7be860e9-918d-4c14-ab5b-85481c5e6710','roger.cormier@vertexeducation.com','Your AI Command Center invite','https://ai-command-center.roger-cormier.workers.dev/accept-invite?token=6a6e081ded75467b776bfdc536abf900dd8c5efca3da15278e34a17b6f2427da',0,'email from vertexeducation.com not allowed because domain was not found',1781212133378);
INSERT INTO "auth_email_events" ("id","recipient","subject","action_url","sent","failure_reason","created_at") VALUES('email-36a4e993-944f-4c94-bf06-3b5dcbaece97','roger.cormier@vertexeducation.com','Your AI Command Center invite','https://ai-command-center.roger-cormier.workers.dev/accept-invite?token=77ba5891fcaa3359cfdfac532ed5f6065f206a1d99dc55c95dc70177d3e0979c',0,'email from vertexeducation.com not allowed because domain was not found',1781222361829);
INSERT INTO "auth_email_events" ("id","recipient","subject","action_url","sent","failure_reason","created_at") VALUES('email-512a8697-332d-4b88-9c70-4d8a6a652a2b','roger.cormier@vertexeducation.com','Verify your AI Command Center email','https://ai-command-center.roger-cormier.workers.dev/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJvZ2VyLmNvcm1pZXJAdmVydGV4ZWR1Y2F0aW9uLmNvbSIsImlhdCI6MTc4MTIyMjM4MSwiZXhwIjoxNzgxMjI1OTgxfQ.eQZS4IllMfRJOALJaL-mkt0seZiwIRthgtV_pL0nFNY&callbackURL=%2F',0,'email from vertexeducation.com not allowed because domain was not found',1781222381598);
INSERT INTO "auth_email_events" ("id","recipient","subject","action_url","sent","failure_reason","created_at") VALUES('email-28f5c16a-bb4d-4e76-b488-be78c9e72cde','roger.cormier@vertexeducation.com','Verify your AI Command Center email','https://ai-command-center.roger-cormier.workers.dev/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJvZ2VyLmNvcm1pZXJAdmVydGV4ZWR1Y2F0aW9uLmNvbSIsImlhdCI6MTc4MTIyNDcxMCwiZXhwIjoxNzgxMjI4MzEwfQ.mtt5-5alu9e6H-BNov-o44v6Tb_0vwJMv0EUtsd12Bs&callbackURL=%2F',0,'email from vertexeducation.com not allowed because domain was not found',1781224710213);
CREATE UNIQUE INDEX `workspaces_scope_idx` ON `workspaces` (`scope`);
CREATE UNIQUE INDEX "user_email_idx" ON "user" ("email");
CREATE INDEX "user_role_idx" ON "user" ("role");
CREATE INDEX `projects_workspace_idx` ON `projects` (`workspace_id`);
CREATE INDEX `chats_workspace_project_idx` ON `chats` (`workspace_id`,`project_id`);
CREATE INDEX `chats_section_idx` ON `chats` (`workspace_id`,`section`);
CREATE INDEX `artifacts_workspace_idx` ON `artifacts` (`workspace_id`);
CREATE UNIQUE INDEX `artifacts_r2_key_idx` ON `artifacts` (`r2_key`);
CREATE INDEX `ideas_workspace_idx` ON `ideas` (`workspace_id`);
CREATE INDEX `ideas_workspace_status_idx` ON `ideas` (`workspace_id`,`status`);
CREATE INDEX `workspace_actions_workspace_kind_idx` ON `workspace_actions` (`workspace_id`,`kind`);
CREATE INDEX `chat_messages_chat_idx` ON `chat_messages` (`chat_id`,`created_at`);
CREATE INDEX `chat_messages_workspace_idx` ON `chat_messages` (`workspace_id`);
CREATE UNIQUE INDEX "session_token_idx" ON "session" ("token");
CREATE INDEX "session_user_idx" ON "session" ("userId");
CREATE INDEX "account_user_idx" ON "account" ("userId");
CREATE INDEX "account_provider_idx" ON "account" ("providerId", "accountId");
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");
CREATE INDEX "auth_invites_email_idx" ON "auth_invites" ("email");
CREATE UNIQUE INDEX "auth_invites_token_hash_idx" ON "auth_invites" ("token_hash");
CREATE INDEX "auth_email_events_recipient_idx" ON "auth_email_events" ("recipient", "created_at");
