delete from chat_messages;
delete from chats;
delete from workspace_actions;
delete from artifacts;
delete from ideas;
delete from projects;
delete from workspaces;

insert into workspaces (id, scope, name, access_level, updated_at) values
  ('ws-personal', 'personal', 'Personal', 'Read / Write', '2026-06-11T09:21:00-04:00'),
  ('ws-team', 'team', 'Team', 'Read / Write', '2026-06-11T09:21:00-04:00'),
  ('ws-org', 'org', 'Org', 'Read / Write', '2026-06-11T09:21:00-04:00');

insert into projects (id, workspace_id, name, description, status, sort_order) values
  ('personal-certification-plan', 'ws-personal', 'Certification Plan', 'Private credential and milestone tracking.', 'Active', 1),
  ('personal-weekly-reset', 'ws-personal', 'Weekly Reset', 'Personal planning workspace for recurring follow-up.', 'Planning', 2),
  ('team-vertex-hub', 'ws-team', 'Vertex Hub', 'Shared PMO launch execution.', 'Active', 1),
  ('team-lms-next-gen', 'ws-team', 'LMS Next Gen', 'Team delivery, vendor, and UAT coordination.', 'Watch', 2),
  ('team-data-migration', 'ws-team', 'Data Migration', 'Cross-functional cutover and validation.', 'Active', 3),
  ('org-enterprise-ai', 'ws-org', 'Enterprise AI Governance', 'Organization-wide AI operating model.', 'Active', 1),
  ('org-portfolio-health', 'ws-org', 'Portfolio Health', 'Executive portfolio reporting and decisions.', 'Watch', 2);

insert into chats (id, workspace_id, project_id, section, title, description, sort_order) values
  ('personal-assistant', 'ws-personal', null, 'workspace', 'Personal Command Chat', 'Private planning and follow-up.', 1),
  ('personal-notes', 'ws-personal', null, 'workspace', 'Personal Chats', 'Notes that are not tied to a project.', 2),
  ('personal-ideas', 'ws-personal', null, 'workspace', 'Idea Scratchpad', 'Private improvement thinking.', 3),
  ('personal-certification-plan-chat-1', 'ws-personal', 'personal-certification-plan', 'project', 'Certification Plan Project Notes', 'Personal project chat scoped to Certification Plan.', 1),
  ('personal-certification-plan-chat-2', 'ws-personal', 'personal-certification-plan', 'project', 'Certification Plan Project Chats', 'Personal project chat scoped to Certification Plan.', 2),
  ('personal-certification-plan-chat-3', 'ws-personal', 'personal-certification-plan', 'project', 'Certification Plan Private Risks', 'Personal project chat scoped to Certification Plan.', 3),
  ('personal-weekly-reset-chat-1', 'ws-personal', 'personal-weekly-reset', 'project', 'Weekly Reset Project Notes', 'Personal project chat scoped to Weekly Reset.', 1),
  ('personal-weekly-reset-chat-2', 'ws-personal', 'personal-weekly-reset', 'project', 'Weekly Reset Project Chats', 'Personal project chat scoped to Weekly Reset.', 2),
  ('personal-weekly-reset-chat-3', 'ws-personal', 'personal-weekly-reset', 'project', 'Weekly Reset Private Risks', 'Personal project chat scoped to Weekly Reset.', 3),
  ('team-command', 'ws-team', null, 'workspace', 'Team Chats', 'PMO team-wide working thread.', 1),
  ('team-intake', 'ws-team', null, 'workspace', 'Intake Council', 'Shared intake triage and prioritization.', 2),
  ('team-risks', 'ws-team', null, 'workspace', 'Risk & Escalations', 'Team-level risks outside a single project.', 3),
  ('team-vertex-hub-chat-1', 'ws-team', 'team-vertex-hub', 'project', 'Vertex Hub Shared Project Chat', 'Team project chat scoped to Vertex Hub.', 1),
  ('team-vertex-hub-chat-2', 'ws-team', 'team-vertex-hub', 'project', 'Vertex Hub Project Chats', 'Team project chat scoped to Vertex Hub.', 2),
  ('team-vertex-hub-chat-3', 'ws-team', 'team-vertex-hub', 'project', 'Vertex Hub Decision Log', 'Team project chat scoped to Vertex Hub.', 3),
  ('team-lms-next-gen-chat-1', 'ws-team', 'team-lms-next-gen', 'project', 'LMS Next Gen Shared Project Chat', 'Team project chat scoped to LMS Next Gen.', 1),
  ('team-lms-next-gen-chat-2', 'ws-team', 'team-lms-next-gen', 'project', 'LMS Next Gen Project Chats', 'Team project chat scoped to LMS Next Gen.', 2),
  ('team-lms-next-gen-chat-3', 'ws-team', 'team-lms-next-gen', 'project', 'LMS Next Gen Decision Log', 'Team project chat scoped to LMS Next Gen.', 3),
  ('team-data-migration-chat-1', 'ws-team', 'team-data-migration', 'project', 'Data Migration Shared Project Chat', 'Team project chat scoped to Data Migration.', 1),
  ('team-data-migration-chat-2', 'ws-team', 'team-data-migration', 'project', 'Data Migration Project Chats', 'Team project chat scoped to Data Migration.', 2),
  ('team-data-migration-chat-3', 'ws-team', 'team-data-migration', 'project', 'Data Migration Decision Log', 'Team project chat scoped to Data Migration.', 3),
  ('org-command', 'ws-org', null, 'workspace', 'Org Chats', 'Organization-level executive workspace.', 1),
  ('org-policy', 'ws-org', null, 'workspace', 'Policy Review', 'Governance and data handling decisions.', 2),
  ('org-briefings', 'ws-org', null, 'workspace', 'Executive Briefings', 'Leadership-ready summaries.', 3),
  ('org-enterprise-ai-chat-1', 'ws-org', 'org-enterprise-ai', 'project', 'Enterprise AI Governance Org Project Chat', 'Org project chat scoped to Enterprise AI Governance.', 1),
  ('org-enterprise-ai-chat-2', 'ws-org', 'org-enterprise-ai', 'project', 'Enterprise AI Governance Project Chats', 'Org project chat scoped to Enterprise AI Governance.', 2),
  ('org-enterprise-ai-chat-3', 'ws-org', 'org-enterprise-ai', 'project', 'Enterprise AI Governance Leadership Decisions', 'Org project chat scoped to Enterprise AI Governance.', 3),
  ('org-portfolio-health-chat-1', 'ws-org', 'org-portfolio-health', 'project', 'Portfolio Health Org Project Chat', 'Org project chat scoped to Portfolio Health.', 1),
  ('org-portfolio-health-chat-2', 'ws-org', 'org-portfolio-health', 'project', 'Portfolio Health Project Chats', 'Org project chat scoped to Portfolio Health.', 2),
  ('org-portfolio-health-chat-3', 'ws-org', 'org-portfolio-health', 'project', 'Portfolio Health Leadership Decisions', 'Org project chat scoped to Portfolio Health.', 3);

