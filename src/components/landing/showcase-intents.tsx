// The four intent composite panels for the showcase (issue-19, promoted
// from the approved variant T guts). Taxonomy locked at four groups:
//   HEALTH   = Uptime Kuma + Sentry         (is anything down or broken?)
//   ACTIVITY = Umami + Better-Auth + GitHub (is anything moving?)
//   MONEY    = Creem                        (is anything earning?)
//   MAIL     = Postmark                     (is anything sending?)
// Captions verbatim from issue-19; providers stay named inside the views
// (issue-14 truth-list); HQ language per issue-17. Every panel keeps the
// SIMULATED FEED honesty etch and moves on its own (#20).
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "#/components/landing/use-prefers-reduced-motion";

export type IntentKey = "health" | "activity" | "money" | "mail";

export const INTENT_ITEMS: {
	key: IntentKey;
	name: string;
	etch: string;
	services: string;
	line: string;
}[] = [
	{
		key: "health",
		name: "Health",
		etch: "HEALTH",
		services: "UPTIME KUMA + SENTRY",
		line: "Uptime and errors from every project in one view. Know something broke before the first user does.",
	},
	{
		key: "activity",
		name: "Activity",
		etch: "ACTIVITY",
		services: "UMAMI + BETTER-AUTH + GITHUB",
		line: "Traffic, signups and stars across every project, the moment they move.",
	},
	{
		key: "money",
		name: "Money",
		etch: "MONEY",
		services: "CREEM",
		line: "Every project's revenue in one place. A failed charge pings you before the customer does.",
	},
	{
		key: "mail",
		name: "Mail",
		etch: "MAIL",
		services: "POSTMARK",
		line: "Every mail your projects send, and the bounce that needs a second look.",
	},
];

export const ROTATE_MS = 5000;

/* ---------- Health: uptime ticks + error rows, one view ---------- */

const TICK_ROWS = [
	{ name: "invoicer", wobble: -1, incident: -1 },
	{ name: "shiplog", wobble: 9, incident: 31 },
	{ name: "pantry-api", wobble: 23, incident: -1 },
];
const TICK_COUNT = 42;
const TICK_IDS = Array.from({ length: TICK_COUNT }, (_, i) => `t${i}`);

export function HealthPanel() {
	const reduced = usePrefersReducedMotion();
	const [shift, setShift] = useState(0);
	useEffect(() => {
		if (reduced) return;
		const id = setInterval(() => setShift((s) => s + 1), 800);
		return () => clearInterval(id);
	}, [reduced]);

	return (
		<div className="scp-win">
			<div className="scp-win-head">
				<span className="scp-etch">HEALTH · UPTIME KUMA + SENTRY</span>
				<span className="scp-tag-amber">1 NEEDS ACTION</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">ALL PROJECTS</span>
					<span className="scp-stat-num scp-green">12/12 up</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">NEW ISSUES</span>
					<span className="scp-stat-num scp-amber">1 today</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">LAST INCIDENT</span>
					<span className="scp-stat-num">
						6d ago <small>shiplog</small>
					</span>
				</div>
				{/* #69 record cell (variant a): the all-time best beside the now. */}
				<div className="scp-stat rec-cell">
					<span className="scp-etch rec-etch-green">★ BEST STREAK</span>
					<span className="scp-stat-num scp-green">41 DAYS ALL UP</span>
				</div>
			</div>
			<div className="scp-win-body sci-body">
				<div className="sci-sect">
					<span className="scp-etch">UPTIME · UPTIME KUMA</span>
					<span className="scp-etch">CHECKED EVERY 30S</span>
				</div>
				{TICK_ROWS.map((row) => (
					<div className="sci-tickrow" key={row.name}>
						<span className="scp-mono sci-tickname">{row.name}</span>
						<span className="sci-ticks" aria-hidden="true">
							{TICK_IDS.map((id, i) => {
								const pos = (i + shift) % 53;
								const red = row.incident >= 0 && pos === row.incident;
								const amber =
									!red && row.wobble >= 0 && pos % 19 === row.wobble % 19;
								return (
									<span
										key={id}
										className={`sci-tick${red ? " sci-tick-red" : ""}${amber ? " sci-tick-amber" : ""}`}
									/>
								);
							})}
						</span>
					</div>
				))}
				<div className="sci-sect">
					<span className="scp-etch">ERRORS · SENTRY</span>
					<span className="scp-etch">ACROSS 4 PROJECTS</span>
				</div>
				<div className="scp-row scp-row-bad">
					<span className="scp-row-main">
						<span className="scp-mono scp-amber">NEW</span>
						<span className="scp-mono">TypeError: cart is undefined</span>
						<span className="scp-etch">shiplog</span>
					</span>
					<span className="scp-row-side scp-etch">
						12 EVENTS · FIRST 3M AGO
					</span>
				</div>
				<div className="scp-row">
					<span className="scp-row-main">
						<span className="scp-mono scp-green">OK</span>
						<span className="scp-mono sci-dim">429 RateLimitExceeded</span>
						<span className="scp-etch">pantry-api</span>
					</span>
					<span className="scp-row-side scp-etch">RESOLVED 2D AGO</span>
				</div>
			</div>
			<div className="scp-win-foot">
				<span className="scp-mono">
					<span className="scp-amber">shiplog</span> · TypeError in checkout.ts
					· <span className="scp-amber">needs action</span>
				</span>
				<span className="scp-etch scp-sim">SIMULATED FEED</span>
			</div>
		</div>
	);
}

/* ---------- Activity: traffic chart + signups + stars ---------- */

const ACT_BARS = Array.from({ length: 24 }, (_, i) => ({
	id: `ab${i}`,
	base: i < 19 ? 12 + ((i * 31) % 17) : 34 + (i - 19) * 8,
	spike: i >= 19,
}));

export function ActivityPanel() {
	const reduced = usePrefersReducedMotion();
	const [wob, setWob] = useState(0);
	useEffect(() => {
		if (reduced) return;
		const id = setInterval(() => setWob((w) => w + 1), 700);
		return () => clearInterval(id);
	}, [reduced]);
	const total = 1204 + ((wob * 23) % 67);
	const sessions = 38 + ((wob * 7) % 5);

	return (
		<div className="scp-win">
			<div className="scp-win-head">
				<span className="scp-etch">
					ACTIVITY · UMAMI + BETTER-AUTH + GITHUB
				</span>
				<span className="scp-tag-amber">SPIKE DETECTED</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">TRAFFIC</span>
					<span className="scp-stat-num">
						{total.toLocaleString("en-US")} <small>req/min</small>
					</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">SIGNUPS THIS WEEK</span>
					<span className="scp-stat-num scp-green">142 ▲ +38%</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">STARS THIS WEEK</span>
					<span className="scp-stat-num">★ +61</span>
				</div>
				{/* #69 record cell (variant a): the all-time best beside the now. */}
				<div className="scp-stat rec-cell">
					<span className="scp-etch rec-etch-green">★ BEST DAY</span>
					<span className="scp-stat-num scp-green">3,420 VISITS</span>
				</div>
			</div>
			<div className="scp-win-body sci-body">
				<div className="sci-sect">
					<span className="scp-etch">TRAFFIC · UMAMI</span>
					<span className="scp-etch">
						TOP <span className="scp-green">pantry-api</span> 62%
					</span>
				</div>
				<div className="scp-chart scp-chart-short" aria-hidden="true">
					{ACT_BARS.map((b, i) => (
						<span
							key={b.id}
							className={`scp-bar${b.spike ? " scp-bar-spike" : ""}`}
							style={{
								height: `${(b.base + (((i * 13 + wob * 7) % 9) - 4)) * 1.9}px`,
							}}
						/>
					))}
				</div>
				<div className="scp-row">
					<span className="scp-row-main">
						<span className="scp-etch">AUTH · BETTER-AUTH</span>
						<span className="scp-mono">{sessions} sessions live</span>
					</span>
					<span className="scp-row-side scp-mono scp-green">
						▲ signups rising
					</span>
				</div>
				<div className="scp-row">
					<span className="scp-row-main">
						<span className="scp-etch">GITHUB</span>
						<span className="scp-mono">invoicer ★ 1,204 ▲ 61</span>
					</span>
					<span className="scp-row-side scp-mono scp-amber">2 PRS WAITING</span>
				</div>
			</div>
			<div className="scp-win-foot">
				<span className="scp-mono">
					<span className="scp-green">pantry-api</span> ·{" "}
					<span className="scp-amber">3× baseline</span> · invoicer spike tagged{" "}
					<span className="scp-green">launch day</span>
				</span>
				<span className="scp-etch scp-sim">SIMULATED FEED</span>
			</div>
		</div>
	);
}

/* ---------- Money: revenue strip + payment events (Creem) ---------- */

const PAYMENTS = [
	{
		id: "p1",
		bad: true,
		amount: "€49",
		who: "marco@silva.dev",
		project: "invoicer",
		note: "CARD DECLINED",
	},
	{
		id: "p2",
		bad: false,
		amount: "€19",
		who: "anna@keller.io",
		project: "shiplog",
		note: "VISA ··4242",
	},
	{
		id: "p3",
		bad: false,
		amount: "€99",
		who: "team@parcelbay.co",
		project: "pantry-api",
		note: "VISA ··8812",
	},
	{
		id: "p4",
		bad: false,
		amount: "€19",
		who: "priya@nair.io",
		project: "shiplog",
		note: "MC ··3005",
	},
];

export function MoneyPanel() {
	const reduced = usePrefersReducedMotion();
	const [sec, setSec] = useState(14);
	useEffect(() => {
		if (reduced) return;
		const id = setInterval(() => setSec((s) => s + 1), 1000);
		return () => clearInterval(id);
	}, [reduced]);

	return (
		<div className="scp-win">
			<div className="scp-win-head">
				<span className="scp-etch">MONEY · CREEM</span>
				<span className="scp-tag-amber">1 FAILED TODAY</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">THIS MONTH</span>
					<span className="scp-stat-num">€3,204</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">VS LAST MONTH</span>
					<span className="scp-stat-num scp-green">▲ +12%</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">TOP EARNER</span>
					<span className="scp-stat-num">
						invoicer <small>€1,880</small>
					</span>
				</div>
				{/* #69 record cell (variant a): the all-time best beside the now. */}
				<div className="scp-stat rec-cell">
					<span className="scp-etch rec-etch-green">★ MILESTONE</span>
					<span className="scp-stat-num scp-green">FIRST € · MAR 3</span>
				</div>
			</div>
			<div className="scp-win-body sci-body sci-rows">
				{PAYMENTS.map((p) => (
					<div className={`scp-row${p.bad ? " scp-row-bad" : ""}`} key={p.id}>
						<span className="scp-row-main">
							<span
								className={`scp-badge ${p.bad ? "scp-badge-bad" : "scp-badge-ok"}`}
							>
								{p.bad ? "Failed" : "Paid"}
							</span>
							<span className="scp-pay-amount">{p.amount}</span>
							<span className="scp-pay-who">{p.who}</span>
							<span className="scp-etch">{p.project}</span>
						</span>
						<span className="scp-row-side scp-etch">{p.note}</span>
					</div>
				))}
			</div>
			<div className="scp-win-foot">
				<span className="scp-mono scp-amber">
					PINGED YOU 00:{String(sec).padStart(2, "0")} AGO
				</span>
				<span className="scp-etch scp-sim">SIMULATED FEED</span>
			</div>
		</div>
	);
}

/* ---------- Mail: transactional sends per #14 (Postmark) ---------- */

const SENDS = [
	{
		id: "s1",
		what: "Welcome email",
		to: "anna@keller.io",
		project: "invoicer",
		ok: true,
		when: "2m",
	},
	{
		id: "s2",
		what: "Magic link",
		to: "priya@nair.io",
		project: "pantry-api",
		ok: true,
		when: "9m",
	},
	{
		id: "s3",
		what: "Invoice #1042",
		to: "marco@silva.dev",
		project: "invoicer",
		ok: false,
		when: "26m",
	},
	{
		id: "s4",
		what: "Password reset",
		to: "team@parcelbay.co",
		project: "shiplog",
		ok: true,
		when: "41m",
	},
];

export function MailIntentPanel() {
	return (
		<div className="scp-win">
			<div className="scp-win-head">
				<span className="scp-etch">MAIL · POSTMARK</span>
				<span className="scp-tag-amber">1 BOUNCED</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">SENT TODAY</span>
					<span className="scp-stat-num">412</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">DELIVERED</span>
					<span className="scp-stat-num scp-green">99.2%</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">BOUNCED</span>
					<span className="scp-stat-num scp-amber">1</span>
				</div>
				{/* #69 record cell (variant a): the all-time best beside the now. */}
				<div className="scp-stat rec-cell">
					<span className="scp-etch rec-etch-green">★ BEST DAY</span>
					<span className="scp-stat-num scp-green">100% · 512 SENT</span>
				</div>
			</div>
			<div className="scp-win-body sci-body sci-rows">
				{SENDS.map((s) => (
					<div className={`scp-row${s.ok ? "" : " scp-row-bad"}`} key={s.id}>
						<span className="scp-row-main">
							<span
								className={`scp-badge ${s.ok ? "scp-badge-ok" : "scp-badge-bad"}`}
							>
								{s.ok ? "Delivered" : "Bounced"}
							</span>
							<span className="scp-mono">
								{s.what} → {s.to}
							</span>
							<span className="scp-etch">{s.project}</span>
						</span>
						<span className="scp-row-side scp-etch">{s.when} AGO</span>
					</div>
				))}
			</div>
			<div className="scp-win-foot">
				<span className="scp-mono">
					<span className="scp-amber">marco@silva.dev</span> · hard bounce ·{" "}
					<span className="scp-amber">needs a second look</span>
				</span>
				<span className="scp-etch scp-sim">SIMULATED FEED</span>
			</div>
		</div>
	);
}

export const INTENT_PANELS: Record<IntentKey, () => React.ReactNode> = {
	health: HealthPanel,
	activity: ActivityPanel,
	money: MoneyPanel,
	mail: MailIntentPanel,
};
