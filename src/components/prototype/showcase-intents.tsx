// PROTOTYPE — shared guts for the intent-grouping exploration (wayfinder
// #19, throwaway). One taxonomy across variants T/U/V so the reaction
// isolates STRUCTURE (where per-service detail lives), not group names:
//   HEALTH   = Uptime Kuma + Sentry      (is anything down or broken?)
//   ACTIVITY = Umami + Better-Auth + GitHub (is anything moving?)
//   MONEY    = Creem                     (is anything earning?)
//   MAIL     = Postmark                  (is anything sending?)
// Providers follow the #14 truth-list; born with the #17 HQ swap applied.
// Composite panels reuse the scp- classes from showcase-panels.tsx.
import { useEffect, useState } from "react";
import { showcaseStyles } from "#/components/prototype/showcase-panels";

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

/* ---------- Health: uptime ticks + error rows, one view ---------- */

const TICK_ROWS = [
	{ name: "invoicer", wobble: -1, incident: -1 },
	{ name: "shiplog", wobble: 9, incident: 31 },
	{ name: "pantry-api", wobble: 23, incident: -1 },
];
const TICK_COUNT = 42;
const TICK_IDS = Array.from({ length: TICK_COUNT }, (_, i) => `t${i}`);

export function HealthPanel() {
	const [shift, setShift] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setShift((s) => s + 1), 800);
		return () => clearInterval(id);
	}, []);

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
	const [wob, setWob] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setWob((w) => w + 1), 700);
		return () => clearInterval(id);
	}, []);
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
	const [sec, setSec] = useState(14);
	useEffect(() => {
		const id = setInterval(() => setSec((s) => s + 1), 1000);
		return () => clearInterval(id);
	}, []);

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

/* ---------- Hero-dashboard fallout: the tile row, before/after ----------
   Identical strip on every variant so it never pollutes the T/U/V
   comparison — it answers the ticket's second question ("which surfaces
   regroup") for the hero demo's dashboard screen (variant N). */

export function HeroTilesFallout() {
	return (
		<section className="wsi-fallout" aria-label="Hero dashboard fallout">
			<div className="wsi-fallout-label scp-etch">
				HERO DEMO FALLOUT · THE DASHBOARD TILE ROW (VARIANT N)
			</div>
			<div className="wsi-fallout-row">
				<span className="scp-etch wsi-fallout-tag">TODAY · BY SERVICE</span>
				<div className="wsi-minitiles">
					<div className="wsi-minitile">
						<span className="scp-etch">TRAFFIC</span>
						<span className="wsi-minitile-num">24,318</span>
						<span className="wsi-minitile-note">busiest: pantry-api</span>
					</div>
					<div className="wsi-minitile">
						<span className="scp-etch">MAIL</span>
						<span className="wsi-minitile-num">1,832</span>
						<span className="wsi-minitile-note">across 4 inboxes</span>
					</div>
					<div className="wsi-minitile">
						<span className="scp-etch">REVENUE</span>
						<span className="wsi-minitile-num">€ 3,204</span>
						<span className="wsi-minitile-note">top: invoicer</span>
					</div>
					<div className="wsi-minitile">
						<span className="scp-etch">FLEET</span>
						<span className="wsi-minitile-num">4/4</span>
						<span className="wsi-minitile-note">live · 0 incidents</span>
					</div>
				</div>
			</div>
			<div className="wsi-fallout-row">
				<span className="scp-etch wsi-fallout-tag wsi-fallout-tag-on">
					REGROUPED · BY INTENT
				</span>
				<div className="wsi-minitiles">
					<div className="wsi-minitile wsi-minitile-on">
						<span className="scp-etch">ACTIVITY</span>
						<span className="wsi-minitile-num">24,318</span>
						<span className="wsi-minitile-note">+142 signups this week</span>
					</div>
					<div className="wsi-minitile wsi-minitile-on">
						<span className="scp-etch">MAIL</span>
						<span className="wsi-minitile-num">1,832</span>
						<span className="wsi-minitile-note">sent · 1 bounced</span>
					</div>
					<div className="wsi-minitile wsi-minitile-on">
						<span className="scp-etch">MONEY</span>
						<span className="wsi-minitile-num">€ 3,204</span>
						<span className="wsi-minitile-note">1 failed today</span>
					</div>
					<div className="wsi-minitile wsi-minitile-on">
						<span className="scp-etch">HEALTH</span>
						<span className="wsi-minitile-num">4/4 up</span>
						<span className="wsi-minitile-note">0 incidents</span>
					</div>
				</div>
			</div>
			<p className="wsi-fallout-note">
				FLEET's bay count moves to the mini-terminal line, which already counts
				projects. Everything else on the dashboard screen stays.
			</p>
		</section>
	);
}

/* ---------- Shared shell: the approved S frame with the #17 HQ swap ----
   The frame is settled (#13); T/U/V disagree only about the rail and the
   stage, so those come in as props and the reaction stays on them. */

export function IntentShell({
	etch,
	caption,
	rail,
	children,
}: {
	etch: string;
	caption: string;
	rail: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="wsi">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{showcaseStyles}</style>
			<style>{intentStyles}</style>

			<header className="wsi-head">
				<span className="wsi-wordmark">
					Alfredo
					<span className="wsi-wordmark-led" aria-hidden="true" />
				</span>
				<span className="scp-etch">SELF-HOSTED</span>
			</header>

			<div className="wsi-ghost">ACT 2 · ONE HQ — ENDS ABOVE</div>

			<section className="wsi-section" aria-label="Inside the headquarters">
				<h2 className="wsi-h2">Inside the headquarters.</h2>
				<p className="wsi-sub">
					The views you get on day one, across every project you run.
				</p>

				<div className="wsi-bezel">
					<div className="wsi-bezel-top">
						<span className="scp-etch">ALFREDO OS 0.1</span>
						<span className="scp-etch">HQ / {etch}</span>
						<span className="scp-etch">SIMULATED DATA</span>
					</div>

					<div className="wsi-app">
						<div className="wsi-menu" role="tablist" aria-label="HQ views">
							{rail}
						</div>
						<div className="wsi-main">
							<div className="wsi-stage">{children}</div>
							<div className="wsi-captionbar">
								<p className="wsi-caption">{caption}</p>
							</div>
						</div>
					</div>

					<div className="wsi-bezel-bottom">
						<span className="scp-etch wsi-microprint">
							YOUR SERVERS · ONE HQ · N PROJECTS
						</span>
					</div>
				</div>
			</section>

			<HeroTilesFallout />

			<div className="wsi-ghost">FOUNDER NOTE — FOLLOWS BELOW</div>
		</div>
	);
}

export const ROTATE_MS = 5000;

export const intentStyles = `
.wsi {
	--bg: #14150e;
	--panel: #1e1f16;
	--panel-2: #24251b;
	--surface: #191a11;
	--paper: #ece7da;
	--paper-soft: #97927f;
	--seam: rgba(236, 231, 218, 0.1);
	--led: #3bd23b;
	--led-glow: rgba(59, 210, 59, 0.75);
	--led-off: #3a3b30;
	--green-text: #58e85c;
	--amber: #ffd23c;
	--display-bg: #0d0e08;
	--display-text: #58e85c;

	min-height: 100vh;
	background: var(--bg);
	color: var(--paper);
	font-family: "Space Grotesk", sans-serif;
}
.wsi-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.wsi-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.wsi-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 9px var(--led-glow);
}
.wsi-ghost {
	max-width: 1020px;
	margin: 44px auto;
	padding: 34px 24px;
	border: 1px dashed var(--seam);
	border-radius: 14px;
	text-align: center;
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	letter-spacing: 0.22em;
	color: var(--paper-soft);
	opacity: 0.4;
}
.wsi-section {
	max-width: 1020px;
	margin: 0 auto;
	padding: 24px 24px 0;
	text-align: center;
}
.wsi-h2 {
	margin: 0;
	font-size: clamp(28px, 3.6vw, 40px);
	font-weight: 700;
	letter-spacing: -0.03em;
	line-height: 1.1;
}
.wsi-sub {
	margin: 14px auto 0;
	max-width: 52ch;
	font-size: 16px;
	line-height: 1.6;
	color: #b3ad9b;
}
.wsi-bezel { margin-top: 36px; text-align: left; }
.wsi-bezel-top,
.wsi-bezel-bottom {
	background: var(--panel);
	border: 1px solid var(--seam);
	display: flex;
	justify-content: space-between;
	padding: 10px 24px;
}
.wsi-bezel-top { border-radius: 14px 14px 0 0; border-bottom: none; }
.wsi-bezel-bottom {
	border-radius: 0 0 14px 14px;
	border-top: none;
	justify-content: center;
	box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.wsi-microprint { font-size: 9px; opacity: 0.8; }
.wsi-app {
	background: var(--surface);
	border: 1px solid var(--seam);
	height: 560px;
	display: grid;
	grid-template-columns: 250px 1fr;
	box-shadow: inset 0 4px 18px rgba(0, 0, 0, 0.6);
}
.wsi-menu {
	border-right: 1px solid var(--seam);
	display: flex;
	flex-direction: column;
	gap: 11px;
	padding: 16px;
}
.wsi-key {
	flex: 1;
	display: flex;
	align-items: center;
	gap: 10px;
	text-align: left;
	border: none;
	border-radius: 10px;
	padding: 0 15px;
	font-family: inherit;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	background: linear-gradient(180deg, #f6f3ea 0%, #e4dfd3 100%);
	color: #1c1913;
	box-shadow: 0 3px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85);
	transition: transform 0.06s ease, box-shadow 0.06s ease, background 0.15s ease;
}
.wsi-key:hover:not(.wsi-key-on) { background: linear-gradient(180deg, #fffdf6 0%, #ece7da 100%); }
.wsi-key:active { transform: translateY(2px); box-shadow: 0 1px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85); }
.wsi-key-on {
	background: linear-gradient(180deg, #ffd23c 0%, #eab821 100%);
	transform: translateY(2px);
	box-shadow: 0 1px 0 #9a7a10, inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.wsi-key-name { font-weight: 700; font-size: 14.5px; letter-spacing: -0.01em; }
.wsi-key-services {
	margin-left: auto;
	font-family: "IBM Plex Mono", monospace;
	font-size: 7.5px;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: rgba(28, 25, 19, 0.55);
	text-align: right;
	line-height: 1.5;
	max-width: 45%;
}
.wsi-key-led {
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background: rgba(28, 25, 19, 0.18);
	box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.2);
	flex-shrink: 0;
}
.wsi-key-led-on {
	background: #fff8e6;
	box-shadow: 0 0 8px rgba(255, 246, 220, 0.95), 0 0 0 2px rgba(28, 25, 19, 0.25);
}
.wsi-key-track {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 4px;
	background: rgba(28, 25, 19, 0.16);
}
.wsi-key-fill {
	display: block;
	height: 100%;
	width: 0;
	background: #1c1913;
	animation: wsi-fill ${ROTATE_MS}ms linear forwards;
}
@keyframes wsi-fill { to { width: 100%; } }
.wsi-main { display: flex; flex-direction: column; min-width: 0; }
.wsi-stage { flex: 1; min-height: 0; padding: 18px 22px 10px; display: flex; flex-direction: column; }
.wsi-view { flex: 1; min-height: 0; animation: wsi-in 0.25s ease both; }
.wsi-captionbar {
	border-top: 1px solid var(--seam);
	padding: 13px 22px;
	flex-shrink: 0;
}
.wsi-caption { margin: 0; font-size: 15px; line-height: 1.5; color: #b3ad9b; }
@keyframes wsi-in {
	from { opacity: 0; transform: translateY(6px); }
	to { opacity: 1; transform: translateY(0); }
}

/* rail section headers (variant U) */
.wsi-railhead {
	font-family: "IBM Plex Mono", monospace;
	font-size: 8.5px;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--paper-soft);
	padding: 2px 4px 0;
	flex-shrink: 0;
}
.wsi-railhead:not(:first-child) { margin-top: 6px; }

/* provider sub-caps inside the stage (variant V) */
.wsi-subcaps { display: flex; gap: 9px; padding-bottom: 12px; flex-shrink: 0; }
.wsi-subcap {
	display: inline-flex;
	align-items: center;
	gap: 7px;
	border: none;
	border-radius: 8px;
	padding: 7px 13px;
	font-family: "IBM Plex Mono", monospace;
	font-size: 9.5px;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	cursor: pointer;
	background: linear-gradient(180deg, #f6f3ea 0%, #e4dfd3 100%);
	color: #1c1913;
	box-shadow: 0 2px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85);
	transition: transform 0.06s ease, box-shadow 0.06s ease;
}
.wsi-subcap-on {
	background: linear-gradient(180deg, #ffd23c 0%, #eab821 100%);
	transform: translateY(1px);
	box-shadow: 0 1px 0 #9a7a10, inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* composite-panel internals (variant T guts) */
.sci-body { display: flex; flex-direction: column; padding: 4px 16px; overflow: hidden; }
.sci-body .scp-row { padding: 10px 4px; }
.sci-body .scp-row-main {
	display: flex;
	align-items: center;
	gap: 10px;
	min-width: 0;
}
.sci-rows { justify-content: center; gap: 2px; }
.sci-sect {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding: 9px 0 6px;
	border-bottom: 1px solid var(--seam);
	margin-bottom: 4px;
	flex-shrink: 0;
}
.sci-dim { opacity: 0.6; }
.sci-tickrow { display: flex; align-items: center; gap: 12px; padding: 5px 0; }
.sci-tickname { width: 86px; flex-shrink: 0; font-size: 12px; }
.sci-ticks { display: flex; gap: 3px; flex: 1; min-width: 0; overflow: hidden; }
.sci-tick {
	width: 5px;
	height: 14px;
	border-radius: 2px;
	background: var(--led);
	opacity: 0.75;
	flex-shrink: 0;
}
.sci-tick-amber { background: var(--amber); }
.sci-tick-red { background: var(--red, #ff5246); box-shadow: 0 0 6px var(--red-glow, rgba(255,82,70,0.65)); }

/* hero fallout strip */
.wsi-fallout {
	max-width: 1020px;
	margin: 44px auto 0;
	padding: 22px 24px 20px;
	border: 1px solid var(--seam);
	border-radius: 14px;
	background: var(--panel);
}
.wsi-fallout-label { display: block; text-align: center; margin-bottom: 16px; }
.wsi-fallout-row { display: flex; align-items: center; gap: 16px; padding: 7px 0; }
.wsi-fallout-tag { width: 175px; flex-shrink: 0; text-align: right; opacity: 0.55; }
.wsi-fallout-tag-on { opacity: 1; color: var(--amber); }
.wsi-minitiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; flex: 1; }
.wsi-minitile {
	background: var(--surface);
	border: 1px solid var(--seam);
	border-radius: 10px;
	padding: 10px 13px;
	display: flex;
	flex-direction: column;
	gap: 2px;
	opacity: 0.55;
}
.wsi-minitile-on { opacity: 1; border-color: rgba(255, 210, 60, 0.35); }
.wsi-minitile-num { font-weight: 700; font-size: 17px; letter-spacing: -0.01em; }
.wsi-minitile-note {
	font-family: "IBM Plex Mono", monospace;
	font-size: 9.5px;
	color: var(--paper-soft);
}
.wsi-fallout-note {
	margin: 14px 0 0;
	text-align: center;
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	letter-spacing: 0.08em;
	color: var(--paper-soft);
}

@media (max-width: 860px) {
	.wsi-app { grid-template-columns: 1fr; height: auto; }
	.wsi-menu { border-right: none; border-bottom: 1px solid var(--seam); }
	.wsi-key { min-height: 46px; }
	.wsi-stage { min-height: 400px; }
	.wsi-minitiles { grid-template-columns: repeat(2, 1fr); }
	.wsi-fallout-row { flex-direction: column; align-items: stretch; }
	.wsi-fallout-tag { width: auto; text-align: left; }
}
.wsi *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.wsi * { animation-duration: 0.01ms !important; transition: none !important; }
}
`;
