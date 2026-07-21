import { join } from "node:path";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import * as schema from "./schema.ts";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

// Boot-time schema migration (wayfinder #24). The runtime image ships no
// drizzle-kit, so the committed SQL migrations in drizzle/ are applied here with
// the better-sqlite3 migrator on module load: idempotent, tracked in
// __drizzle_migrations, cheap on every boot. Without this a fresh
// /data/alfredo.db boots empty and the first signup 500s with
// `no such table: waitlist` (and /api/live degrades to a null count).
//
// Skipped for the in-memory test DB (:memory:), whose suite owns its schema.
// The folder resolves from cwd — repo root in dev/test, /app in the container
// where the Dockerfile copies drizzle/ alongside .output.
if (process.env.DATABASE_URL && process.env.DATABASE_URL !== ":memory:") {
	try {
		migrate(db, { migrationsFolder: join(process.cwd(), "drizzle") });
	} catch (err) {
		// A migration fault must not take the whole page down: /api/live already
		// degrades to a null count, and the live smoke-test guards the waitlist.
		console.error("[db] boot migration failed:", err);
	}
}
