import type { WorkspaceScope } from "@/lib/pmo-data";

export type LightweightRisk = {
  id: string;
  projectId: string | null;
  severity: "low" | "medium" | "high" | "critical";
  mitigationStrategy: string;
};

export const riskSeverityRank: Record<LightweightRisk["severity"], number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function getScopedRisks<TRisk extends { projectId: string | null }>(risks: TRisk[], projectId: string | null) {
  return risks.filter((risk) => risk.projectId === projectId);
}

export function getRiskStats(risks: LightweightRisk[]) {
  return {
    total: risks.length,
    critical: risks.filter((risk) => risk.severity === "critical").length,
    mitigated: risks.filter((risk) => risk.mitigationStrategy.trim().length > 0).length,
  };
}

export function riskManagementHref(scope: WorkspaceScope, projectId: string | null | undefined) {
  if (!projectId) return null;
  return `/workspace/ws-${scope}/project/${encodeURIComponent(projectId)}/risks`;
}
