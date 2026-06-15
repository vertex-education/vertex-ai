import { createFileRoute } from "@tanstack/react-router";
import { handleWorkspaceEvents, normalizeMode, parseLastEventId, sseEncode } from "@/routes/sse/workspace-events";

export { normalizeMode, parseLastEventId, sseEncode };

export const Route = createFileRoute("/api/events")({
  server: {
    handlers: {
      GET: handleWorkspaceEvents,
    },
  },
});
