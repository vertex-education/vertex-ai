import { createFileRoute, redirect } from "@tanstack/react-router";
import { DocsPage } from "@/features/docs/docs-page";
import { getSession } from "@/lib/auth-workflow";

export const Route = createFileRoute("/docs")({
  loader: async () => {
    const session = await getSession();
    if (!session) throw redirect({ to: "/sign-in" });
    return { session };
  },
  head: () => ({
    meta: [{ title: "Docs | VertexAI" }],
  }),
  component: DocsRoute,
});

function DocsRoute() {
  const { session } = Route.useLoaderData();
  return <DocsPage session={session} />;
}
