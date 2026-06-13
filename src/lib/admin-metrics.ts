import { createServerFn } from "@tanstack/react-start";

export const getAdminMetrics = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminMetricsForAdmin } = await import("@/lib/admin-metrics.server");
  return getAdminMetricsForAdmin();
});

export const getAdminMetricCards = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminMetricCardsForAdmin } = await import("@/lib/admin-metrics.server");
  return getAdminMetricCardsForAdmin();
});

export const getAdminMetricCard = createServerFn({ method: "GET" })
  .validator((data: { metricId: string }) => data)
  .handler(async ({ data }) => {
    const { getAdminMetricCardForAdmin } = await import("@/lib/admin-metrics.server");
    return getAdminMetricCardForAdmin(data.metricId);
  });

export const getAdminProviderUsage = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminProviderUsageForAdmin } = await import("@/lib/admin-metrics.server");
  return getAdminProviderUsageForAdmin();
});

export const getAdminAppHealth = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminAppHealthForAdmin } = await import("@/lib/admin-metrics.server");
  return getAdminAppHealthForAdmin();
});

export const getAdminRecentUsage = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminRecentUsageForAdmin } = await import("@/lib/admin-metrics.server");
  return getAdminRecentUsageForAdmin();
});
