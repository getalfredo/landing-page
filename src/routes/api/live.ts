// PROTOTYPE — throwaway (wayfinder #50, LIVE etch). Read-only telemetry
// for the LIVE-etch variants: host uptime from /proc/uptime (the VPS's own
// clock, survives deploys; process uptime as the non-Linux fallback) and
// the real waitlist row count. No PII, no params, nothing cacheable worth
// caching. 404s in production builds — the fold-in decides what ships.
// Remove with src/components/prototype/live-pass.tsx.
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
			GET: () => {
				if (import.meta.env.PROD) {
					return new Response("Not found", { status: 404 });
				}
				return Response.json({
					uptimeSeconds: hostUptimeSeconds(),
					waitlistCount: waitlistCount(),
				});
			},
		},
	},
});
