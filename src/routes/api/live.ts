// Read-only telemetry for the footer LIVE meter (wayfinder #50): the VPS's
// own host uptime from /proc/uptime (survives deploys; process uptime as the
// non-Linux fallback) and the real waitlist row count. No PII, no params,
// nothing worth caching. Serves in production — the meter's honesty depends
// on it being genuinely live.
//
// DATABASE_URL gotcha (wayfinder #24/#70): db resolves DATABASE_URL with no
// fallback and no bundled .env, so a fresh deploy that hasn't set it will
// throw in waitlistCount(); the try/catch degrades to a null count (the
// meter shows its stub) rather than 500-ing the endpoint.
import { readFileSync } from "node:fs";
import { createFileRoute } from "@tanstack/react-router";
import { count } from "drizzle-orm";
import { db } from "#/db/index.ts";
import { waitlist } from "#/db/schema.ts";

function hostUptimeSeconds(): number | null {
	try {
		const raw = readFileSync("/proc/uptime", "utf8");
		const s = Number.parseFloat(raw.split(" ")[0] ?? "");
		if (Number.isFinite(s)) return Math.floor(s);
	} catch {
		// non-Linux dev machine: fall through to process uptime
	}
	const p = Math.floor(process.uptime());
	return Number.isFinite(p) ? p : null;
}

function waitlistCount(): number | null {
	try {
		return db.select({ n: count() }).from(waitlist).get()?.n ?? null;
	} catch {
		return null;
	}
}

export const Route = createFileRoute("/api/live")({
	server: {
		handlers: {
			GET: () =>
				Response.json({
					uptimeSeconds: hostUptimeSeconds(),
					waitlistCount: waitlistCount(),
				}),
		},
	},
});
