import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

export type IdeaStatus = "New" | "Review" | "Pilot" | "Approved" | "Implemented" | "Blocked";
export type TabName = "Chat" | "Ideas" | "Artifacts" | "Decisions" | "Approvals" | "Tasks" | "Prompt Templates";
export type RailName = "Workspaces" | "Chats" | "Ideas" | "Artifacts" | "Decisions" | "Approvals" | "Tasks" | "Prompts";
export type WorkspaceMode = "Personal" | "Team" | "Org";
export type WorkspaceScope = "personal" | "team" | "org";
export type ChatSection = "project" | "workspace";

export type ChatSummary = {
  id: string;
  title: string;
  description: string;
};

export type ProjectSummary = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Watch" | "Planning";
  projectChats: ChatSummary[];
};

export type Idea = {
  id: string;
  title: string;
  status: IdeaStatus;
  category: string;
  owner: string;
  avatar: string;
  created: string;
  votes: number;
  impact: number;
  effort: number;
  confidence: number;
  summary: string;
  nextStep: string;
  tags: string[];
  metrics: string[];
  thread: string[];
};

export type ChatMessage = {
  id: string;
  author: string;
  role: "user" | "assistant" | "system";
  avatar?: string;
  time: string;
  text: string;
  artifact?: {
    title: string;
    meta: string;
    type: "doc" | "ppt" | "sheet";
  };
};

export type Artifact = {
  title: string;
  type: string;
  owner: string;
  date: string;
  status: "Final" | "Draft" | "Pinned";
  summary: string;
  href: string;
  r2Key: string;
  preview: string[];
  pinnedTo: WorkspaceMode[];
};

export type Decision = {
  id: string;
  title: string;
  status: "Open" | "Blocked" | "Done";
  owner: string;
  due: string;
};

export type Approval = {
  id: string;
  title: string;
  owner: string;
  due: string;
  status: "Needed" | "Requested" | "Approved";
};

export type Task = {
  id: string;
  title: string;
  owner: string;
  source: string;
  status: "Open" | "In progress" | "Done";
};

export type ActivityItem = {
  id: string;
  label: string;
  detail: string;
  time: string;
};

export type ScopedWorkspaceState = {
  scope: WorkspaceScope;
  mode: WorkspaceMode;
  projectsHeading: string;
  projectChatsHeading: string;
  workspaceChatsHeading: string;
  unassignedProjectLabel: string;
  projects: ProjectSummary[];
  workspaceChats: ChatSummary[];
  ideas: Idea[];
  conversations: Record<string, ChatMessage[]>;
  artifacts: Artifact[];
  decisions: Decision[];
  approvals: Approval[];
  tasks: Task[];
  pinnedIdeaIds: string[];
  accessLevel: "Read / Write" | "View only";
  activity: ActivityItem[];
  updatedAt: string;
};

export type PmoWorkspaceState = {
  productName: string;
  workspaces: Record<WorkspaceMode, ScopedWorkspaceState>;
};

export type AddIdeaInput = {
  title: string;
  category: string;
  status: IdeaStatus;
  impact: "High" | "Medium" | "Low";
  summary: string;
};

export const avatarAlex =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80";
export const avatarJordan =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";
export const avatarTaylor =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80";
export const avatarMaya =
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80";
export const avatarPriya =
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=80";

export const statusMeta: Record<IdeaStatus, { label: string; tone: "info" | "warning" | "success" | "destructive" | "secondary"; description: string }> = {
  New: { label: "New", tone: "info", description: "Captured and ready for triage." },
  Review: { label: "Under review", tone: "warning", description: "Sizing impact, owner, and governance fit." },
  Pilot: { label: "In pilot", tone: "info", description: "Being tested in a live workflow." },
  Approved: { label: "Approved", tone: "success", description: "Ready for rollout." },
  Implemented: { label: "Implemented", tone: "success", description: "Released into the operating model." },
  Blocked: { label: "Blocked", tone: "destructive", description: "Needs a decision, data source, or owner." },
};

export const tabs: TabName[] = ["Chat", "Ideas", "Artifacts", "Decisions", "Approvals", "Tasks", "Prompt Templates"];
export const workspaceModes: WorkspaceMode[] = ["Personal", "Team", "Org"];
export const statusFilters: Array<IdeaStatus | "All"> = ["All", "New", "Review", "Pilot", "Approved", "Implemented", "Blocked"];
export const modelOptions = ["GPT 5.5", "Claude Opus 4.6", "Gemini Flash 3.5"];
export const promptTemplates = [
  "Summarize improvement ideas by impact, effort, and status for the active workspace.",
  "Draft a concise nudge for owners of decisions older than seven days.",
  "Create a RAID summary from the current project chats and artifacts.",
];

const scopeByMode: Record<WorkspaceMode, WorkspaceScope> = {
  Personal: "personal",
  Team: "team",
  Org: "org",
};

const assistantName = "AI Command Center";

const workspaceSeed = {
  Personal: {
    projectsHeading: "Personal Projects",
    projectChatsHeading: "Project Chats",
    workspaceChatsHeading: "Personal Chats",
    unassignedProjectLabel: "No project",
    projects: [
      { id: "personal-certification-plan", name: "Certification Plan", description: "Private credential and milestone tracking.", status: "Active" as const },
      { id: "personal-weekly-reset", name: "Weekly Reset", description: "Personal planning workspace for recurring follow-up.", status: "Planning" as const },
    ],
    workspaceChats: [
      { id: "personal-assistant", title: "Personal Command Chat", description: "Private planning and follow-up." },
      { id: "personal-notes", title: "Personal Chats", description: "Notes that are not tied to a project." },
      { id: "personal-ideas", title: "Idea Scratchpad", description: "Private improvement thinking." },
    ],
    artifacts: [
      ["Personal Focus Plan", "DOCX", "Alex Morgan", "Jun 8, 2026", "Pinned", "/artifacts/personal-focus-plan.docx", "personal/artifacts/personal-focus-plan.docx"],
      ["Personal Tracker", "XLSX", "Alex Morgan", "Jun 9, 2026", "Draft", "/artifacts/personal-tracker.xlsx", "personal/artifacts/personal-tracker.xlsx"],
      ["Private Planning Brief", "PPTX", "Alex Morgan", "Jun 10, 2026", "Final", "/artifacts/personal-planning-brief.pptx", "personal/artifacts/personal-planning-brief.pptx"],
    ],
  },
  Team: {
    projectsHeading: "Team Projects",
    projectChatsHeading: "Project Chats",
    workspaceChatsHeading: "Team Chats",
    unassignedProjectLabel: "No team project",
    projects: [
      { id: "team-vertex-hub", name: "Vertex Hub", description: "Shared PMO launch execution.", status: "Active" as const },
      { id: "team-lms-next-gen", name: "LMS Next Gen", description: "Team delivery, vendor, and UAT coordination.", status: "Watch" as const },
      { id: "team-data-migration", name: "Data Migration", description: "Cross-functional cutover and validation.", status: "Active" as const },
    ],
    workspaceChats: [
      { id: "team-command", title: "Team Chats", description: "PMO team-wide working thread." },
      { id: "team-intake", title: "Intake Council", description: "Shared intake triage and prioritization." },
      { id: "team-risks", title: "Risk & Escalations", description: "Team-level risks outside a single project." },
    ],
    artifacts: [
      ["Team Improvement Register", "XLSX", "PMO Team", "Jun 10, 2026", "Pinned", "/artifacts/team-improvement-register.xlsx", "team/artifacts/team-improvement-register.xlsx"],
      ["Vertex Hub Roadmap Brief", "PPTX", "Taylor Kim", "Jun 7, 2026", "Final", "/artifacts/team-vertex-roadmap-brief.pptx", "team/artifacts/team-vertex-roadmap-brief.pptx"],
      ["Team Launch Checklist", "DOCX", "Maya Chen", "Jun 6, 2026", "Draft", "/artifacts/team-launch-checklist.docx", "team/artifacts/team-launch-checklist.docx"],
    ],
  },
  Org: {
    projectsHeading: "Org projects",
    projectChatsHeading: "Project Chats",
    workspaceChatsHeading: "Org Chats",
    unassignedProjectLabel: "No org project",
    projects: [
      { id: "org-enterprise-ai", name: "Enterprise AI Governance", description: "Organization-wide AI operating model.", status: "Active" as const },
      { id: "org-portfolio-health", name: "Portfolio Health", description: "Executive portfolio reporting and decisions.", status: "Watch" as const },
    ],
    workspaceChats: [
      { id: "org-command", title: "Org Chats", description: "Organization-level executive workspace." },
      { id: "org-policy", title: "Policy Review", description: "Governance and data handling decisions." },
      { id: "org-briefings", title: "Executive Briefings", description: "Leadership-ready summaries." },
    ],
    artifacts: [
      ["Org AI Governance Charter", "DOCX", "Priya Shah", "Jun 11, 2026", "Final", "/artifacts/org-ai-governance-charter.docx", "org/artifacts/org-ai-governance-charter.docx"],
      ["Portfolio Health Model", "XLSX", "Finance Ops", "Jun 10, 2026", "Pinned", "/artifacts/org-portfolio-health-model.xlsx", "org/artifacts/org-portfolio-health-model.xlsx"],
      ["Executive AI Briefing", "PPTX", "Strategy Office", "Jun 9, 2026", "Draft", "/artifacts/org-executive-ai-briefing.pptx", "org/artifacts/org-executive-ai-briefing.pptx"],
    ],
  },
} satisfies Record<WorkspaceMode, {
  projectsHeading: string;
  projectChatsHeading: string;
  workspaceChatsHeading: string;
  unassignedProjectLabel: string;
  projects: Array<Omit<ProjectSummary, "projectChats">>;
  workspaceChats: ChatSummary[];
  artifacts: Array<[string, string, string, string, Artifact["status"], string, string]>;
}>;

const projectChatTemplates: Record<WorkspaceMode, string[]> = {
  Personal: ["Project Notes", "Project Chats", "Private Risks"],
  Team: ["Shared Project Chat", "Project Chats", "Decision Log"],
  Org: ["Org Project Chat", "Project Chats", "Leadership Decisions"],
};

function withProjectChats(mode: WorkspaceMode, project: Omit<ProjectSummary, "projectChats">): ProjectSummary {
  return {
    ...project,
    projectChats: projectChatTemplates[mode].map((title, index) => ({
      id: `${project.id}-chat-${index + 1}`,
      title,
      description: `${title} for ${project.name}.`,
    })),
  };
}

function buildIdea(mode: WorkspaceMode, index: number, title: string, category: string, status: IdeaStatus, owner: string, avatar: string): Idea {
  return {
    id: `${scopeByMode[mode]}-idea-${index}`,
    title,
    status,
    category,
    owner,
    avatar,
    created: index === 1 ? "Today" : `Jun ${11 - index}`,
    votes: 18 - index * 2,
    impact: 92 - index * 7,
    effort: 34 + index * 8,
    confidence: 88 - index * 4,
    summary: `${workspaceModeLabel(mode)} scoped idea. This record is intentionally different from the other workspaces so scope switching is obvious.`,
    nextStep: `Confirm the ${workspaceModeLabel(mode).toLowerCase()} owner, artifact evidence, and decision path.`,
    tags: [workspaceModeLabel(mode), category, status],
    metrics: [`${mode} metric ${index}`, "Scoped evidence only", "No lower-scope exposure"],
    thread: [
      `${workspaceModeLabel(mode)} idea captured in AI Command Center.`,
      "Assistant linked only same-scope chats, artifacts, and decisions.",
    ],
  };
}

function buildMessages(mode: WorkspaceMode, label: string, projectName?: string): ChatMessage[] {
  const scopeLabel = workspaceModeLabel(mode);
  const context = projectName ? `${scopeLabel} / ${projectName} / ${label}` : `${scopeLabel} / ${label}`;
  return [
    {
      id: `${scopeByMode[mode]}-${label}-1`,
      author: mode === "Org" ? "Priya Shah" : mode === "Team" ? "Taylor Kim" : "Alex Morgan",
      role: "user",
      avatar: mode === "Org" ? avatarPriya : mode === "Team" ? avatarTaylor : avatarAlex,
      time: "9:15 AM",
      text: `Summarize the current ${context} scope and call out the next action.`,
    },
    {
      id: `${scopeByMode[mode]}-${label}-2`,
      author: assistantName,
      role: "assistant",
      time: "9:16 AM",
      text: `I reviewed only ${context}. The visible chats, ideas, artifacts, decisions, approvals, and tasks are isolated to the ${scopeByMode[mode]} scope.`,
      artifact: {
        title: `${scopeLabel} Scope Snapshot`,
        meta: projectName ? "DOCX - Project scoped" : "PPTX - Workspace scoped",
        type: projectName ? "doc" : "ppt",
      },
    },
  ];
}

function buildArtifacts(mode: WorkspaceMode): Artifact[] {
  return workspaceSeed[mode].artifacts.map(([title, type, owner, date, status, href, r2Key]) => ({
    title,
    type,
    owner,
    date,
    status,
    href,
    r2Key,
    summary: `${workspaceModeLabel(mode)} artifact stored as R2 object ${r2Key}.`,
    preview: [
      `${workspaceModeLabel(mode)}-only evidence and working notes.`,
      "Dummy artifact content is intentionally unique by workspace.",
      "D1 stores metadata while R2 stores the file bytes.",
    ],
    pinnedTo: status === "Pinned" ? [mode] : [],
  }));
}

function buildWorkspace(mode: WorkspaceMode): ScopedWorkspaceState {
  const seed = workspaceSeed[mode];
  const projects = seed.projects.map((project) => withProjectChats(mode, project));
  const conversations: Record<string, ChatMessage[]> = {};

  for (const chat of seed.workspaceChats) {
    conversations[getConversationKey(mode, null, chat.id)] = buildMessages(mode, chat.title);
  }

  for (const project of projects) {
    for (const chat of project.projectChats) {
      conversations[getConversationKey(mode, project.id, chat.id)] = buildMessages(mode, chat.title, project.name);
    }
  }

  const ideas =
    mode === "Personal"
      ? [
          buildIdea(mode, 1, "Private meeting follow-up assistant", "Planning", "Pilot", "Alex Morgan", avatarAlex),
          buildIdea(mode, 2, "Personal artifact reminder", "Artifacts", "Review", "Alex Morgan", avatarAlex),
        ]
      : mode === "Team"
        ? [
            buildIdea(mode, 1, "Team RAID Copilot", "Risk and issue management", "Pilot", "Taylor Kim", avatarTaylor),
            buildIdea(mode, 2, "Team decision aging nudges", "Governance", "Approved", "Jordan Lee", avatarJordan),
            buildIdea(mode, 3, "Team intake triage assistant", "Intake", "Review", "Maya Chen", avatarMaya),
          ]
        : [
            buildIdea(mode, 1, "Org AI governance classifier", "Governance", "Approved", "Priya Shah", avatarPriya),
            buildIdea(mode, 2, "Portfolio health narrative builder", "Planning", "Pilot", "Jordan Lee", avatarJordan),
            buildIdea(mode, 3, "Enterprise artifact retention monitor", "Artifacts", "New", "Taylor Kim", avatarTaylor),
          ];

  return {
    scope: scopeByMode[mode],
    mode,
    projectsHeading: seed.projectsHeading,
    projectChatsHeading: seed.projectChatsHeading,
    workspaceChatsHeading: seed.workspaceChatsHeading,
    unassignedProjectLabel: seed.unassignedProjectLabel,
    projects,
    workspaceChats: seed.workspaceChats,
    ideas,
    conversations,
    artifacts: buildArtifacts(mode),
    decisions: [
      { id: `${scopeByMode[mode]}-decision-1`, title: `${workspaceModeLabel(mode)} scope owner confirmed`, status: "Open", owner: mode === "Org" ? "Priya Shah" : "Alex Morgan", due: "Due Jun 14" },
      { id: `${scopeByMode[mode]}-decision-2`, title: `${workspaceModeLabel(mode)} artifact retention path`, status: mode === "Personal" ? "Done" : "Blocked", owner: "Jordan Lee", due: mode === "Personal" ? "Done" : "Due Jun 12" },
    ],
    approvals: [
      { id: `${scopeByMode[mode]}-approval-1`, title: `${workspaceModeLabel(mode)} workspace publishing`, owner: mode === "Org" ? "Strategy Office" : "Taylor Kim", due: "Due Jun 15", status: "Needed" },
      { id: `${scopeByMode[mode]}-approval-2`, title: `${workspaceModeLabel(mode)} data visibility`, owner: "Priya Shah", due: "Requested", status: "Requested" },
    ],
    tasks: [
      { id: `${scopeByMode[mode]}-task-1`, title: `Review ${workspaceModeLabel(mode).toLowerCase()} project chat coverage`, owner: "Maya Chen", source: seed.projectChatsHeading, status: "Open" },
      { id: `${scopeByMode[mode]}-task-2`, title: `Refresh ${workspaceModeLabel(mode).toLowerCase()} artifacts`, owner: "Alex Morgan", source: "Artifacts", status: "In progress" },
    ],
    pinnedIdeaIds: ideas.slice(0, 2).map((idea) => idea.id),
    accessLevel: "Read / Write",
    activity: [
      { id: `${scopeByMode[mode]}-activity-1`, label: `${workspaceModeLabel(mode)} scope loaded`, detail: "Data is isolated from the other workspaces.", time: "9:21 AM" },
      { id: `${scopeByMode[mode]}-activity-2`, label: "R2 artifact metadata ready", detail: `${buildArtifacts(mode).length} dummy objects mapped.`, time: "Yesterday" },
    ],
    updatedAt: "Jun 11, 2026 9:21 AM",
  };
}

const initialWorkspaceState: PmoWorkspaceState = {
  productName: "AI Command Center",
  workspaces: {
    Personal: buildWorkspace("Personal"),
    Team: buildWorkspace("Team"),
    Org: buildWorkspace("Org"),
  },
};

let workspaceState: PmoWorkspaceState | null = null;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getMutableRoot() {
  workspaceState ??= clone(initialWorkspaceState);
  return workspaceState;
}

function getMutableWorkspace(mode: WorkspaceMode) {
  return getMutableRoot().workspaces[mode];
}

function nowLabel() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function recordActivity(workspace: ScopedWorkspaceState, label: string, detail: string) {
  workspace.updatedAt = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  workspace.activity = [
    { id: `activity-${Date.now()}-${Math.round(Math.random() * 1000)}`, label, detail, time: nowLabel() },
    ...workspace.activity,
  ].slice(0, 8);
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function cycleDecisionStatus(status: Decision["status"]): Decision["status"] {
  if (status === "Open") return "Done";
  if (status === "Blocked") return "Open";
  return "Open";
}

function cycleApprovalStatus(status: Approval["status"]): Approval["status"] {
  if (status === "Needed") return "Requested";
  if (status === "Requested") return "Approved";
  return "Needed";
}

function cycleTaskStatus(status: Task["status"]): Task["status"] {
  if (status === "Open") return "In progress";
  if (status === "In progress") return "Done";
  return "Open";
}

function impactScore(value: AddIdeaInput["impact"]) {
  if (value === "High") return 86;
  if (value === "Medium") return 68;
  return 46;
}

export function getConversationKey(mode: WorkspaceMode, projectId: string | null, chatId: string) {
  return `${scopeByMode[mode]}::${projectId ?? "unassigned"}::${chatId}`;
}

export function workspaceModeLabel(mode: WorkspaceMode) {
  return mode;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const fetchPmoWorkspace = createServerFn({ method: "GET" }).handler(async () => {
  return clone(getMutableRoot());
});

export const sendChatMessage = createServerFn({ method: "POST" })
  .validator((data: { mode: WorkspaceMode; projectId: string | null; chatId: string; chatTitle: string; text: string; model: string }) => data)
  .handler(async ({ data }) => {
    const workspace = getMutableWorkspace(data.mode);
    const conversationKey = getConversationKey(data.mode, data.projectId, data.chatId);
    const text = data.text.trim();
    if (!text) return clone(getMutableRoot());

    const userMessage: ChatMessage = {
      id: createId("msg-user"),
      author: "Alex Morgan",
      role: "user",
      avatar: avatarAlex,
      time: nowLabel(),
      text,
    };
    const response: ChatMessage = {
      id: createId("msg-assistant"),
      author: assistantName,
      role: "assistant",
      time: nowLabel(),
      text:
        `I reviewed ${workspaceModeLabel(data.mode)} / ${data.chatTitle} with ${data.model}. ` +
        `Only ${workspace.scope} scoped records were considered, including same-scope artifacts in R2.`,
      artifact: {
        title: `${workspaceModeLabel(data.mode)} Action Snapshot`,
        meta: `DOCX - Generated by ${data.model}`,
        type: "doc",
      },
    };

    workspace.conversations[conversationKey] = [...(workspace.conversations[conversationKey] ?? []), userMessage, response];
    recordActivity(workspace, "Chat response generated", `${data.chatTitle} updated in ${workspaceModeLabel(data.mode)}.`);
    return clone(getMutableRoot());
  });

export const addIdea = createServerFn({ method: "POST" })
  .validator((data: AddIdeaInput & { mode?: WorkspaceMode }) => data)
  .handler(async ({ data }) => {
    const mode = data.mode ?? "Personal";
    const workspace = getMutableWorkspace(mode);
    const title = data.title.trim();
    if (!title) return clone(getMutableRoot());

    const nextIdea: Idea = {
      id: createId(`${workspace.scope}-idea`),
      title,
      status: data.status,
      category: data.category,
      owner: "Alex Morgan",
      avatar: avatarAlex,
      created: "Just now",
      votes: 1,
      impact: impactScore(data.impact),
      effort: data.impact === "High" ? 52 : data.impact === "Medium" ? 42 : 30,
      confidence: data.impact === "High" ? 78 : 66,
      summary: data.summary.trim() || `New ${workspaceModeLabel(mode).toLowerCase()} improvement idea captured from the workspace.`,
      nextStep: "Confirm owner, evidence source, and governance fit.",
      tags: [data.category, data.impact, workspaceModeLabel(mode)],
      metrics: ["Owner confirmation needed", "Evidence source pending", "Governance review pending"],
      thread: ["Idea captured through AI Command Center.", "Assistant prepared initial impact and follow-up fields."],
    };

    workspace.ideas = [nextIdea, ...workspace.ideas];
    workspace.pinnedIdeaIds = [nextIdea.id, ...workspace.pinnedIdeaIds];
    recordActivity(workspace, "Idea added", `${nextIdea.title} entered ${workspaceModeLabel(mode)}.`);
    return clone(getMutableRoot());
  });

export const updateIdeaStatus = createServerFn({ method: "POST" })
  .validator((data: { mode: WorkspaceMode; id: string; status: IdeaStatus }) => data)
  .handler(async ({ data }) => {
    const workspace = getMutableWorkspace(data.mode);
    workspace.ideas = workspace.ideas.map((idea) => (idea.id === data.id ? { ...idea, status: data.status } : idea));
    const idea = workspace.ideas.find((item) => item.id === data.id);
    recordActivity(workspace, "Idea status changed", `${idea?.title ?? "Idea"} moved to ${data.status}.`);
    return clone(getMutableRoot());
  });

export const voteIdea = createServerFn({ method: "POST" })
  .validator((data: { mode: WorkspaceMode; id: string }) => data)
  .handler(async ({ data }) => {
    const workspace = getMutableWorkspace(data.mode);
    workspace.ideas = workspace.ideas.map((idea) => (idea.id === data.id ? { ...idea, votes: idea.votes + 1 } : idea));
    const idea = workspace.ideas.find((item) => item.id === data.id);
    recordActivity(workspace, "Idea vote added", `${idea?.title ?? "Idea"} gained a vote.`);
    return clone(getMutableRoot());
  });

export const toggleIdeaPin = createServerFn({ method: "POST" })
  .validator((data: { mode: WorkspaceMode; id: string }) => data)
  .handler(async ({ data }) => {
    const workspace = getMutableWorkspace(data.mode);
    const isPinned = workspace.pinnedIdeaIds.includes(data.id);
    workspace.pinnedIdeaIds = isPinned ? workspace.pinnedIdeaIds.filter((id) => id !== data.id) : [data.id, ...workspace.pinnedIdeaIds];
    const idea = workspace.ideas.find((item) => item.id === data.id);
    recordActivity(workspace, isPinned ? "Idea unpinned" : "Idea pinned", `${idea?.title ?? "Idea"} workspace pin changed.`);
    return clone(getMutableRoot());
  });

export const toggleArtifactPin = createServerFn({ method: "POST" })
  .validator((data: { mode: WorkspaceMode; title: string }) => data)
  .handler(async ({ data }) => {
    const workspace = getMutableWorkspace(data.mode);
    workspace.artifacts = workspace.artifacts.map((artifact) => {
      if (artifact.title !== data.title) return artifact;
      const isPinned = artifact.pinnedTo.includes(data.mode);
      return { ...artifact, pinnedTo: isPinned ? artifact.pinnedTo.filter((mode) => mode !== data.mode) : [...artifact.pinnedTo, data.mode] };
    });
    recordActivity(workspace, "Artifact pin changed", `${data.title} updated for ${workspaceModeLabel(data.mode)}.`);
    return clone(getMutableRoot());
  });

export const toggleDecisionStatus = createServerFn({ method: "POST" })
  .validator((data: { mode: WorkspaceMode; id: string }) => data)
  .handler(async ({ data }) => {
    const workspace = getMutableWorkspace(data.mode);
    workspace.decisions = workspace.decisions.map((decision) => (decision.id === data.id ? { ...decision, status: cycleDecisionStatus(decision.status) } : decision));
    const decision = workspace.decisions.find((item) => item.id === data.id);
    recordActivity(workspace, "Decision updated", `${decision?.title ?? "Decision"} is now ${decision?.status ?? "updated"}.`);
    return clone(getMutableRoot());
  });

export const toggleApprovalStatus = createServerFn({ method: "POST" })
  .validator((data: { mode: WorkspaceMode; id: string }) => data)
  .handler(async ({ data }) => {
    const workspace = getMutableWorkspace(data.mode);
    workspace.approvals = workspace.approvals.map((approval) => (approval.id === data.id ? { ...approval, status: cycleApprovalStatus(approval.status) } : approval));
    const approval = workspace.approvals.find((item) => item.id === data.id);
    recordActivity(workspace, "Approval updated", `${approval?.title ?? "Approval"} is now ${approval?.status ?? "updated"}.`);
    return clone(getMutableRoot());
  });

export const toggleTaskStatus = createServerFn({ method: "POST" })
  .validator((data: { mode: WorkspaceMode; id: string }) => data)
  .handler(async ({ data }) => {
    const workspace = getMutableWorkspace(data.mode);
    workspace.tasks = workspace.tasks.map((task) => (task.id === data.id ? { ...task, status: cycleTaskStatus(task.status) } : task));
    const task = workspace.tasks.find((item) => item.id === data.id);
    recordActivity(workspace, "Task updated", `${task?.title ?? "Task"} is now ${task?.status ?? "updated"}.`);
    return clone(getMutableRoot());
  });

export const updateAccessLevel = createServerFn({ method: "POST" })
  .validator((data: { mode: WorkspaceMode; accessLevel: ScopedWorkspaceState["accessLevel"] }) => data)
  .handler(async ({ data }) => {
    const workspace = getMutableWorkspace(data.mode);
    workspace.accessLevel = data.accessLevel;
    recordActivity(workspace, "Workspace access updated", `${workspaceModeLabel(data.mode)} access set to ${data.accessLevel}.`);
    return clone(getMutableRoot());
  });

export const pmoWorkspaceQueryKey = ["ai-command-center"] as const;

export const pmoWorkspaceQueryOptions = () =>
  queryOptions({
    queryKey: pmoWorkspaceQueryKey,
    queryFn: () => fetchPmoWorkspace(),
  });
