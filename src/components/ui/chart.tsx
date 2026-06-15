"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
  };
};

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-grid_line]:stroke-border/70 [&_.recharts-tooltip-cursor]:fill-muted [&_.recharts-xAxis_.recharts-cartesian-axis-tick_text]:translate-y-0.5",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, itemConfig]) => itemConfig.color);
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => `  --color-${key}: ${itemConfig.color};`).join("\n")}
}
`,
      }}
    />
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

export function ChartTooltipContent({
  active,
  payload,
  className,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: Array<{
    color?: string;
    dataKey?: string | number;
    name?: string | number;
    payload?: Record<string, unknown>;
    value?: unknown;
  }>;
  className?: string;
  label?: React.ReactNode;
  formatter?: (value: unknown, name: string | number | undefined, item: unknown, index: number, payload: unknown[]) => React.ReactNode;
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div className={cn("grid min-w-36 gap-2 rounded-md border bg-popover p-3 text-popover-foreground shadow-md", className)}>
      {label ? <div className="font-medium">{label}</div> : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${item.dataKey ?? item.name ?? ""}`;
          const itemConfig = config[key];
          const payloadFill = typeof item.payload?.fill === "string" ? item.payload.fill : undefined;
          const indicatorColor = item.color ?? payloadFill ?? itemConfig?.color;
          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: indicatorColor }} />
                <span className="text-muted-foreground">{itemConfig?.label ?? item.name ?? key}</span>
              </div>
              <span className="font-mono font-medium tabular-nums">
                {formatter
                  ? formatter(item.value, item.name, item, index, payload)
                  : typeof item.value === "number"
                    ? item.value.toLocaleString()
                    : String(item.value ?? "")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
