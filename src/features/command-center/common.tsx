import { useState, type ComponentType, type ReactNode } from "react";
import { type ColumnDef, type SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, BarChart3, ClipboardList, Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { downloadRows } from "@/lib/chat-export";
import { cn } from "@/lib/utils";
import { type IdeaStatus, type Risk, statusMeta } from "@/lib/pmo-data";

export function DataTable<TData extends object>({
  columns,
  data,
  getRowId,
  onRowClick,
  selectedId,
}: {
  columns: ColumnDef<TData>[];
  data: TData[];
  getRowId: (row: TData) => string;
  onRowClick?: (row: TData) => void;
  selectedId?: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <button className="inline-flex items-center gap-1" type="button" onClick={header.column.getToggleSortingHandler()}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <ArrowUpDown className="size-3" />
                    </button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className={cn(onRowClick && "cursor-pointer", selectedId === getRowId(row.original) && "bg-accent/35")}
                data-state={selectedId === getRowId(row.original) ? "selected" : undefined}
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center text-muted-foreground" colSpan={columns.length}>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function StatusBadge({ status }: { status: IdeaStatus }) {
  const meta = statusMeta[status];
  return <Badge variant={meta.tone}>{meta.label}</Badge>;
}

export function SeverityBadge({ severity }: { severity: Risk["severity"] }) {
  const variant = severity === "critical" ? "destructive" : severity === "high" ? "warning" : severity === "medium" ? "info" : "success";
  return (
    <Badge variant={variant} className="capitalize">
      {severity}
    </Badge>
  );
}

export function ScoreCell({ value }: { value: number }) {
  return (
    <div className="min-w-20 space-y-1">
      <div className="text-xs font-medium">{value}</div>
      <Progress value={value} />
    </div>
  );
}

export function ProgressMetric({ label, tooltip, value }: { label: string; tooltip?: string; value: number }) {
  return (
    <div className="space-y-1" title={tooltip}>
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{label}</span>
        <strong className="text-foreground">{value}</strong>
      </div>
      <Progress value={value} />
    </div>
  );
}

export function MetricCard({
  detail,
  icon: Icon,
  label,
  value,
}: {
  detail: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <Icon className="size-4 text-primary" />
          <ChartExportButtons rows={[{ metric: label, value, detail }]} title={label} />
        </div>
        <span className="block text-xs text-muted-foreground">{label}</span>
        <strong className="block text-xl">{value}</strong>
        <em className="block truncate text-xs not-italic text-muted-foreground">{detail}</em>
      </CardContent>
    </Card>
  );
}

export function ChartExportButtons({ rows, title }: { rows: Array<Record<string, string | number | boolean | null>>; title: string }) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7"
        aria-label={`Export ${title} chart as CSV`}
        title="Export CSV"
        onClick={() => downloadRows("csv", title, rows)}
      >
        <Download className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7"
        aria-label={`Export ${title} chart as XLSX`}
        title="Export XLSX"
        onClick={() => downloadRows("xlsx", title, rows)}
      >
        <ClipboardList className="size-3.5" />
      </Button>
    </div>
  );
}

export function SidebarAction({
  action,
  detail,
  icon: Icon,
  label,
  onClick,
  title,
}: {
  action: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <Card className="mb-3">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <Icon className="mt-0.5 size-5 text-primary" />
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase text-muted-foreground">{label}</span>
            <strong className="line-clamp-2 text-sm">{title}</strong>
            <em className="mt-1 block text-xs not-italic text-muted-foreground">{detail}</em>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onClick}>
          {action}
        </Button>
      </CardContent>
    </Card>
  );
}

export function FieldBlock({ children, error, label }: { children: ReactNode; error?: string; label: string }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <em className="text-xs not-italic text-destructive">{error}</em> : null}
    </div>
  );
}

export function artifactIcon(type: string) {
  if (type === "sheet" || type === "XLSX") return <ClipboardList className="size-4" />;
  if (type === "ppt" || type === "PPTX") return <BarChart3 className="size-4" />;
  return <FileText className="size-4" />;
}
