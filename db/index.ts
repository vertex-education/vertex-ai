import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(env.DB, { schema });
}

export function getArtifactsBucket() {
  const runtimeEnv = env as typeof env & { ARTIFACTS_BUCKET?: R2Bucket };

  if (!runtimeEnv.ARTIFACTS_BUCKET) {
    throw new Error(
      "Cloudflare R2 binding `ARTIFACTS_BUCKET` is unavailable. Set the `r2` field in .openai/hosting.json to `ARTIFACTS_BUCKET` before using artifact storage."
    );
  }

  return runtimeEnv.ARTIFACTS_BUCKET;
}
