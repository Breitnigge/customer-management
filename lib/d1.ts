import { getRequestContext } from "@cloudflare/next-on-pages";

export function getDB(): D1Database {
  const { env } = getRequestContext() as unknown as { env: { DB: D1Database } };
  return env.DB;
}
