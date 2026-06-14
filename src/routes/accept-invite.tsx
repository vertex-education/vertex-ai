import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { VertexAIBrand } from "@/components/VertexAIBrand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { acceptInvite, getInvitePreview } from "@/lib/auth-workflow";

export const Route = createFileRoute("/accept-invite")({
  head: () => ({
    meta: [{ title: "Accept invite | Vertex AI Command Center" }],
  }),
  component: AcceptInvitePage,
});

type InvitePreview = {
  email: string;
  name: string;
  role: string;
  expiresAt: string;
};

function AcceptInvitePage() {
  const [token, setToken] = useState("");
  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [verificationLink, setVerificationLink] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token") ?? "";
    setToken(urlToken);
    if (!urlToken) {
      setMessage("Invite token is missing.");
      return;
    }

    getInvitePreview({ data: { token: urlToken } })
      .then((result) => {
        setPreview(result);
        setName(result.name);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Invite link is invalid."));
  }, []);

  async function handleAccept(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setVerificationLink("");
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setIsPending(true);
    try {
      const result = await acceptInvite({ data: { token, name, password } });
      setMessage(result.message);
      if (result.verificationLink) setVerificationLink(result.verificationLink);
      setIsComplete(true);
      setPreview(null);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not accept invite.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <VertexAIBrand className="mb-3" logoClassName="h-10 w-fit" aiClassName="text-[1.75rem]" />
          <CardTitle>{isComplete ? "Check your email" : "Create your account"}</CardTitle>
          <CardDescription>
            {isComplete ? "Your account was created. Verify your email address before signing in." : "Set your password, then verify your email before signing in."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {!isComplete && preview ? (
            <div className="rounded-lg border bg-background p-3 text-sm">
              <strong className="block">{preview.email}</strong>
              <span className="text-muted-foreground">
                Role: {preview.role} / Expires: {preview.expiresAt}
              </span>
            </div>
          ) : null}

          {!isComplete ? (
            <form className="space-y-4" onSubmit={handleAccept}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" autoComplete="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" autoComplete="new-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
              </div>
              <Button className="w-full" type="submit" disabled={isPending || !preview}>
                Create account
              </Button>
            </form>
          ) : null}

          {message ? <p className="rounded-md border bg-background p-3 text-sm text-muted-foreground">{message}</p> : null}
          {verificationLink ? (
            <a className="block break-all rounded-md border bg-background p-3 text-sm font-medium text-primary" href={verificationLink}>
              {verificationLink}
            </a>
          ) : null}
          {isComplete ? (
            <a className="block text-sm font-medium text-primary" href="/sign-in">
              Return to sign in
            </a>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
