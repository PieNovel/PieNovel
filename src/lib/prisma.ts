import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client/edge";

import { getD1Database } from "@/lib/cloudflare";

export function createPrismaClient(db: D1Database = getD1Database()): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaD1(db),
  });
}
