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
  ('personal-certification-plan-chat-1', 'ws-personal', 'personal-certification-plan', 'project', 'Project Notes', 'Project Notes for Certification Plan.', 1),
  ('personal-certification-plan-chat-2', 'ws-personal', 'personal-certification-plan', 'project', 'Project Chats', 'Project Chats for Certification Plan.', 2),
  ('personal-weekly-reset-chat-1', 'ws-personal', 'personal-weekly-reset', 'project', 'Project Notes', 'Project Notes for Weekly Reset.', 1),
  ('personal-weekly-reset-chat-2', 'ws-personal', 'personal-weekly-reset', 'project', 'Project Chats', 'Project Chats for Weekly Reset.', 2),
  ('team-command', 'ws-team', null, 'workspace', 'Team Chats', 'PMO team-wide working thread.', 1),
  ('team-intake', 'ws-team', null, 'workspace', 'Intake Council', 'Shared intake triage and prioritization.', 2),
  ('team-risks', 'ws-team', null, 'workspace', 'Risk & Escalations', 'Team-level risks outside a single project.', 3),
  ('team-vertex-hub-chat-1', 'ws-team', 'team-vertex-hub', 'project', 'Shared Project Chat', 'Shared Project Chat for Vertex Hub.', 1),
  ('team-vertex-hub-chat-2', 'ws-team', 'team-vertex-hub', 'project', 'Project Chats', 'Project Chats for Vertex Hub.', 2),
  ('team-lms-next-gen-chat-1', 'ws-team', 'team-lms-next-gen', 'project', 'Shared Project Chat', 'Shared Project Chat for LMS Next Gen.', 1),
  ('team-data-migration-chat-1', 'ws-team', 'team-data-migration', 'project', 'Shared Project Chat', 'Shared Project Chat for Data Migration.', 1),
  ('org-command', 'ws-org', null, 'workspace', 'Org Chats', 'Organization-level executive workspace.', 1),
  ('org-policy', 'ws-org', null, 'workspace', 'Policy Review', 'Governance and data handling decisions.', 2),
  ('org-briefings', 'ws-org', null, 'workspace', 'Executive Briefings', 'Leadership-ready summaries.', 3),
  ('org-enterprise-ai-chat-1', 'ws-org', 'org-enterprise-ai', 'project', 'Org Project Chat', 'Org Project Chat for Enterprise AI Governance.', 1),
  ('org-enterprise-ai-chat-2', 'ws-org', 'org-enterprise-ai', 'project', 'Project Chats', 'Project Chats for Enterprise AI Governance.', 2),
  ('org-portfolio-health-chat-1', 'ws-org', 'org-portfolio-health', 'project', 'Org Project Chat', 'Org Project Chat for Portfolio Health.', 1);

insert into chat_messages (id, chat_id, workspace_id, author, role, avatar, message_time, body, artifact_title, artifact_type, artifact_meta, created_at) values
  ('msg-personal-1', 'personal-assistant', 'ws-personal', 'Alex Morgan', 'user', null, '9:15 AM', 'Summarize my private planning work and do not include team or org records.', null, null, null, '2026-06-11T09:15:00-04:00'),
  ('msg-personal-2', 'personal-assistant', 'ws-personal', 'AI Command Center', 'assistant', null, '9:16 AM', 'I reviewed only personal chats, ideas, and artifacts. Team and org records are outside this scope.', 'Personal Scope Snapshot', 'doc', 'DOCX - Personal scoped', '2026-06-11T09:16:00-04:00'),
  ('msg-team-1', 'team-command', 'ws-team', 'Taylor Kim', 'user', null, '9:15 AM', 'Summarize team project readiness without private notes or org strategy.', null, null, null, '2026-06-11T09:15:00-04:00'),
  ('msg-team-2', 'team-command', 'ws-team', 'AI Command Center', 'assistant', null, '9:16 AM', 'I reviewed only team-scoped records, including Team Projects and Team Chats.', 'Team Scope Snapshot', 'ppt', 'PPTX - Team scoped', '2026-06-11T09:16:00-04:00'),
  ('msg-org-1', 'org-command', 'ws-org', 'Priya Shah', 'user', null, '9:15 AM', 'Prepare the organization-level AI governance snapshot.', null, null, null, '2026-06-11T09:15:00-04:00'),
  ('msg-org-2', 'org-command', 'ws-org', 'AI Command Center', 'assistant', null, '9:16 AM', 'I reviewed only org-scoped projects, chats, and artifacts. These records are not surfaced to Team or Personal.', 'Org Scope Snapshot', 'ppt', 'PPTX - Org scoped', '2026-06-11T09:16:00-04:00');

insert into ideas (id, workspace_id, title, status, category, owner, avatar, created_label, votes, impact, effort, confidence, summary, next_step, tags_json, metrics_json, thread_json, pinned) values
  ('personal-idea-1', 'ws-personal', 'Private meeting follow-up assistant', 'Pilot', 'Planning', 'Alex Morgan', '', 'Today', 16, 85, 42, 84, 'Personal-only follow-up assistant.', 'Confirm private evidence sources.', '["Personal","Planning","Pilot"]', '["Scoped evidence only"]', '["Captured in Personal"]', 1),
  ('team-idea-1', 'ws-team', 'Team RAID Copilot', 'Pilot', 'Risk and issue management', 'Taylor Kim', '', 'Today', 18, 92, 44, 83, 'Team-only RAID automation.', 'Pilot in Team Projects.', '["Team","RAID","Pilot"]', '["Team evidence only"]', '["Captured in Team"]', 1),
  ('org-idea-1', 'ws-org', 'Org AI governance classifier', 'Approved', 'Governance', 'Priya Shah', '', 'Today', 20, 90, 50, 88, 'Org-only governance classifier.', 'Approve org rollout path.', '["Org","Governance","Approved"]', '["Org evidence only"]', '["Captured in Org"]', 1);

insert into artifacts (id, workspace_id, title, file_type, owner, artifact_date, status, summary, r2_key, href, preview_json, pinned) values
  ('artifact-personal-doc', 'ws-personal', 'Personal Focus Plan', 'DOCX', 'Alex Morgan', 'Jun 8, 2026', 'Pinned', 'Personal dummy DOCX artifact.', 'personal/artifacts/personal-focus-plan.docx', '/artifacts/personal-focus-plan.docx', '["Personal-only file"]', 1),
  ('artifact-personal-xlsx', 'ws-personal', 'Personal Tracker', 'XLSX', 'Alex Morgan', 'Jun 9, 2026', 'Draft', 'Personal dummy XLSX artifact.', 'personal/artifacts/personal-tracker.xlsx', '/artifacts/personal-tracker.xlsx', '["Personal tracker file"]', 0),
  ('artifact-personal-pptx', 'ws-personal', 'Private Planning Brief', 'PPTX', 'Alex Morgan', 'Jun 10, 2026', 'Final', 'Personal dummy PPTX artifact.', 'personal/artifacts/personal-planning-brief.pptx', '/artifacts/personal-planning-brief.pptx', '["Personal briefing file"]', 0),
  ('artifact-team-xlsx', 'ws-team', 'Team Improvement Register', 'XLSX', 'PMO Team', 'Jun 10, 2026', 'Pinned', 'Team dummy XLSX artifact.', 'team/artifacts/team-improvement-register.xlsx', '/artifacts/team-improvement-register.xlsx', '["Team-only file"]', 1),
  ('artifact-team-pptx', 'ws-team', 'Vertex Hub Roadmap Brief', 'PPTX', 'Taylor Kim', 'Jun 7, 2026', 'Final', 'Team dummy PPTX artifact.', 'team/artifacts/team-vertex-roadmap-brief.pptx', '/artifacts/team-vertex-roadmap-brief.pptx', '["Team project file"]', 0),
  ('artifact-team-doc', 'ws-team', 'Team Launch Checklist', 'DOCX', 'Maya Chen', 'Jun 6, 2026', 'Draft', 'Team dummy DOCX artifact.', 'team/artifacts/team-launch-checklist.docx', '/artifacts/team-launch-checklist.docx', '["Team launch file"]', 0),
  ('artifact-org-doc', 'ws-org', 'Org AI Governance Charter', 'DOCX', 'Priya Shah', 'Jun 11, 2026', 'Final', 'Org dummy DOCX artifact.', 'org/artifacts/org-ai-governance-charter.docx', '/artifacts/org-ai-governance-charter.docx', '["Org-only file"]', 0),
  ('artifact-org-xlsx', 'ws-org', 'Portfolio Health Model', 'XLSX', 'Finance Ops', 'Jun 10, 2026', 'Pinned', 'Org dummy XLSX artifact.', 'org/artifacts/org-portfolio-health-model.xlsx', '/artifacts/org-portfolio-health-model.xlsx', '["Org model file"]', 1),
  ('artifact-org-pptx', 'ws-org', 'Executive AI Briefing', 'PPTX', 'Strategy Office', 'Jun 9, 2026', 'Draft', 'Org dummy PPTX artifact.', 'org/artifacts/org-executive-ai-briefing.pptx', '/artifacts/org-executive-ai-briefing.pptx', '["Org briefing file"]', 0);

insert into workspace_actions (id, workspace_id, kind, title, owner, due, source, status) values
  ('personal-decision-1', 'ws-personal', 'decision', 'Confirm private planning scope', 'Alex Morgan', 'Due Jun 14', null, 'Open'),
  ('team-decision-1', 'ws-team', 'decision', 'Approve Team RAID pilot', 'Taylor Kim', 'Due Jun 14', null, 'Open'),
  ('org-decision-1', 'ws-org', 'decision', 'Approve org AI governance charter', 'Priya Shah', 'Due Jun 14', null, 'Open'),
  ('personal-task-1', 'ws-personal', 'task', 'Refresh personal tracker', 'Alex Morgan', 'Due Jun 13', 'Personal Tracker', 'Open'),
  ('team-task-1', 'ws-team', 'task', 'Package Vertex Hub roadmap evidence', 'Maya Chen', 'Due Jun 13', 'Vertex Hub Roadmap Brief', 'In progress'),
  ('org-task-1', 'ws-org', 'task', 'Publish governance briefing', 'Strategy Office', 'Due Jun 13', 'Executive AI Briefing', 'Open');
