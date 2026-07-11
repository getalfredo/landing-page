// PROTOTYPE — shared guts for the "Inside the console" showcase (wayfinder
// #13, throwaway). Round 3: every view leads with the cross-project founder
// metric (growth, bottlenecks, issues, action points, spikes) before its
// event rows; providers branded harder (Gmail mark, stripe wordmark, Sentry
// purple, GitHub); GitHub stars/PRs view added; uptime gains red incident
// dots and a live scrolling simulation. Every panel keeps the etched
// SIMULATED FEED microlabel — honesty in-language.
// Round 4 (#20): all seven views share one fixed skeleton — head, stat
// strip, body, foot at pinned heights — so rotation causes no layout shift
// (Mail/Errors/Uptime gain the stat strip #13 spec'd anyway). Every view
// now moves on its own: mail arrives, stars tick up, error events count,
// with the traffic wobble as the reference intensity.
import { useEffect, useRef, useState } from "react";

export type ShowcaseKey =
	| "traffic"
	| "mail"
	| "pay"
	| "errors"
	| "auth"
	| "github"
	| "uptime";

export const SHOWCASE_ITEMS: {
	key: ShowcaseKey;
	name: string;
	etch: string;
	provider: string | null;
	line: string;
}[] = [
	{
		key: "traffic",
		name: "Traffic",
		etch: "TRAFFIC",
		provider: "PostHog",
		line: "All your projects' traffic on one graph — and the spike the moment it starts.",
	},
	{
		key: "mail",
		name: "Email",
		etch: "MAIL",
		provider: "Gmail",
		line: "Support mail from every project, one inbox view.",
	},
	{
		key: "pay",
		name: "Payments",
		etch: "PAYMENTS",
		provider: "Stripe",
		line: "A failed charge pings you before the customer does.",
	},
	{
		key: "errors",
		name: "Errors",
		etch: "ERRORS",
		provider: "Sentry",
		line: "The stack trace is there before the bug report is.",
	},
	{
		key: "auth",
		name: "Auth",
		etch: "AUTH",
		provider: "Better-Auth",
		line: "Signup trends across every project, the moment they move.",
	},
	{
		key: "github",
		name: "GitHub",
		etch: "GITHUB",
		provider: "GitHub",
		line: "Launch-day stars, new issues, PRs waiting — every repo, one glance.",
	},
	{
		key: "uptime",
		name: "Uptime",
		etch: "UPTIME",
		provider: null,
		line: "Know a project is down before its first user does.",
	},
];

/* ---------- Traffic: cross-project insight + the live spike ---------- */

const BASELINE_COUNT = 22;
const SPIKE_COUNT = 6;
const BARS = Array.from({ length: BASELINE_COUNT + SPIKE_COUNT }, (_, i) => ({
	id: `bar-${i}`,
	base:
		i < BASELINE_COUNT ? 14 + ((i * 37) % 21) : 46 + (i - BASELINE_COUNT) * 9,
	spike: i >= BASELINE_COUNT,
}));

export function TrafficPanel() {
	const [wob, setWob] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setWob((w) => w + 1), 700);
		return () => clearInterval(id);
	}, []);
	const reqMin = 412 + ((wob * 17) % 41);
	const total = 1204 + ((wob * 23) % 67);

	return (
		<div className="scp-win">
			<div className="scp-win-head">
				<span className="scp-etch">TRAFFIC · POSTHOG</span>
				<span className="scp-tag-amber">SPIKE DETECTED</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">ALL PROJECTS</span>
					<span className="scp-stat-num">
						{total.toLocaleString("en-US")} <small>req/min</small>
					</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">VS LAST WEEK</span>
					<span className="scp-stat-num scp-green">▲ +18%</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">TOP PROJECT</span>
					<span className="scp-stat-num">
						pantry-api <small>62%</small>
					</span>
				</div>
			</div>
			<div className="scp-win-body">
				<div className="scp-chart" aria-hidden="true">
					{BARS.map((b, i) => (
						<span
							key={b.id}
							className={`scp-bar${b.spike ? " scp-bar-spike" : ""}`}
							style={{
								height: `${(b.base + (((i * 13 + wob * 7) % 9) - 4)) * 1.15}px`,
							}}
						/>
					))}
				</div>
			</div>
			<div className="scp-win-foot">
				<span className="scp-mono">
					<span className="scp-green">pantry-api</span> · {reqMin} req/min ·{" "}
					<span className="scp-amber">3× baseline</span>
				</span>
				<span className="scp-etch scp-sim">SIMULATED FEED</span>
			</div>
		</div>
	);
}

/* ---------- Mail: Gmail-flavored inbox — stars, unread weight ---------- */

function GmailMark() {
	return (
		<svg
			className="scp-brandmark"
			viewBox="0 0 24 18"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M1.6 18h3.2V8.4L0 4.9V16.4C0 17.3.7 18 1.6 18Z" fill="#4285f4" />
			<path d="M19.2 18h3.2c.9 0 1.6-.7 1.6-1.6V4.9l-4.8 3.5Z" fill="#34a853" />
			<path d="M19.2 1.6v6.8L24 4.9V2.4C24 .4 21.7-.7 20.2.5Z" fill="#fbbc04" />
			<path d="M4.8 8.4V1.6L12 7l7.2-5.4v6.8L12 13.8Z" fill="#ea4335" />
			<path
				d="M0 2.4v2.5l4.8 3.5V1.6L3.8.5C2.3-.7 0 .4 0 2.4Z"
				fill="#c5221f"
			/>
		</svg>
	);
}

const MAILS = [
	{
		id: "m1",
		sender: "Anna Keller",
		project: "invoicer",
		subject: "Re: invoice #1042 — thanks!",
		preview: "That fixed it — appreciate the quick turnaround.",
		when: "2m",
		unread: true,
		starred: true,
	},
	{
		id: "m2",
		sender: "Marco Silva",
		project: "shiplog",
		subject: "Can I export my data?",
		preview: "Before I upgrade I want to be sure I can take everything…",
		when: "11m",
		unread: true,
		starred: false,
	},
	{
		id: "m3",
		sender: "Priya N.",
		project: "pantry-api",
		subject: "Rate limit question",
		preview: "We started seeing 429s around noon UTC and wondered…",
		when: "26m",
		unread: true,
		starred: false,
	},
	{
		id: "m4",
		sender: "Stripe",
		project: "invoicer",
		subject: "Your payout is on the way",
		preview: "€312.40 will arrive in 2 business days.",
		when: "1h",
		unread: false,
		starred: false,
	},
];

// #20 live movement: a new support mail slides in every few seconds.
const INCOMING = [
	{
		sender: "Jonas Weber",
		project: "shiplog",
		subject: "Webhook retries?",
		preview: "We miss events when our endpoint is down for a minute…",
	},
	{
		sender: "Lea Fischer",
		project: "invoicer",
		subject: "VAT on annual plans",
		preview: "Does the yearly invoice split VAT per month or…",
	},
	{
		sender: "Tom Aldridge",
		project: "pantry-api",
		subject: "Bulk import stuck at 91%",
		preview: "The job has been sitting there for ten minutes now…",
	},
];

export function MailPanel() {
	const [rows, setRows] = useState(MAILS);
	const arrived = useRef(0);

	useEffect(() => {
		const id = setInterval(() => {
			setRows((prev) => {
				const nxt = INCOMING[arrived.current % INCOMING.length];
				arrived.current += 1;
				return [
					{
						id: `in-${arrived.current}`,
						when: "now",
						unread: true,
						starred: false,
						...nxt,
					},
					...prev,
				].slice(0, 4);
			});
		}, 4200);
		return () => clearInterval(id);
	}, []);

	const unread = rows.filter((m) => m.unread).length;

	return (
		<div className="scp-win">
			<div className="scp-win-head">
				<span className="scp-etch scp-brandrow">
					<GmailMark />
					MAIL · GMAIL
				</span>
				<span className="scp-etch">1 INBOX · ALL PROJECTS</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">UNREAD</span>
					<span className="scp-stat-num">{unread}</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">TODAY</span>
					<span className="scp-stat-num">{9 + arrived.current}</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">OLDEST WAITING</span>
					<span className="scp-stat-num scp-green">26m</span>
				</div>
			</div>
			<div className="scp-win-body scp-rows">
				{rows.map((m) => (
					<div
						className={`scp-mailrow${m.unread ? " scp-mailrow-unread" : ""}`}
						key={m.id}
					>
						<span
							className={`scp-star${m.starred ? " scp-star-on" : ""}`}
							aria-hidden="true"
						>
							{m.starred ? "★" : "☆"}
						</span>
						<div className="scp-mailrow-text">
							<div className="scp-mailrow-top">
								<span className="scp-mail-sender">{m.sender}</span>
								<span className="scp-etch scp-mail-proj">{m.project}</span>
								<span className="scp-mono scp-mail-when">{m.when}</span>
							</div>
							<div className="scp-mailrow-bottom">
								<span className="scp-mail-subject">{m.subject}</span>
								<span className="scp-mail-preview"> — {m.preview}</span>
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="scp-win-foot">
				<span className="scp-etch">{unread} UNREAD · 3 PROJECTS</span>
				<span className="scp-etch scp-sim">SIMULATED FEED</span>
			</div>
		</div>
	);
}

/* ---------- Payments: Stripe-flavored — revenue trend + events ---------- */

const PAYMENTS = [
	{
		id: "p1",
		ok: false,
		amount: "€49.00",
		who: "anna@keller.io",
		method: "VISA ··4242",
		project: "invoicer",
		when: "2m",
	},
	{
		id: "p2",
		ok: true,
		amount: "€12.00",
		who: "marco@silva.dev",
		method: "MC ··8811",
		project: "shiplog",
		when: "18m",
	},
	{
		id: "p3",
		ok: true,
		amount: "€49.00",
		who: "beta@pantry.dev",
		method: "VISA ··0197",
		project: "invoicer",
		when: "1h",
	},
];

export function PayPanel() {
	const [ago, setAgo] = useState(12);
	useEffect(() => {
		const id = setInterval(() => setAgo((s) => s + 1), 1000);
		return () => clearInterval(id);
	}, []);
	const mm = String(Math.floor(ago / 60)).padStart(2, "0");
	const ss = String(ago % 60).padStart(2, "0");

	return (
		<div className="scp-win">
			<div className="scp-win-head">
				<span className="scp-etch scp-brandrow">
					PAYMENTS · <span className="scp-stripe-mark">stripe</span>
				</span>
				<span className="scp-tag-amber">ACTION NEEDED</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">THIS MONTH</span>
					<span className="scp-stat-num">€ 3,204</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">VS LAST MONTH</span>
					<span className="scp-stat-num scp-green">▲ +12%</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">FAILED TODAY</span>
					<span className="scp-stat-num scp-red">1</span>
				</div>
			</div>
			<div className="scp-win-body scp-rows">
				{PAYMENTS.map((p) => (
					<div className={`scp-row${p.ok ? "" : " scp-row-bad"}`} key={p.id}>
						<span
							className={`scp-badge ${p.ok ? "scp-badge-ok" : "scp-badge-bad"}`}
						>
							{p.ok ? "Succeeded" : "Failed"}
						</span>
						<span className="scp-mono scp-pay-amount">{p.amount}</span>
						<span className="scp-pay-who">{p.who}</span>
						<span className="scp-chip">{p.method}</span>
						<span className="scp-etch scp-row-side">{p.project}</span>
						<span className="scp-mono scp-mail-when">{p.when}</span>
					</div>
				))}
			</div>
			<div className="scp-win-foot">
				<span className="scp-etch">
					CARD DECLINED · PINGED YOU{" "}
					<span className="scp-amber-etch">
						{mm}:{ss}
					</span>{" "}
					AGO
				</span>
				<span className="scp-etch scp-sim">SIMULATED FEED</span>
			</div>
		</div>
	);
}

/* ---------- Errors: Sentry-flavored — level, events, users, trend ---------- */

const SPARK_ERR = [3, 5, 4, 8, 12, 9, 14, 11];
const ERRORS = [
	{
		id: "e1",
		level: "error" as const,
		message: "TypeError: Cannot read 'plan' of undefined",
		at: "checkout.ts:142",
		project: "invoicer",
		events: 12,
		users: 7,
		spark: SPARK_ERR,
	},
	{
		id: "e2",
		level: "warning" as const,
		message: "SMTPConnectionError: timeout after 10s",
		at: "mailer.ts:58",
		project: "shiplog",
		events: 2,
		users: 1,
		spark: [1, 0, 2, 1, 0, 1, 0, 1],
	},
	{
		id: "e3",
		level: "resolved" as const,
		message: "ZodError: invalid webhook payload",
		at: "hooks.ts:21",
		project: "pantry-api",
		events: 0,
		users: 0,
		spark: [4, 2, 1, 1, 0, 0, 0, 0],
	},
];

export function ErrorsPanel() {
	// #20 live movement: the open issue keeps collecting events while you watch.
	const [live, setLive] = useState({ events: 12, users: 7 });
	useEffect(() => {
		const id = setInterval(() => {
			setLive((p) => ({
				events: p.events + 1,
				users: Math.random() < 0.3 ? p.users + 1 : p.users,
			}));
		}, 2600);
		return () => clearInterval(id);
	}, []);

	return (
		<div className="scp-win">
			<div className="scp-win-head">
				<span className="scp-etch scp-brandrow">
					ERRORS · <span className="scp-sentry-mark">SENTRY</span>
				</span>
				<span className="scp-tag-amber">NEW ISSUE</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">OPEN</span>
					<span className="scp-stat-num scp-red">2</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">EVENTS TODAY</span>
					<span className="scp-stat-num">{live.events + 14}</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">USERS HIT</span>
					<span className="scp-stat-num">{live.users}</span>
				</div>
			</div>
			<div className="scp-win-body scp-rows">
				{ERRORS.map((e) => (
					<div
						className={`scp-errrow${e.level === "error" ? " scp-row-bad" : ""}${e.level === "resolved" ? " scp-errrow-resolved" : ""}`}
						key={e.id}
					>
						<div className="scp-mailrow-top">
							<span
								className={`scp-led ${
									e.level === "error"
										? "scp-led-red"
										: e.level === "warning"
											? "scp-led-amber-solid"
											: ""
								}`}
								aria-hidden="true"
							/>
							<span className="scp-mono scp-err-msg">{e.message}</span>
							<span className="scp-spark" aria-hidden="true">
								{e.spark.map((h, i) => (
									<span
										key={`${e.id}-s${SPARK_IDS[i]}`}
										style={{ height: `${4 + h}px` }}
									/>
								))}
							</span>
						</div>
						<div className="scp-mailrow-bottom scp-err-meta">
							<span className="scp-mono scp-err-at">at {e.at}</span>
							<span className="scp-etch scp-mail-proj">{e.project}</span>
							<span className="scp-etch">
								{e.level === "resolved"
									? "RESOLVED"
									: e.id === "e1"
										? `${live.events} EVENTS · ${live.users} USERS`
										: `${e.events} EVENTS · ${e.users} USERS`}
							</span>
						</div>
					</div>
				))}
			</div>
			<div className="scp-win-foot">
				<span className="scp-etch">
					2 OPEN · <span className="scp-red">1 NEEDS ACTION</span>
				</span>
				<span className="scp-etch scp-sim">SIMULATED FEED</span>
			</div>
		</div>
	);
}

const SPARK_IDS = [0, 1, 2, 3, 4, 5, 6, 7];

/* ---------- Auth: signup trend front and center ---------- */

const SIGNUP_DAYS = [4, 6, 5, 8, 7, 9, 12, 10, 14, 13, 17, 16, 21, 24].map(
	(v, i) => ({ id: `d${i}`, v }),
);

export function AuthPanel() {
	const [wob, setWob] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setWob((w) => w + 1), 1400);
		return () => clearInterval(id);
	}, []);
	const sessions = 38 + ((wob * 3) % 4);

	return (
		<div className="scp-win">
			<div className="scp-win-head">
				<span className="scp-etch">AUTH · BETTER-AUTH</span>
				<span className="scp-etch">LIVE</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">SIGNUPS THIS WEEK</span>
					<span className="scp-stat-num">142</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">TREND</span>
					<span className="scp-stat-num scp-green">▲ +38%</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">SESSIONS LIVE</span>
					<span className="scp-stat-num scp-green">{sessions}</span>
				</div>
			</div>
			<div className="scp-win-body">
				<div className="scp-chart scp-chart-short" aria-hidden="true">
					{SIGNUP_DAYS.map((d, i) => (
						<span
							key={d.id}
							className="scp-bar"
							style={{
								height: `${d.v * 3.4 + (i === SIGNUP_DAYS.length - 1 ? (wob % 2) * 4 : 0)}px`,
							}}
						/>
					))}
				</div>
			</div>
			<div className="scp-win-foot">
				<span className="scp-etch">
					LAST 14 DAYS · <span className="scp-green">ALL 3 PROJECTS</span> ·
					BEST DAY YESTERDAY
				</span>
				<span className="scp-etch scp-sim">SIMULATED FEED</span>
			</div>
		</div>
	);
}

/* ---------- GitHub: stars, trends, PRs waiting ---------- */

type RepoId = "g1" | "g2" | "g3";
const REPOS: {
	id: RepoId;
	name: string;
	spark: number[];
	note: string | null;
}[] = [
	{
		id: "g1",
		name: "invoicer",
		spark: [2, 3, 2, 4, 3, 9, 14, 11],
		note: "launch day",
	},
	{
		id: "g2",
		name: "shiplog",
		spark: [3, 2, 3, 2, 3, 2, 3, 3],
		note: null,
	},
	{
		id: "g3",
		name: "pantry-api",
		spark: [1, 2, 2, 3, 3, 4, 5, 4],
		note: null,
	},
];

export function GithubPanel() {
	// #20 live movement: launch-day stars keep arriving, weighted to invoicer.
	const [stars, setStars] = useState<Record<RepoId, number>>({
		g1: 1284,
		g2: 512,
		g3: 317,
	});
	const [week, setWeek] = useState<Record<RepoId, number>>({
		g1: 42,
		g2: 7,
		g3: 12,
	});
	useEffect(() => {
		const id = setInterval(() => {
			const roll = Math.random();
			const repo: RepoId = roll < 0.6 ? "g1" : roll < 0.8 ? "g2" : "g3";
			setStars((p) => ({ ...p, [repo]: p[repo] + 1 }));
			setWeek((p) => ({ ...p, [repo]: p[repo] + 1 }));
		}, 2200);
		return () => clearInterval(id);
	}, []);
	const total = stars.g1 + stars.g2 + stars.g3;
	const weekTotal = week.g1 + week.g2 + week.g3;

	return (
		<div className="scp-win">
			<div className="scp-win-head">
				<span className="scp-etch">GITHUB · ALL REPOS</span>
				<span className="scp-tag-amber">2 PRS WAITING</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">STARS TOTAL</span>
					<span className="scp-stat-num">
						★ {total.toLocaleString("en-US")}
					</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">THIS WEEK</span>
					<span className="scp-stat-num scp-green">▲ +{weekTotal}</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">NEW ISSUES</span>
					<span className="scp-stat-num">5</span>
				</div>
			</div>
			<div className="scp-win-body scp-rows">
				{REPOS.map((r) => (
					<div className="scp-row" key={r.id}>
						<span className="scp-uptime-name">{r.name}</span>
						<span className="scp-mono scp-gh-stars">
							★ {stars[r.id].toLocaleString("en-US")}
						</span>
						<span className="scp-spark scp-spark-row" aria-hidden="true">
							{r.spark.map((h, i) => (
								<span
									key={`${r.id}-s${SPARK_IDS[i]}`}
									style={{ height: `${4 + h}px` }}
								/>
							))}
						</span>
						<span className="scp-mono scp-green scp-gh-delta">
							+{week[r.id]}
						</span>
						{r.note ? (
							<span className="scp-etch scp-amber-etch scp-row-side">
								{r.note}
							</span>
						) : (
							<span className="scp-etch scp-row-side" />
						)}
					</div>
				))}
			</div>
			<div className="scp-win-foot">
				<span className="scp-etch">
					<span className="scp-amber-etch">2 PRS AWAITING REVIEW</span> · 5 NEW
					ISSUES THIS WEEK
				</span>
				<span className="scp-etch scp-sim">SIMULATED FEED</span>
			</div>
		</div>
	);
}

/* ---------- Uptime: live scrolling history with real incidents ---------- */

const TICK_COUNT = 28;
type TickState = "ok" | "warn" | "down";
type UptimeRow = {
	id: string;
	name: string;
	pct: string;
	ticks: { id: number; state: TickState }[];
};

function seedTicks(rowIdx: number): { id: number; state: TickState }[] {
	return Array.from({ length: TICK_COUNT }, (_, i) => ({
		id: i,
		state:
			rowIdx === 1 && (i === 9 || i === 10)
				? "down"
				: rowIdx === 1 && i === 19
					? "warn"
					: rowIdx === 2 && i === 4
						? "down"
						: "ok",
	}));
}

const UPTIME_START: UptimeRow[] = [
	{ id: "u1", name: "invoicer", pct: "100%", ticks: seedTicks(0) },
	{ id: "u2", name: "shiplog", pct: "99.91%", ticks: seedTicks(1) },
	{ id: "u3", name: "pantry-api", pct: "99.96%", ticks: seedTicks(2) },
];

export function UptimePanel() {
	const [rows, setRows] = useState(UPTIME_START);
	const [ms, setMs] = useState(184);
	const counter = useRef(TICK_COUNT);

	useEffect(() => {
		const id = setInterval(() => {
			counter.current += 1;
			const n = counter.current;
			setMs(150 + ((n * 13) % 60));
			setRows((prev) =>
				prev.map((row, ri) => {
					// Deterministic pseudo-noise: mostly green, a rare amber
					// wobble, a rarer red incident — different phase per row.
					const roll = (n * 7 + ri * 13) % 53;
					const state: TickState =
						roll === 17 ? "down" : roll === 31 || roll === 44 ? "warn" : "ok";
					return {
						...row,
						ticks: [...row.ticks.slice(1), { id: n + ri * 1000, state }],
					};
				}),
			);
		}, 800);
		return () => clearInterval(id);
	}, []);

	return (
		<div className="scp-win">
			<div className="scp-win-head">
				<span className="scp-etch">UPTIME · LIVE</span>
				<span className="scp-etch">3/3 UP</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">UPTIME 30D</span>
					<span className="scp-stat-num scp-green">99.95%</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">INCIDENTS 30D</span>
					<span className="scp-stat-num">2</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">AVG RESPONSE</span>
					<span className="scp-stat-num">
						{ms} <small>ms</small>
					</span>
				</div>
			</div>
			<div className="scp-win-body scp-rows">
				{rows.map((r) => (
					<div className="scp-row" key={r.id}>
						<span className="scp-led" aria-hidden="true" />
						<span className="scp-uptime-name">{r.name}</span>
						<span className="scp-ticks" aria-hidden="true">
							{r.ticks.map((t) => (
								<span
									className={`scp-tick${t.state === "warn" ? " scp-tick-amber" : ""}${t.state === "down" ? " scp-tick-red" : ""}`}
									key={t.id}
								/>
							))}
						</span>
						<span className="scp-mono scp-row-side scp-green">{r.pct}</span>
					</div>
				))}
			</div>
			<div className="scp-win-foot">
				<span className="scp-etch">
					LAST INCIDENT <span className="scp-red">6D AGO · SHIPLOG</span> ·
					CHECKED EVERY 30S
				</span>
				<span className="scp-etch scp-sim">SIMULATED FEED</span>
			</div>
		</div>
	);
}

export const SHOWCASE_PANELS: Record<ShowcaseKey, () => React.ReactNode> = {
	traffic: TrafficPanel,
	mail: MailPanel,
	pay: PayPanel,
	errors: ErrorsPanel,
	auth: AuthPanel,
	github: GithubPanel,
	uptime: UptimePanel,
};

/* Guts styling — expects the Web Console CSS vars (--panel, --seam, …)
   defined on an ancestor (each variant root sets them, same values as N).
   Signal red + brand accents are scoped here so variants need no edits. */
export const showcaseStyles = `
.scp-win {
	--red: #ff5246;
	--red-glow: rgba(255, 82, 70, 0.65);
	--stripe: #8583ff;
	--sentry: #9d84ff;

	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
}
/* #20: head, stat strip and foot are pinned so every view shares the exact
   same skeleton — rotation can't shift a pixel. */
.scp-win-head,
.scp-win-foot {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
	height: 40px;
	padding: 0 16px;
	flex-shrink: 0;
}
.scp-win-head { border-bottom: 1px solid var(--seam); }
.scp-win-foot { border-top: 1px solid var(--seam); }
.scp-win-body { flex: 1; min-height: 0; }
.scp-etch {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	font-weight: 400;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--paper-soft);
	white-space: nowrap;
}
.scp-sim { opacity: 0.55; font-size: 9px; }
.scp-mono {
	font-family: "IBM Plex Mono", monospace;
	font-size: 13px;
	font-variant-numeric: tabular-nums;
}
.scp-green { color: var(--green-text); }
.scp-amber { color: var(--amber); }
.scp-amber-etch { color: var(--amber); }
.scp-red { color: var(--red); }
.scp-tag-amber {
	font-family: "IBM Plex Mono", monospace;
	font-size: 9px;
	letter-spacing: 0.18em;
	color: #1c1913;
	background: var(--amber);
	border-radius: 4px;
	padding: 2px 7px;
	box-shadow: 0 0 12px rgba(255, 210, 60, 0.35);
}

/* brand marks */
.scp-brandrow { display: inline-flex; align-items: center; gap: 7px; }
.scp-brandmark { width: 14px; height: 11px; flex-shrink: 0; }
.scp-stripe-mark {
	font-family: "Space Grotesk", sans-serif;
	font-size: 13px;
	font-weight: 700;
	letter-spacing: -0.02em;
	text-transform: lowercase;
	color: var(--stripe);
}
.scp-sentry-mark { color: var(--sentry); }

/* insight stat strip — the founder metric leads every view */
.scp-stats {
	display: flex;
	align-items: center;
	gap: 26px;
	height: 64px;
	padding: 0 16px;
	border-bottom: 1px solid var(--seam);
	flex-shrink: 0;
}
.scp-stat { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.scp-stat-num {
	font-size: 19px;
	font-weight: 700;
	letter-spacing: -0.02em;
	font-variant-numeric: tabular-nums;
	white-space: nowrap;
}
.scp-stat-num small { font-size: 11px; font-weight: 500; color: var(--paper-soft); }

.scp-chart {
	display: flex;
	align-items: flex-end;
	gap: 3px;
	height: 100%;
	min-height: 110px;
	padding: 14px 16px 0;
	background: var(--display-bg);
	box-shadow: inset 0 3px 12px rgba(0, 0, 0, 0.7);
}
.scp-chart-short { min-height: 90px; }
.scp-bar {
	flex: 1;
	border-radius: 2px 2px 0 0;
	background: rgba(59, 210, 59, 0.45);
	transition: height 0.5s ease;
}
.scp-bar-spike {
	background: var(--amber);
	box-shadow: 0 0 8px rgba(255, 210, 60, 0.45);
}
.scp-rows { display: flex; flex-direction: column; justify-content: center; }
.scp-row {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 10px 16px;
	border-bottom: 1px solid var(--seam);
	min-height: 42px;
}
.scp-row:last-child, .scp-mailrow:last-child, .scp-errrow:last-child { border-bottom: none; }
.scp-row-bad { background: rgba(255, 82, 70, 0.06); }
.scp-row-main {
	flex: 1;
	font-size: 13.5px;
	letter-spacing: -0.01em;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.scp-row-side { flex-shrink: 0; }

/* mail rows — Gmail anatomy: star, weighted sender, subject — preview */
.scp-mailrow {
	display: flex;
	align-items: flex-start;
	gap: 11px;
	padding: 9px 16px;
	border-bottom: 1px solid var(--seam);
	animation: scp-slidein 0.35s ease both;
}
@keyframes scp-slidein {
	from { opacity: 0; transform: translateY(-8px); }
	to { opacity: 1; transform: translateY(0); }
}
.scp-mailrow-unread { background: rgba(236, 231, 218, 0.03); }
.scp-star {
	font-size: 13px;
	color: var(--paper-soft);
	opacity: 0.55;
	margin-top: 1px;
	flex-shrink: 0;
}
.scp-star-on { color: var(--amber); opacity: 1; }
.scp-mailrow-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.scp-mailrow-top { display: flex; align-items: center; gap: 10px; }
.scp-mail-sender { font-weight: 700; font-size: 13.5px; letter-spacing: -0.01em; flex-shrink: 0; }
.scp-mailrow:not(.scp-mailrow-unread) .scp-mail-sender { font-weight: 500; opacity: 0.65; }
.scp-mail-proj { flex: 1; overflow: hidden; text-overflow: ellipsis; }
.scp-mail-when { font-size: 11px; color: var(--paper-soft); flex-shrink: 0; }
.scp-mailrow-bottom {
	font-size: 12.5px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
	min-width: 0;
}
.scp-mail-subject { flex-shrink: 0; }
.scp-mailrow-unread .scp-mail-subject { color: var(--paper); font-weight: 500; }
.scp-mail-preview { color: var(--paper-soft); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* payment rows — Stripe badges and method chips */
.scp-badge {
	font-size: 11px;
	font-weight: 500;
	border-radius: 5px;
	padding: 2px 8px;
	flex-shrink: 0;
	min-width: 74px;
	text-align: center;
}
.scp-badge-ok {
	color: #3ecf8e;
	background: rgba(62, 207, 142, 0.12);
	border: 1px solid rgba(62, 207, 142, 0.3);
}
.scp-badge-bad {
	color: var(--red);
	background: rgba(255, 82, 70, 0.12);
	border: 1px solid rgba(255, 82, 70, 0.35);
}
.scp-pay-amount { font-weight: 500; font-size: 14px; flex-shrink: 0; }
.scp-pay-who {
	flex: 1;
	font-family: "IBM Plex Mono", monospace;
	font-size: 11px;
	color: var(--paper-soft);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.scp-chip {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	color: var(--paper-soft);
	border: 1px solid var(--seam);
	border-radius: 4px;
	padding: 2px 6px;
	flex-shrink: 0;
	white-space: nowrap;
}

/* error rows — level dot, message, sparkline, meta */
.scp-errrow {
	display: flex;
	flex-direction: column;
	gap: 3px;
	padding: 9px 16px;
	border-bottom: 1px solid var(--seam);
}
.scp-errrow .scp-mailrow-top { gap: 9px; }
.scp-err-msg {
	flex: 1;
	font-size: 12px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.scp-err-at { font-size: 11px; color: var(--paper-soft); }
.scp-errrow-resolved { opacity: 0.45; }
.scp-err-meta { gap: 12px; overflow: visible; padding-left: 17px; }

/* sparklines */
.scp-spark { display: flex; gap: 2px; align-items: flex-end; flex-shrink: 0; height: 18px; }
.scp-spark span { width: 3px; border-radius: 1px; background: rgba(59, 210, 59, 0.55); }
.scp-row-bad .scp-spark span, .scp-errrow .scp-row-bad .scp-spark span { background: rgba(255, 82, 70, 0.6); }
.scp-errrow:first-child .scp-spark span { background: rgba(255, 82, 70, 0.6); }

/* github rows */
.scp-gh-stars { flex-shrink: 0; width: 84px; }
.scp-gh-delta { flex-shrink: 0; width: 38px; text-align: right; }
.scp-spark-row { flex: 1; justify-content: flex-start; }

/* uptime rows */
.scp-uptime-name { font-weight: 700; font-size: 13.5px; letter-spacing: -0.01em; width: 88px; flex-shrink: 0; }
.scp-ticks { flex: 1; display: flex; gap: 2px; align-items: center; }
.scp-tick {
	flex: 1;
	height: 14px;
	border-radius: 2px;
	background: rgba(59, 210, 59, 0.5);
}
.scp-tick-amber { background: var(--amber); box-shadow: 0 0 6px rgba(255, 210, 60, 0.45); }
.scp-tick-red { background: var(--red); box-shadow: 0 0 6px var(--red-glow); }

.scp-led {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 7px var(--led-glow);
	flex-shrink: 0;
}
.scp-led-off { background: var(--led-off); box-shadow: none; }
.scp-led-red { background: var(--red); box-shadow: 0 0 7px var(--red-glow); }
.scp-led-amber-solid { background: var(--amber); box-shadow: 0 0 7px rgba(255, 210, 60, 0.6); }
@media (prefers-reduced-motion: reduce) {
	.scp-bar { transition: none; }
	.scp-mailrow { animation: none; }
}
`;
