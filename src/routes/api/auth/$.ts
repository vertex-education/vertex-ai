import { createFileRoute } from "@tanstack/react-router";
import { getAuth } from "@/lib/auth";

function handleAuthRequest({ request }: { request: Request }) {
  return getAuth(request).handler(request);
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: handleAuthRequest,
      POST: handleAuthRequest,
    },
  },
});
