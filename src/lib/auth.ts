import { env } from "cloudflare:workers";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

type EmailAddress = {
  email: string;
  name?: string;
};

type EmailMessage = {
  to: string | EmailAddress | Array<string | EmailAddress>;
  from: string | EmailAddress;
  subject: string;
  html?: string;
  text?: string;
};

type SendEmailBinding = {
  send(message: EmailMessage): Promise<{ messageId: string }>;
};

type AuthEnv = Env & {
  BETTER_AUTH_SECRET?: string;
  EMAIL?: SendEmailBinding;
};

const internalSignupHeader = "x-ai-command-center-invite-flow";
const localDevSecret = "ai-command-center-local-dev-secret-change-before-production";
const sender = { email: "noreply@rcormier.dev", name: "AI Command Center" };
const localDevTrustedOrigins = Array.from({ length: 11 }, (_value, index) => {
  const port = 3000 + index;
  return [`http://localhost:${port}`, `http://127.0.0.1:${port}`];
}).flat();

function getRuntimeEnv() {
  return env as AuthEnv;
}

export function getAuthSecret() {
  return getRuntimeEnv().BETTER_AUTH_SECRET ?? localDevSecret;
}

export function getInternalSignupSecret() {
  return getAuthSecret();
}

export function getAuth(request?: Request) {
  const runtimeEnv = getRuntimeEnv();
  const origin = request ? new URL(request.url).origin : undefined;

  return betterAuth({
    database: runtimeEnv.DB,
    secret: getAuthSecret(),
    baseURL: origin,
    trustedOrigins: origin ? Array.from(new Set([origin, ...localDevTrustedOrigins])) : localDevTrustedOrigins,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      autoSignIn: false,
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendAuthEmail({
          actionUrl: url,
          to: user.email,
          subject: "Verify your AI Command Center email",
          text: `Verify your email address to finish creating your AI Command Center account: ${url}`,
          html: `<p>Verify your email address to finish creating your AI Command Center account.</p><p><a href="${url}">Verify email</a></p>`,
        });
      },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== "/sign-up/email") return;

        const flowSecret = ctx.headers?.get(internalSignupHeader) ?? ctx.request?.headers.get(internalSignupHeader);
        if (flowSecret !== getInternalSignupSecret()) {
          throw new APIError("FORBIDDEN", {
            message: "Accounts can only be created through an administrator invite.",
          });
        }
      }),
    },
    plugins: [
      admin({
        defaultRole: "user",
        adminRoles: ["admin"],
      }),
    ],
  });
}

export async function sendAuthEmail({
  actionUrl,
  html,
  subject,
  text,
  to,
}: {
  actionUrl?: string;
  html?: string;
  subject: string;
  text: string;
  to: string;
}) {
  const email = getRuntimeEnv().EMAIL;
  if (!email) {
    console.info(`[auth-email-disabled] ${subject} -> ${to}: ${text}`);
    await recordAuthEmailEvent({ actionUrl, reason: "Cloudflare email binding EMAIL is not configured.", sent: false, subject, to });
    return { sent: false, reason: "Cloudflare email binding EMAIL is not configured.", actionUrl };
  }

  try {
    const result = await email.send({
      to,
      from: sender,
      subject,
      text,
      html,
    });
    await recordAuthEmailEvent({ actionUrl, sent: true, subject, to });
    return { sent: true, messageId: result.messageId };
  } catch (error) {
    console.error("Cloudflare email send failed", error);
    const reason = error instanceof Error ? error.message : "Cloudflare email send failed.";
    await recordAuthEmailEvent({ actionUrl, reason, sent: false, subject, to });
    return {
      sent: false,
      reason,
      actionUrl,
    };
  }
}

async function recordAuthEmailEvent({
  actionUrl,
  reason,
  sent,
  subject,
  to,
}: {
  actionUrl?: string;
  reason?: string;
  sent: boolean;
  subject: string;
  to: string;
}) {
  const runtimeEnv = getRuntimeEnv();
  if (!runtimeEnv.DB) return;

  try {
    await runtimeEnv.DB.prepare(
      "INSERT INTO auth_email_events (id, recipient, subject, action_url, sent, failure_reason, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(`email-${crypto.randomUUID()}`, to.toLowerCase(), subject, actionUrl ?? null, sent ? 1 : 0, reason ?? null, Date.now())
      .run();
  } catch (error) {
    console.error("Failed to record auth email event", error);
  }
}
