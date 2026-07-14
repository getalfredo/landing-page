import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const waitlist = sqliteTable("waitlist", {
	id: integer({ mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	email: text().notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(unixepoch())`,
	),
	consentText: text("consent_text").notNull(),
	source: text().notNull(),
});
