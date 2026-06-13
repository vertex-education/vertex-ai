export const defaultAiGatewayId = "default";

type AiGatewayMetadata = Record<string, string | number | boolean | null | bigint>;

type AiGatewayRunOptions = {
  gatewayId?: string | null;
  metadata?: AiGatewayMetadata;
  signal?: AbortSignal;
  skipCache?: boolean;
  cacheTtl?: number;
};

function gatewayIdFromEnv() {
  const value = typeof process !== "undefined" ? process.env.CLOUDFLARE_AI_GATEWAY_ID : undefined;
  return value?.trim() || defaultAiGatewayId;
}

function compactMetadata(metadata: AiGatewayMetadata | undefined) {
  if (!metadata) return undefined;
  const entries = Object.entries(metadata)
    .filter(([, value]) => value !== undefined)
    .slice(0, 5);
  return entries.length ? Object.fromEntries(entries) as AiGatewayMetadata : undefined;
}

export function getAiGatewayLogId(ai: Ai | null | undefined) {
  return ai?.aiGatewayLogId ?? null;
}

export function runWorkersAiWithGateway(
  ai: Ai,
  model: string,
  inputs: Record<string, unknown>,
  options: AiGatewayRunOptions = {},
) {
  return ai.run(model, inputs, {
    signal: options.signal,
    gateway: {
      id: options.gatewayId?.trim() || gatewayIdFromEnv(),
      skipCache: options.skipCache ?? true,
      cacheTtl: options.cacheTtl,
      metadata: compactMetadata({
        app: "ai-command-center",
        feature: "workers-ai",
        ...options.metadata,
      }),
    },
  });
}
