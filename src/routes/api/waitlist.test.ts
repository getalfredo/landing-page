// Red tests for the waitlist API test seam (plan v3):
//   - `handleWaitlistPost(request: Request): Promise<Response>` — the POST
//     handler body, exported standalone so it can be invoked without the
//     route framework.
//   - `createRateLimiter(opts)` — a factory returning the raw sliding-window
//     check function `(ip: string) => { allowed: boolean; retryAfter?: number }`,
//     NOT the `createMiddleware` wrapper (not directly invokable in tests).
//
// `DATABASE_URL` is set to `:memory:` before the route module (and the
// `src/db/index.ts` singleton it imports) is loaded, so every test run gets
// a fresh in-memory sqlite connection. Because that singleton is
// module-cached across the whole file, `beforeEach` resets the schema with
// `DROP TABLE IF EXISTS` + a bare `CREATE TABLE` (an `IF NOT EXISTS`-only
// create would leak rows across tests and corrupt queue-position math).
//
// The 429 HTTP wrapper (the `createMiddleware` glue that assembles the 429 +
// Retry-After response) is NOT covered here — that's a manual check. These
// tests exercise the raw rate-limiter check function's over-limit verdict
// directly (A12/A13/A14).
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.DATABASE_URL = ":memory:";

const { handleWaitlistPost, createRateLimiter, getClientIp } = await import(
	"#/routes/api/waitlist.ts"
);
const { db } = await import("#/db/index.ts");

function post(
	body: unknown,
	opts: { ip?: string; rawBody?: string } = {},
): Request {
	return new Request("http://localhost/api/waitlist", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			...(opts.ip ? { "x-forwarded-for": opts.ip } : {}),
		},
		body: opts.rawBody ?? JSON.stringify(body),
	});
}

function rowCount(): number {
	const row = db.$client
		.prepare("SELECT COUNT(*) as n FROM waitlist")
		.get() as { n: number };
	return row.n;
}

function emailRow(
	email: string,
): { source: string; consent_text: string } | undefined {
	return db.$client
		.prepare("SELECT source, consent_text FROM waitlist WHERE email = ?")
		.get(email) as { source: string; consent_text: string } | undefined;
}

beforeEach(() => {
	db.$client.exec("DROP TABLE IF EXISTS waitlist");
	db.$client.exec(`
    CREATE TABLE waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at INTEGER DEFAULT (unixepoch()),
      consent_text TEXT NOT NULL,
      source TEXT NOT NULL
    )
  `);
});

describe("POST /api/waitlist — insert + queue position (A1)", () => {
	it("stores a new row and returns 201 with a queue position", async () => {
		const res = await handleWaitlistPost(
			post({
				email: "new@example.com",
				consentText: "One email when Alfredo is ready. Nothing else.",
				source: "hero",
			}),
		);

		expect(res.status).toBe(201);
		const body = await res.json();
		expect(body).toHaveProperty("queuePosition");
		expect(typeof body.queuePosition).toBe("number");
		expect(rowCount()).toBe(1);
	});
});

describe("POST /api/waitlist — lowercasing + consent + source (A2, A3, A4)", () => {
	it("lowercases mixed-case emails before storing (A2)", async () => {
		await handleWaitlistPost(
			post({
				email: "Foo@Bar.com",
				consentText: "One email when Alfredo is ready. Nothing else.",
				source: "hero",
			}),
		);

		expect(emailRow("foo@bar.com")).toBeDefined();
	});

	it("stores the exact consent text shown at submit time (A3)", async () => {
		const consentText = "One email when Alfredo is ready. Nothing else.";
		await handleWaitlistPost(
			post({ email: "consent@example.com", consentText, source: "hero" }),
		);

		expect(emailRow("consent@example.com")?.consent_text).toBe(consentText);
	});

	it("distinguishes hero vs. final-cta source per row (A4)", async () => {
		await handleWaitlistPost(
			post({
				email: "hero-visitor@example.com",
				consentText: "One email when Alfredo is ready. Nothing else.",
				source: "hero",
			}),
		);
		await handleWaitlistPost(
			post({
				email: "cta-visitor@example.com",
				consentText: "One email when Alfredo is ready. Nothing else.",
				source: "final-cta",
			}),
		);

		expect(emailRow("hero-visitor@example.com")?.source).toBe("hero");
		expect(emailRow("cta-visitor@example.com")?.source).toBe("final-cta");
	});
});

describe("POST /api/waitlist — duplicate idempotency (A5, A6)", () => {
	it("returns the same queue position and does not add a row for an exact-duplicate submission (A5)", async () => {
		const payload = {
			email: "dup@example.com",
			consentText: "One email when Alfredo is ready. Nothing else.",
			source: "hero",
		};

		const first = await handleWaitlistPost(post(payload));
		const firstBody = await first.json();

		const second = await handleWaitlistPost(post(payload));
		const secondBody = await second.json();

		expect(second.status).toBe(201);
		expect(secondBody.queuePosition).toBe(firstBody.queuePosition);
		expect(rowCount()).toBe(1);
	});

	it("treats different-case duplicates as the same email (A6)", async () => {
		const first = await handleWaitlistPost(
			post({
				email: "foo@bar.com",
				consentText: "One email when Alfredo is ready. Nothing else.",
				source: "hero",
			}),
		);
		const firstBody = await first.json();

		const second = await handleWaitlistPost(
			post({
				email: "FOO@BAR.com",
				consentText: "One email when Alfredo is ready. Nothing else.",
				source: "hero",
			}),
		);
		const secondBody = await second.json();

		expect(secondBody.queuePosition).toBe(firstBody.queuePosition);
		expect(rowCount()).toBe(1);
	});
});

describe("POST /api/waitlist — honeypot short-circuit (A7, A8)", () => {
	it("returns a fake 201 and writes nothing when the honeypot field is populated (A7)", async () => {
		const res = await handleWaitlistPost(
			post({
				email: "bot@example.com",
				consentText: "One email when Alfredo is ready. Nothing else.",
				source: "hero",
				company: "not-empty",
			}),
		);

		expect(res.status).toBe(201);
		expect(rowCount()).toBe(0);
	});

	it("writes nothing when the honeypot is populated even with an otherwise-valid email (A8)", async () => {
		const res = await handleWaitlistPost(
			post({
				email: "valid-but-bot@example.com",
				consentText: "One email when Alfredo is ready. Nothing else.",
				source: "hero",
				company: "still not empty",
			}),
		);

		expect(res.status).toBe(201);
		expect(rowCount()).toBe(0);
		expect(emailRow("valid-but-bot@example.com")).toBeUndefined();
	});
});

describe("POST /api/waitlist — validation (A9, A10, A11)", () => {
	it.each([
		["no @ sign", "not-an-email"],
		["empty string", ""],
		["whitespace only", "   "],
	])("rejects a syntactically invalid email (%s) with 400 and no insert (A9)", async (_label, email) => {
		const res = await handleWaitlistPost(
			post({
				email,
				consentText: "One email when Alfredo is ready. Nothing else.",
				source: "hero",
			}),
		);

		expect(res.status).toBe(400);
		expect(rowCount()).toBe(0);
	});

	it("rejects a request with no email field at all with 400 and no insert (A10)", async () => {
		const res = await handleWaitlistPost(
			post({
				consentText: "One email when Alfredo is ready. Nothing else.",
				source: "hero",
			}),
		);

		expect(res.status).toBe(400);
		expect(rowCount()).toBe(0);
	});

	it("fails malformed JSON with a 4xx, not a 500/crash (A11)", async () => {
		const res = await handleWaitlistPost(
			post(undefined, { rawBody: "{not valid json" }),
		);

		expect(res.status).toBeGreaterThanOrEqual(400);
		expect(res.status).toBeLessThan(500);
	});
});

describe("POST /api/waitlist — max-length validation (A16, A17)", () => {
	it("rejects an oversized email with 400 and no insert (A16)", async () => {
		const email = `${"a".repeat(250)}@example.com`; // > 254 chars
		const res = await handleWaitlistPost(
			post({
				email,
				consentText: "One email when Alfredo is ready. Nothing else.",
				source: "hero",
			}),
		);

		expect(res.status).toBe(400);
		expect(rowCount()).toBe(0);
	});

	it("rejects oversized consentText/source with 400 and no insert (A17)", async () => {
		const res = await handleWaitlistPost(
			post({
				email: "oversized@example.com",
				consentText: "x".repeat(2001),
				source: "hero",
			}),
		);

		expect(res.status).toBe(400);
		expect(rowCount()).toBe(0);
	});

	it("rejects an oversized source with 400 and no insert (A19)", async () => {
		const res = await handleWaitlistPost(
			post({
				email: "oversized-source@example.com",
				consentText: "One email when Alfredo is ready. Nothing else.",
				source: "x".repeat(201),
			}),
		);

		expect(res.status).toBe(400);
		expect(rowCount()).toBe(0);
	});
});

describe("createRateLimiter — raw check function (A12, A13, A14)", () => {
	it("flags requests over the configured threshold within the window as not allowed, with a retryAfter (A12)", () => {
		const check = createRateLimiter({ limit: 3, windowMs: 10_000 });
		const ip = "203.0.113.10";

		let lastResult = check(ip);
		for (let i = 0; i < 3; i++) {
			lastResult = check(ip);
		}

		expect(lastResult.allowed).toBe(false);
		expect(lastResult.retryAfter).toBeGreaterThan(0);
	});

	it("allows all requests from one IP while below the threshold (A13)", () => {
		const check = createRateLimiter({ limit: 3, windowMs: 10_000 });
		const ip = "203.0.113.11";

		const results = [check(ip), check(ip)];

		for (const result of results) {
			expect(result.allowed).toBe(true);
		}
	});

	it("does not let one IP at its limit affect a different IP (A14)", () => {
		const check = createRateLimiter({ limit: 2, windowMs: 10_000 });
		const limitedIp = "203.0.113.12";
		const otherIp = "203.0.113.13";

		check(limitedIp);
		check(limitedIp);
		const limitedResult = check(limitedIp);
		const otherResult = check(otherIp);

		expect(limitedResult.allowed).toBe(false);
		expect(otherResult.allowed).toBe(true);
	});
});

describe("createRateLimiter — periodic sweep pruning (A20)", () => {
	// After 100 allowed calls the limiter prunes stale/empty entries from its
	// internal map (see waitlist.ts:45-56). This drives the counter past that
	// threshold with a batch of fresh IPs — while the initial IP's single hit
	// has already aged out of the window — and asserts the sweep left
	// verdicts intact: a brand-new IP is still allowed, and the aged-out IP
	// is still allowed (its stale timestamp doesn't wrongly count against it,
	// whether or not the sweep actually deleted it).
	it("prunes stale entries during the sweep without corrupting verdicts", () => {
		vi.useFakeTimers();
		try {
			const check = createRateLimiter({ limit: 1, windowMs: 50 });
			const agedOutIp = "203.0.113.50";

			expect(check(agedOutIp).allowed).toBe(true);

			vi.advanceTimersByTime(60); // past the window

			// 99 fresh, distinct IPs: combined with the call above this is the
			// 100th allowed call, which triggers the sweep on this last one.
			for (let i = 0; i < 99; i++) {
				expect(check(`203.0.113.${100 + i}`).allowed).toBe(true);
			}

			const freshResult = check("203.0.113.250");
			expect(freshResult.allowed).toBe(true);

			const recoveredResult = check(agedOutIp);
			expect(recoveredResult.allowed).toBe(true);
		} finally {
			vi.useRealTimers();
		}
	});
});

describe("getClientIp contract — rightmost x-forwarded-for keying (A18)", () => {
	// With a single trusted proxy (Traefik/Coolify) appending its own
	// address, the rightmost x-forwarded-for entry is the real client IP —
	// the leftmost is attacker-controlled and must not be used as the
	// rate-limit key.
	function requestWithXff(xff?: string): Request {
		return new Request("http://localhost/api/waitlist", {
			method: "POST",
			headers: xff ? { "x-forwarded-for": xff } : {},
		});
	}

	it("extracts the rightmost entry as the trustworthy client IP", () => {
		const trustedProxyIp = "203.0.113.99";
		const spoofedLeftmostVariants = [
			`203.0.113.1, ${trustedProxyIp}`,
			`198.51.100.2, ${trustedProxyIp}`,
			`10.0.0.3, ${trustedProxyIp}`,
		];

		const seenKeys = spoofedLeftmostVariants.map((xff) =>
			getClientIp(requestWithXff(xff)),
		);

		expect(new Set(seenKeys).size).toBe(1);
		expect(seenKeys[0]).toBe(trustedProxyIp);
	});

	it('returns "unknown" when the header is missing', () => {
		expect(getClientIp(requestWithXff(undefined))).toBe("unknown");
	});

	it("trims whitespace and handles a trailing comma", () => {
		expect(getClientIp(requestWithXff("203.0.113.1, 203.0.113.99, "))).toBe(
			"unknown",
		);
	});
});

describe("POST /api/waitlist — queue position ordering (A15)", () => {
	it("returns strictly increasing queue positions matching insertion order for distinct emails", async () => {
		const consentText = "One email when Alfredo is ready. Nothing else.";

		const first = await handleWaitlistPost(
			post({ email: "alpha@example.com", consentText, source: "hero" }),
		);
		const second = await handleWaitlistPost(
			post({ email: "beta@example.com", consentText, source: "hero" }),
		);
		const third = await handleWaitlistPost(
			post({ email: "gamma@example.com", consentText, source: "hero" }),
		);

		const [firstBody, secondBody, thirdBody] = await Promise.all([
			first.json(),
			second.json(),
			third.json(),
		]);

		expect(secondBody.queuePosition).toBeGreaterThan(firstBody.queuePosition);
		expect(thirdBody.queuePosition).toBeGreaterThan(secondBody.queuePosition);
	});
});
