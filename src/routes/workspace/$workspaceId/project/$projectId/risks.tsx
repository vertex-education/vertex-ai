import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDownUp, ShieldCheck, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSessionSnapshot } from "@/lib/auth-workflow";
import { runServerMutation, mutationFailureMessage } from "@/lib/optimistic-mutations";
import { generateRiskMitigation, listProjectRisks, type RiskRecord, type RiskSeverity } from "@/lib/risks";

export const Route = createFileRoute("/workspace/$workspaceId/project/$projectId/risks")({
  loader: async ({ params }) => {
    const session = await getSessionSnapshot();
    if (!session) throw redirect({ to: "/sign-in" });
    const dashboard = await listProjectRisks({ data: params });
    return { dashboard };
  },
  head: () => ({
    meta: [{ title: "Risks | VertexAI" }],
  }),
  component: ProjectRisksPage,
});

const severityOrder: Record<RiskSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function ProjectRisksPage() {
  const { workspaceId, projectId } = Route.useParams();
  const { dashboard } = Route.useLoaderData();
  const queryClient = useQueryClient();
  const [severityFilter, setSeverityFilter] = useState<RiskSeverity | "all">("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "severity", desc: true }]);
  const [toastMessage, setToastMessage] = useState("");

  const queryKey = ["risks", workspaceId, projectId] as const;
  const risksQuery = useQuery({
    queryKey,
    queryFn: () => listProjectRisks({ data: { workspaceId, projectId } }),
    initialData: dashboard,
  });

  const generateMutation = useMutation({
    mutationFn: (riskId: string) =>
      runServerMutation("Risk mitigation generation", () => generateRiskMitigation({ data: { workspaceId, projectId, riskId } })),
    onMutate: async (riskId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<typeof dashboard>(queryKey);
      queryClient.setQueryData<typeof dashboard>(queryKey, (current) =>
        current
          ? {
              ...current,
              risks: current.risks.map((risk) =>
                risk.id === riskId
                  ? {
                      ...risk,
                      mitigationStrategy: risk.mitigationStrategy || "Generating mitigation strategy...",
                      clientStatus: "pending",
                    }
                  : risk,
              ),
            }
          : current,
      );
      setToastMessage("Generating mitigation strategy...");
      return { previousData };
    },
    onSuccess: (updatedRisk) => {
      queryClient.setQueryData<typeof dashboard>(queryKey, (current) =>
        current
          ? {
              ...current,
              risks: current.risks.map((risk) => (risk.id === updatedRisk.id ? updatedRisk : risk)),
            }
          : current,
      );
      setToastMessage("Mitigation strategy generated and saved.");
    },
    onError: (error, _riskId, context) => {
      if (context?.previousData) queryClient.setQueryData(queryKey, context.previousData);
      setToastMessage(
        error instanceof Error ? error.message : mutationFailureMessage("Risk mitigation generation", "server mutation", error),
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const dashboardData = risksQuery.data ?? dashboard;
  const statuses = useMemo(
    () => Array.from(new Set(dashboardData.risks.map((risk) => risk.status))).sort((a, b) => a.localeCompare(b)),
    [dashboardData.risks],
  );

  const filteredRisks = useMemo(
    () =>
      dashboardData.risks.filter((risk) => {
        const severityMatches = severityFilter === "all" || risk.severity === severityFilter;
        const statusMatches = statusFilter === "all" || risk.status === statusFilter;
        return severityMatches && statusMatches;
      }),
    [dashboardData.risks, severityFilter, statusFilter],
  );

  const columns = useMemo<ColumnDef<RiskRecord>[]>(
    () => [
      {
        accessorKey: "severity",
        header: ({ column }) => <SortButton label="Severity" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
        cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
        sortingFn: (a, b) => severityOrder[a.original.severity] - severityOrder[b.original.severity],
      },
      {
        accessorKey: "status",
        header: ({ column }) => <SortButton label="Status" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => <SortButton label="Risk" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
        cell: ({ row }) => <div className="max-w-[32rem] text-sm leading-6">{row.original.description}</div>,
      },
      {
        accessorKey: "mitigationStrategy",
        header: "Mitigation strategy",
        cell: ({ row }) => (
          <div className="prose prose-sm max-w-[38rem] text-foreground prose-headings:mb-2 prose-headings:mt-0 prose-p:my-1 prose-ul:my-1">
            {row.original.clientStatus === "pending" ? (
              <div className="space-y-2">
                <Badge variant="warning">Pending</Badge>
                <p className="text-sm text-muted-foreground">Generating mitigation strategy...</p>
              </div>
            ) : row.original.mitigationStrategy ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{row.original.mitigationStrategy}</ReactMarkdown>
            ) : (
              <span className="text-muted-foreground">No mitigation generated yet.</span>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => generateMutation.mutate(row.original.id)}
            disabled={!dashboardData.canGenerateMitigations || generateMutation.isPending || row.original.clientStatus === "pending"}
            title="Generate mitigation"
          >
            <Sparkles />
            {row.original.clientStatus === "pending" || (generateMutation.isPending && generateMutation.variables === row.original.id)
              ? "Generating"
              : "Generate Mitigation"}
          </Button>
        ),
      },
    ],
    [dashboardData.canGenerateMitigations, generateMutation],
  );

  const table = useReactTable({
    data: filteredRisks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 border-b pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="size-4" />
              {dashboardData.workspace.name} / {dashboardData.project.name}
            </div>
            <h1 className="text-2xl font-semibold tracking-normal">Risk Management</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Operational vulnerabilities explicitly scoped to this workspace and project.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              label="Severity"
              value={severityFilter}
              onChange={(value) => setSeverityFilter(value as RiskSeverity | "all")}
              options={["all", "critical", "high", "medium", "low"]}
            />
            <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={["all", ...statuses]} />
          </div>
        </header>

        {toastMessage ? <div className="rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground">{toastMessage}</div> : null}

        <Card>
          <CardHeader className="gap-1">
            <CardTitle>Scoped Risks</CardTitle>
            <CardDescription>
              {filteredRisks.length} of {dashboardData.risks.length} risks shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                      No risks match the active filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function SortButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-muted-foreground"
    >
      {label}
      <ArrowDownUp className="size-3" />
    </button>
  );
}

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="font-medium">{label}</span>
      <select
        className="h-9 rounded-md border bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? "All" : titleCase(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function SeverityBadge({ severity }: { severity: RiskSeverity }) {
  const variant = severity === "critical" ? "destructive" : severity === "high" ? "warning" : severity === "medium" ? "info" : "success";
  return (
    <Badge variant={variant} className="capitalize">
      {severity}
    </Badge>
  );
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
