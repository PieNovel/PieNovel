import { getRequestContext } from "@cloudflare/next-on-pages";

export function getCloudflareEnv(): CloudflareEnv {
  return getRequestContext().env as CloudflareEnv;
}

export function getKvCache(): KVNamespace {
  return getCloudflareEnv().KV_CACHE;
}

export function getD1Database(): D1Database {
  return getCloudflareEnv().DB;
}
