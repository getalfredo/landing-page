// Waitlist API (wayfinder #4): honeypot fake-201, per-IP sliding-window
// rate limit, idempotent lowercased-email insert, queue position from row
// order. In-memory limiter is fine for the single-instance deploy.
// `handleWaitlistPost` and `createRateLimiter` are exported as the test
// seam (src/routes/api/waitlist.test.ts) — tests invoke them without the
// route framework.
//
// No-JS path (wayfinder #60): the form also submits natively as
// application/x-www-form-urlencoded. Those requests get 303 redirects back
// to the page (`?wl=ok|invalid|rate|error&src=<source>#wl-<source>`) instead
// of JSON; the form component restores the matching state from the params.
// Duplicates still redirect with the identical ok payload (issue-4: no
// list-membership leakage).
import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { count, eq, sql } from "drizzle-orm";
import { db } from "#/db/index.ts";
import { waitlist } from "#/db/schema.ts";

export interface RateLimitVerdict {
	allowed: boolean;
	retryAfter?: number;
}

export function createRateLimiter(
	opts: { limit?: number; windowMs?: number } = {},
): (ip: string) => RateLimitVerdict {
	const limit = opts.limit ?? 3;
	const windowMs = opts.windowMs ?? 10_000;
	const hits = new Map<string, number[]>();
	let callsSinceSweep = 0;

	return (ip) => {
		const now = Date.now();
		const windowStart = now - windowMs;
		const recent = (hits.get(ip) ?? []).filter((t) => t > windowStart);

		if (recent.length >= limit) {
			hits.set(ip, recent);
			const oldest = recent[0] ?? now;
			return {
				allowed: false,
				retryAfter: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
			};
		}

		recent.push(now);
		hits.set(ip, recent);

		// Prune stale/empty entries periodically so a stream of one-shot
		// distinct IPs doesn't grow this map unbounded (no TTL otherwise).
		callsSinceSweep++;
		if (callsSinceSweep >= 100) {
			callsSinceSweep = 0;
			for (const [key, timestamps] of hits) {
				const stillRecent = timestamps.filter((t) => t > windowStart);
				if (stillRecent.length === 0) {
					hits.delete(key);
				} else if (stillRecent.length !== timestamps.length) {
					hits.set(key, stillRecent);
				}
			}
		}

		return { allowed: true };
	};
}

export function getClientIp(request: Request): string {
	// Nitro/h3 sets x-forwarded-for behind the proxy; no direct socket access
	// from a plain `Request` in a TanStack Start route handler. Single known
	// proxy (Traefik/Coolify) in front of us, so the trustworthy client IP is
	// the *rightmost* entry it appends — the leftmost is attacker-supplied
	// and rotating it per request would otherwise defeat the rate limiter.
	const forwarded = request.headers.get("x-forwarded-for");
	if (!forwarded) return "unknown";
	const parts = forwarded.split(",");
	return parts[parts.length - 1]?.trim() || "unknown";
}

export function isFormPost(request: Request): boolean {
	const contentType = request.headers.get("content-type") ?? "";
	return (
		contentType.includes("application/x-www-form-urlencoded") ||
		contentType.includes("multipart/form-data")
	);
}

// The form's `action` carries `?source=` so redirects can target the right
// form instance (`#wl-<source>`) even when the body can't be parsed (or, in
// the middleware, before it is read). Sanitized so a tampered value can't
// inject arbitrary fragments into the Location header.
function redirectSource(request: Request): string {
	const source = new URL(request.url).searchParams.get("source") ?? "";
	return /^[a-z0-9-]{1,32}$/.test(source) ? source : "hero";
}

function formRedirect(
	request: Request,
	params: Record<string, string>,
): Response {
	const src = redirectSource(request);
	const qs = new URLSearchParams({ ...params, src });
	return new Response(null, {
		status: 303,
		headers: { Location: `/?${qs.toString()}#wl-${src}` },
	});
}

const checkRateLimit = createRateLimiter();

const rateLimitMiddleware = createMiddleware({ type: "request" }).server(
	async ({ request, next }) => {
		const verdict = checkRateLimit(getClientIp(request));

		if (!verdict.allowed) {
			if (isFormPost(request)) {
				return formRedirect(request, {
					wl: "rate",
					retry: String(verdict.retryAfter ?? 1),
				});
			}
			return Response.json(
				{ error: "rate_limited" },
				{
					status: 429,
					headers: { "Retry-After": String(verdict.retryAfter ?? 1) },
				},
			);
		}

		return next();
	},
);

export async function handleWaitlistPost(request: Request): Promise<Response> {
	const isForm = isFormPost(request);
	let body: {
		email?: unknown;
		consentText?: unknown;
		source?: unknown;
		company?: unknown; // honeypot field, must stay empty
	};
	try {
		if (isForm) {
			const fields = await request.formData();
			body = {
				email: fields.get("email") ?? undefined,
				consentText: fields.get("consentText") ?? undefined,
				source: fields.get("source") ?? undefined,
				company: fields.get("company") || undefined,
			};
		} else {
			body = await request.json();
		}
	} catch {
		return isForm
			? formRedirect(request, { wl: "error" })
			: Response.json({ error: "invalid_body" }, { status: 400 });
	}

	// Honeypot: bots fill every field. Return a normal-looking success
	// without touching the DB so the bot doesn't learn it was caught.
	if (body.company) {
		return isForm
			? formRedirect(request, { wl: "ok", pos: "1" })
			: Response.json({ ok: true, queuePosition: 1 }, { status: 201 });
	}

	const email =
		typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
	if (!email || !email.includes("@") || email.length > 254) {
		return isForm
			? formRedirect(request, { wl: "invalid" })
			: Response.json({ error: "invalid_email" }, { status: 400 });
	}

	const consentText =
		typeof body.consentText === "string" ? body.consentText : "";
	const source = typeof body.source === "string" ? body.source : "";
	if (
		!consentText ||
		!source ||
		consentText.length > 2000 ||
		source.length > 200
	) {
		return isForm
			? formRedirect(request, { wl: "error" })
			: Response.json({ error: "invalid_body" }, { status: 400 });
	}

	// Idempotent insert: ON CONFLICT DO NOTHING, then always look up the row
	// (just-inserted or pre-existing) to compute queue position from a single
	// source of truth.
	db.insert(waitlist)
		.values({ email, consentText, source })
		.onConflictDoNothing({ target: waitlist.email })
		.run();

	const row = db
		.select({ id: waitlist.id })
		.from(waitlist)
		.where(eq(waitlist.email, email))
		.get();

	if (!row) {
		return isForm
			? formRedirect(request, { wl: "error" })
			: Response.json({ error: "insert_failed" }, { status: 500 });
	}

	const ahead = db
		.select({ n: count() })
		.from(waitlist)
		.where(sql`${waitlist.id} < ${row.id}`)
		.get();

	const queuePosition = (ahead?.n ?? 0) + 1;
	return isForm
		? formRedirect(request, { wl: "ok", pos: String(queuePosition) })
		: Response.json({ ok: true, queuePosition }, { status: 201 });
}

export const Route = createFileRoute("/api/waitlist")({
	server: {
		middleware: [rateLimitMiddleware],
		handlers: {
			POST: ({ request }) => handleWaitlistPost(request),
		},
	},
});
