import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getCloudflareEnv(): CloudflareEnv {
  return getCloudflareContext().env as CloudflareEnv;
}

export function getKvCache(): KVNamespace {
  return getCloudflareEnv().KV_CACHE;
}

export function getD1Database(): D1Database {
  return getCloudflareEnv().DB;
}
