import { createFileRoute, redirect } from "@tanstack/react-router";
import { ShieldCheck, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionSnapshot } from "@/lib/auth-workflow";

export const Route = createFileRoute("/profile/")({
  loader: async () => {
    const session = await getSessionSnapshot();
    if (!session) throw redirect({ to: "/sign-in" });
    return { session };
  },
  head: () => ({
    meta: [{ title: "User profile | AI Command Center" }],
  }),
  component: UserProfilePage,
});

function UserProfilePage() {
  const { session } = Route.useLoaderData();
  const displayName = session.user.name || session.user.email;

  return (
    <main className="min-h-screen bg-muted/30 p-4">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="outline" onClick={() => (window.location.href = "/")}>
            Back
          </Button>
          <img className="h-9 w-fit" src="/vertex-horizontal.svg" alt="Vertex Education" />
        </div>

        <Card>
          <CardHeader>
            <div className="mb-2 grid size-12 place-items-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
              {getInitials(displayName)}
            </div>
            <CardTitle>User profile</CardTitle>
            <CardDescription>Manage your account details, password, and future personal settings.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-3 rounded-md border bg-background p-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Name</p>
                <p className="font-medium">{displayName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{session.user.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Role</p>
                <Badge variant="secondary">{session.user.role}</Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Email verification</p>
                <Badge variant={session.user.emailVerified ? "default" : "secondary"}>
                  {session.user.emailVerified ? "Verified" : "Not verified"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full justify-start" type="button" variant="outline" onClick={() => (window.location.href = "/profile/password")}>
                Reset password
              </Button>
              {session.user.role === "admin" ? (
                <Button className="w-full justify-start" type="button" variant="outline" onClick={() => (window.location.href = "/admin/users")}>
                  <ShieldCheck className="size-4" />
                  Admin
                </Button>
              ) : null}
              <Button className="w-full justify-start" type="button" variant="outline" disabled>
                <UserRound className="size-4" />
                More settings coming soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function getInitials(value: string) {
  return value
    .split(/\s+|@/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
