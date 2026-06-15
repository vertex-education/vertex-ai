/// <reference path="../worker-configuration.d.ts" />

import serverEntry from "@tanstack/react-start/server-entry";
import { Hono } from "hono";
import { handleAsanaWebhookRequest } from "./lib/asana-webhook";
import { runDailyProjectBriefings } from "./lib/daily-briefings";
import {
  processMicrosoftGraphWebhookJob,
  type MicrosoftGraphWebhookEnv,
  type MicrosoftGraphWebhookJob,
} from "./lib/microsoft-graph-webhooks";

export { ChatSyncRealtimeDurableObject } from "./lib/chat-sync";

const webhookApp = new Hono<{ Bindings: Env }>();
webhookApp.post("/api/webhooks/asana", (c) => handleAsanaWebhookRequest(c.req.raw, c.env));

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.pathname === "/api/webhooks/asana") {
      return webhookApp.fetch(request, env, ctx);
    }

    const requestOptions = {
      context: {
        cloudflare: { env, ctx },
      },
    } as unknown as Parameters<typeof serverEntry.fetch>[1];

    return serverEntry.fetch(request, requestOptions);
  },

  async queue(batch: MessageBatch<MicrosoftGraphWebhookJob>, env: MicrosoftGraphWebhookEnv) {
    for (const message of batch.messages) {
      try {
        const job = message.body;
        if (!isMicrosoftGraphWebhookJob(job)) throw new Error("Unexpected job body in Graph webhook queue.");
        await processMicrosoftGraphWebhookJob(env, job);
        message.ack();
      } catch (error) {
        console.error("Microsoft Graph webhook queue job failed.", {
          error: error instanceof Error ? error.message : "Unknown queue failure",
        });
        message.retry();
      }
    }
  },

  scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(runDailyProjectBriefings(env, controller.scheduledTime));
  },
};

function isMicrosoftGraphWebhookJob(job: unknown): job is MicrosoftGraphWebhookJob {
  if (!job || typeof job !== "object" || !("kind" in job)) return false;
  return job.kind === "microsoft-graph-change-notification";
}
