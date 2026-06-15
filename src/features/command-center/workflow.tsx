import { useMemo, type ReactNode } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Eye, UploadCloud, Plus, Search, Share2, ShieldAlert, Sparkles, Star, Trash2 } from "lucide-react";
import { ArtifactUploader } from "@/components/ArtifactUploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTaskAsanaSyncControlState } from "@/lib/asana-task-sync-state";
import { cn } from "@/lib/utils";
import {
  type Approval,
  type Artifact,
  type Decision,
  type Idea,
  type IdeaStatus,
  type ProjectSummary,
  type Risk,
  type Task,
  type WorkspaceMode,
  statusFilters,
  statusMeta,
  workspaceModeLabel,
} from "@/lib/pmo-data";
import { type WorkflowPreviewState } from "./shared";
import { SectionHeader } from "./layout";
import { DataTable, SeverityBadge, artifactIcon } from "./common";

export type WorkflowLineItem = {
  id: string;
  title: string;
  originalText?: string;
  meta: string;
  statusControl?: ReactNode;
  complete?: "success" | "destructive";
  pinned?: boolean;
};

export const approvalStatusOptions: Approval["status"][] = ["Not Reviewed", "Reviewing", "Approved", "Not Approved"];

export const decisionStatusOptions: Decision["status"][] = ["Not Completed", "Completed"];

export const ideaStatusOptions: IdeaStatus[] = ["Not Started", "Reviewing", "Convert to Project", "Dismiss"];

export function WorkflowStatusSelect<TStatus extends string>({
  disabled,
  label,
  onChange,
  options,
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: TStatus) => void;
  options: TStatus[];
  value: TStatus;
}) {
  return (
    <select
      aria-label={label}
      title={label}
      className="h-8 rounded-md border bg-background px-2 text-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      disabled={disabled}
      value={value}
      onChange={(event) => onChange(event.target.value as TStatus)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function WorkflowLineList({
  canEdit,
  emptyLabel,
  hideActions = false,
  items,
  onDelete,
  onPreview,
  onSelect,
  onTogglePin,
}: {
  canEdit: boolean;
  emptyLabel: string;
  hideActions?: boolean;
  items: WorkflowLineItem[];
  onDelete: (id: string) => void;
  onPreview: (item: WorkflowLineItem) => void;
  onSelect: (item: WorkflowLineItem) => void;
  onTogglePin?: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="grid min-h-28 place-items-center rounded-md border border-dashed bg-background p-4 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center gap-3 rounded-md border bg-background p-3 text-left transition-colors hover:bg-accent/45 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          onClick={() => onSelect(item)}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            onSelect(item);
          }}
        >
          <span className="min-w-0 flex-1">
            <strong
              className={cn(
                "block truncate text-sm",
                item.complete === "success" && "text-success line-through decoration-success decoration-2",
                item.complete === "destructive" && "text-destructive line-through decoration-destructive decoration-2",
              )}
            >
              {item.title}
            </strong>
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">{item.meta}</span>
          </span>
          {hideActions ? null : (
            <div
              className="flex shrink-0 items-center gap-2"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              {canEdit && onTogglePin ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={item.pinned ? `Unpin ${item.title}` : `Pin ${item.title}`}
                  title={item.pinned ? "Unpin" : "Pin"}
                  onClick={() => onTogglePin(item.id)}
                >
                  <Star className={cn(item.pinned && "fill-warning text-warning")} />
                  {item.pinned ? "Pinned" : "Pin"}
                </Button>
              ) : null}
              {item.statusControl}
              <Button type="button" variant="outline" size="sm" onClick={() => onPreview(item)}>
                <Eye />
                Preview
              </Button>
              {canEdit ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 />
                  Delete
                </Button>
              ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function IdeasView({
  canEdit,
  ideas,
  pinnedIdeaIds,
  searchTerm,
  statusFilter,
  onAddIdea,
  onDeleteIdea,
  onPreviewIdea,
  onSearchTerm,
  onSelectIdea,
  onStatusChange,
  onStatusFilter,
  onToggleIdeaPin,
}: {
  canEdit: boolean;
  ideas: Idea[];
  pinnedIdeaIds: string[];
  searchTerm: string;
  statusFilter: IdeaStatus | "All";
  onAddIdea: () => void;
  onDeleteIdea: (id: string) => void;
  onPreviewIdea: (idea: Idea) => void;
  onSearchTerm: (value: string) => void;
  onSelectIdea: (idea: Idea) => void;
  onStatusChange: (idea: Idea, status: IdeaStatus) => void;
  onStatusFilter: (value: IdeaStatus | "All") => void;
  onToggleIdeaPin: (id: string) => void;
}) {
  const lineItems = useMemo<WorkflowLineItem[]>(
    () =>
      ideas.map((idea) => ({
        id: idea.id,
        title: idea.title,
        originalText: idea.originalText,
        meta: `${idea.owner} / ${idea.category} / Impact ${idea.impact} / Effort ${idea.effort} / Confidence ${idea.confidence}${pinnedIdeaIds.includes(idea.id) ? " / Pinned" : ""}`,
        complete: idea.status === "Convert to Project" ? "success" : idea.status === "Dismiss" ? "destructive" : undefined,
        pinned: pinnedIdeaIds.includes(idea.id),
        statusControl: (
          <WorkflowStatusSelect
            disabled={!canEdit}
            label={`Idea status for ${idea.title}`}
            options={ideaStatusOptions}
            value={idea.status}
            onChange={(status) => onStatusChange(idea, status)}
          />
        ),
      })),
    [canEdit, ideas, onStatusChange, pinnedIdeaIds],
  );
  const ideasById = useMemo(() => new Map(ideas.map((idea) => [idea.id, idea])), [ideas]);

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="Improvement queue"
        title={`${ideas.length} PMO ideas in view`}
        actions={
          canEdit ? (
            <Button type="button" onClick={onAddIdea} data-testid="open-add-idea">
              <Plus />
              Add idea
            </Button>
          ) : null
        }
      />
      <div className="grid gap-2 xl:grid-cols-[280px_minmax(0,1fr)]">
        <label className="flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-muted-foreground">
          <Search className="size-4" />
          <Input
            className="h-7 border-0 px-0 shadow-none focus-visible:ring-0"
            placeholder="Search idea queue"
            value={searchTerm}
            onChange={(event) => onSearchTerm(event.target.value)}
          />
        </label>
        <div className="scrollbar-thin flex gap-2 overflow-x-auto">
          {statusFilters.map((status) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={status === statusFilter ? "default" : "outline"}
              onClick={() => onStatusFilter(status)}
            >
              {status === "All" ? "All" : statusMeta[status].label}
            </Button>
          ))}
        </div>
      </div>
      <WorkflowLineList
        canEdit={canEdit}
        emptyLabel="No ideas match this view."
        items={lineItems}
        onDelete={onDeleteIdea}
        onPreview={(item) => {
          const idea = ideasById.get(item.id);
          if (idea) onPreviewIdea(idea);
        }}
        onSelect={(item) => {
          const idea = ideasById.get(item.id);
          if (idea) onSelectIdea(idea);
        }}
        onTogglePin={onToggleIdeaPin}
      />
    </div>
  );
}

export function ArtifactsView({
  activeMode,
  canEdit,
  artifacts,
  selectedArtifactTitle,
  onSelectArtifact,
  onShare,
}: {
  activeMode: WorkspaceMode;
  canEdit: boolean;
  artifacts: Artifact[];
  selectedArtifactTitle?: string;
  onSelectArtifact: (artifact: Artifact) => void;
  onShare: () => void;
}) {
  const columns = useMemo<ColumnDef<Artifact>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Artifact",
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              {artifactIcon(row.original.type)}
            </span>
            <span className="min-w-0">
              <strong className="block truncate">{row.original.title}</strong>
              <em className="block text-xs not-italic text-muted-foreground">
                {row.original.clientStatus === "saving"
                  ? "Saving..."
                  : row.original.clientStatus === "pinning"
                    ? "Updating pin..."
                    : `v${row.original.version} / ${row.original.summary}`}
              </em>
            </span>
          </div>
        ),
      },
      { accessorKey: "type", header: "Type" },
      { accessorKey: "owner", header: "Owner" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          if (row.original.clientStatus === "saving") return <Badge variant="warning">Saving</Badge>;
          if (row.original.clientStatus === "pinning") return <Badge variant="warning">Pending</Badge>;
          return row.original.status;
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="Artifacts"
        title={`Pin artifacts to ${workspaceModeLabel(activeMode)}`}
        actions={
          canEdit ? (
            <div className="flex shrink-0 items-center gap-2">
              <ArtifactUploader />
              <Button type="button" variant="outline" onClick={onShare}>
                <Share2 />
                Share
              </Button>
            </div>
          ) : null
        }
      />
      <DataTable
        columns={columns}
        data={artifacts}
        selectedId={selectedArtifactTitle}
        getRowId={(artifact) => artifact.title}
        onRowClick={(artifact) => {
          if (artifact.clientStatus) return;
          onSelectArtifact(artifact);
        }}
      />
    </div>
  );
}

export function DecisionView({
  canEdit,
  decisions,
  onDelete,
  onPreview,
  onSelect,
  onStatusChange,
  onTogglePin,
}: {
  canEdit: boolean;
  decisions: Decision[];
  onDelete: (id: string) => void;
  onPreview: (decision: Decision) => void;
  onSelect: (decision: Decision) => void;
  onStatusChange: (id: string, status: Decision["status"]) => void;
  onTogglePin: (id: string) => void;
}) {
  const decisionsById = useMemo(() => new Map(decisions.map((decision) => [decision.id, decision])), [decisions]);
  const items = useMemo<WorkflowLineItem[]>(
    () =>
      decisions.map((decision) => ({
        id: decision.id,
        title: decision.title,
        originalText: decision.originalText,
        meta: `${decision.owner} / ${decision.due}`,
        complete: decision.status === "Completed" ? "success" : undefined,
        pinned: decision.pinned,
        statusControl: (
          <WorkflowStatusSelect
            disabled={!canEdit}
            label={`Decision status for ${decision.title}`}
            options={decisionStatusOptions}
            value={decision.status}
            onChange={(status) => onStatusChange(decision.id, status)}
          />
        ),
      })),
    [canEdit, decisions, onStatusChange],
  );

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="Workflow status"
        title="Open governance actions"
        description={`${decisions.filter((decision) => decision.status !== "Completed").length} decisions need PMO attention`}
      />
      <WorkflowLineList
        canEdit={canEdit}
        emptyLabel="No decisions in this scope."
        items={items}
        onDelete={onDelete}
        onPreview={(item) => {
          const decision = decisionsById.get(item.id);
          if (decision) onPreview(decision);
        }}
        onSelect={(item) => {
          const decision = decisionsById.get(item.id);
          if (decision) onSelect(decision);
        }}
        onTogglePin={onTogglePin}
      />
    </div>
  );
}

export function ApprovalView({
  approvals,
  canEdit,
  onDelete,
  onPreview,
  onSelect,
  onStatusChange,
  onTogglePin,
}: {
  approvals: Approval[];
  canEdit: boolean;
  onDelete: (id: string) => void;
  onPreview: (approval: Approval) => void;
  onSelect: (approval: Approval) => void;
  onStatusChange: (id: string, status: Approval["status"]) => void;
  onTogglePin: (id: string) => void;
}) {
  const approvalsById = useMemo(() => new Map(approvals.map((approval) => [approval.id, approval])), [approvals]);
  const items = useMemo<WorkflowLineItem[]>(
    () =>
      approvals.map((approval) => ({
        id: approval.id,
        title: approval.title,
        originalText: approval.originalText,
        meta: `${approval.owner} / ${approval.due}`,
        complete: approval.status === "Approved" ? "success" : approval.status === "Not Approved" ? "destructive" : undefined,
        pinned: approval.pinned,
        statusControl: (
          <WorkflowStatusSelect
            disabled={!canEdit}
            label={`Approval status for ${approval.title}`}
            options={approvalStatusOptions}
            value={approval.status}
            onChange={(status) => onStatusChange(approval.id, status)}
          />
        ),
      })),
    [approvals, canEdit, onStatusChange],
  );

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="Workflow status"
        title="Approval queue"
        description={`${approvals.filter((approval) => !["Approved", "Not Approved"].includes(approval.status)).length} approvals need attention`}
      />
      <WorkflowLineList
        canEdit={canEdit}
        emptyLabel="No approvals in this scope."
        items={items}
        onDelete={onDelete}
        onPreview={(item) => {
          const approval = approvalsById.get(item.id);
          if (approval) onPreview(approval);
        }}
        onSelect={(item) => {
          const approval = approvalsById.get(item.id);
          if (approval) onSelect(approval);
        }}
        onTogglePin={onTogglePin}
      />
    </div>
  );
}

export function TaskView({
  canEdit,
  syncingTaskId,
  tasks,
  onDelete,
  onPreview,
  onSelect,
  onSyncToAsana,
  onTogglePin,
}: {
  canEdit: boolean;
  syncingTaskId: string | null;
  tasks: Task[];
  onDelete: (id: string) => void;
  onPreview: (task: Task) => void;
  onSelect: (task: Task) => void;
  onSyncToAsana: (id: string) => void;
  onTogglePin: (id: string) => void;
}) {
  const tasksById = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks]);
  const items = useMemo<WorkflowLineItem[]>(
    () =>
      tasks.map((task) => {
        const syncControl = getTaskAsanaSyncControlState({
          asanaTaskGid: task.asanaTaskGid,
          canEdit,
          isSyncing: syncingTaskId === task.id,
        });
        return {
          id: task.id,
          title: task.title,
          originalText: task.originalText,
          meta: `${task.owner} / ${task.source}${task.asanaSyncError ? ` / Sync error: ${task.asanaSyncError}` : ""}`,
          pinned: task.pinned,
          statusControl: syncControl.visible ? (
            <Button type="button" variant="outline" size="sm" disabled={syncControl.disabled} onClick={() => onSyncToAsana(task.id)}>
              {task.asanaTaskGid ? <CheckCircle2 /> : <UploadCloud />}
              {syncControl.label}
            </Button>
          ) : null,
        };
      }),
    [canEdit, onSyncToAsana, syncingTaskId, tasks],
  );

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="Workflow status"
        title="Tasks surfaced from chats"
        description={`${tasks.length} follow-up${tasks.length === 1 ? "" : "s"}`}
      />
      <WorkflowLineList
        canEdit={canEdit}
        emptyLabel="No tasks in this scope."
        items={items}
        onDelete={onDelete}
        onPreview={(item) => {
          const task = tasksById.get(item.id);
          if (task) onPreview(task);
        }}
        onSelect={(item) => {
          const task = tasksById.get(item.id);
          if (task) onSelect(task);
        }}
        onTogglePin={onTogglePin}
      />
    </div>
  );
}

export function RiskView({
  activeProject,
  risks,
  onManage,
  onPreview,
  onSelect,
}: {
  activeProject?: ProjectSummary;
  risks: Risk[];
  onManage: () => void;
  onPreview: (risk: Risk) => void;
  onSelect: (risk: Risk) => void;
}) {
  const risksById = useMemo(() => new Map(risks.map((risk) => [risk.id, risk])), [risks]);
  const criticalCount = risks.filter((risk) => risk.severity === "critical").length;
  const items = useMemo<WorkflowLineItem[]>(
    () =>
      risks.map((risk) => ({
        id: risk.id,
        title: risk.description,
        originalText: risk.mitigationStrategy || risk.description,
        meta: `${risk.severity.toUpperCase()} / ${risk.status}${risk.mitigationStrategy ? " / Mitigation drafted" : ""}`,
        complete: risk.severity === "critical" ? "destructive" : undefined,
        statusControl: <SeverityBadge severity={risk.severity} />,
      })),
    [risks],
  );

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="Risk status"
        title="Scoped operational risks"
        description={activeProject ? `${risks.length} risks tied to ${activeProject.name}` : `${risks.length} workspace-level risks`}
        actions={
          <Button type="button" variant="outline" onClick={onManage}>
            <ShieldAlert />
            Manage Risks
          </Button>
        }
      />
      {criticalCount > 0 ? (
        <div className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {criticalCount} critical risk{criticalCount === 1 ? "" : "s"} in this scope.
        </div>
      ) : null}
      <WorkflowLineList
        canEdit={false}
        emptyLabel="No risks in this scope."
        items={items}
        onDelete={() => undefined}
        onPreview={(item) => {
          const risk = risksById.get(item.id);
          if (risk) onPreview(risk);
        }}
        onSelect={(item) => {
          const risk = risksById.get(item.id);
          if (risk) onSelect(risk);
        }}
      />
    </div>
  );
}

export function workflowPreviewFromIdea(idea: Idea): NonNullable<WorkflowPreviewState> {
  return {
    kind: "Idea",
    title: idea.title,
    originalText: idea.originalText || idea.summary || idea.title,
    meta: `${idea.owner} / ${idea.category} / ${idea.status}`,
  };
}

export function workflowPreviewFromDecision(decision: Decision): NonNullable<WorkflowPreviewState> {
  return {
    kind: "Decision",
    title: decision.title,
    originalText: decision.originalText || decision.title,
    meta: `${decision.owner} / ${decision.status} / ${decision.due}`,
  };
}

export function workflowPreviewFromApproval(approval: Approval): NonNullable<WorkflowPreviewState> {
  return {
    kind: "Approval",
    title: approval.title,
    originalText: approval.originalText || approval.title,
    meta: `${approval.owner} / ${approval.status} / ${approval.due}`,
  };
}

export function workflowPreviewFromTask(task: Task): NonNullable<WorkflowPreviewState> {
  return {
    kind: "Task",
    title: task.title,
    originalText: task.originalText || task.title,
    meta: `${task.owner} / ${task.source}${task.asanaTaskGid ? " / Synced to Asana" : ""}`,
  };
}

export function workflowPreviewFromRisk(risk: Risk): NonNullable<WorkflowPreviewState> {
  return {
    kind: "Risk",
    title: risk.description,
    originalText: risk.mitigationStrategy || risk.description,
    meta: `${risk.severity.toUpperCase()} / ${risk.status}${risk.mitigationStrategy ? " / Mitigation drafted" : ""}`,
  };
}

export function PromptView({
  canEdit,
  onUsePrompt,
  prompts,
}: {
  canEdit: boolean;
  onUsePrompt: (value: string) => void;
  prompts: string[];
}) {
  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="Prompts" title="Scoped prompts" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {prompts.map((prompt) => (
          <button
            className="grid min-h-28 gap-3 rounded-lg border bg-card p-4 text-left text-sm leading-6 hover:bg-accent/35"
            key={prompt}
            type="button"
            onClick={() => onUsePrompt(prompt)}
          >
            <Sparkles className="size-5 text-primary" />
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
