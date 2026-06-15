import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSessionSnapshot } from "@/lib/auth-workflow";
import { PMOCommandCenter } from "@/features/command-center/command-center";
import { CommandCenterPageSkeleton } from "@/features/command-center/skeletons";

export const Route = createFileRoute("/")({
  loader: async () => {
    const session = await getSessionSnapshot();
    if (!session) throw redirect({ to: "/sign-in" });
    return { session };
  },
  pendingComponent: CommandCenterPageSkeleton,
  head: () => ({
    meta: [{ title: "VertexAI" }],
  }),
  component: CommandCenterRoute,
});

function CommandCenterRoute() {
  const { session } = Route.useLoaderData();
  return <PMOCommandCenter session={session} />;
}
