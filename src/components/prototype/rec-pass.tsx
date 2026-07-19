// PROTOTYPE — throwaway (wayfinder #69, showcase record etches). #46 locked
// that metric milestones reach the showcase views as STATIC `★` record
// etches (no celebration beat — that treatment is exclusive to the hero
// demo story loop). This prototype answers: *where does a record etch sit
// inside the intent switchboard's merged stat strip, and how does it read?*
//
// Switchable via ?rec=a|b|c on the real page (dev builds only); param
// absent = the current showcase, the "does a record earn its place at all"
// control. The four panels are copied verbatim from showcase-intents.tsx
// (issue-19 variant T) so the record is judged against real view density,
// live movement and the SIMULATED FEED honesty etch — only the record is
// new. The three variants disagree on STRUCTURE and placement:
//
//   a "Record cell"  — the record is a fourth founder-metric cell appended
//        to the stat strip, pushed to the right edge, green ★ value. It
//        reads as a peer of the live stats: the all-time alongside the now.
//   b "Head pin"     — the record is a calm-green pill in the window title
//        bar, the counterweight to the amber "N NEEDS ACTION" alert. The
//        stat strip stays pure-live; chrome carries best-vs-alert.
//   c "Under-etch"   — the record is a hairline sub-line beneath the single
//        live stat it is the ceiling of (health→ALL PROJECTS, activity→
//        TRAFFIC, money→THIS MONTH, mail→SENT TODAY). Tightest coupling:
//        the ★ annotates the exact metric it caps. No new cell, no chrome.
//
// Honesty: the record inherits the panel's SIMULATED FEED etch (it is part
// of the same honestly-mock view). Treatment rule from #46/#50 — the record
// lights display-green (an earned high) but never animates. The four record
// strings are a COPY PROPOSAL for the operator, not final. Remove with
// rec-pass.css.
import { useEffect, useRef, useState } from "react";
import "#/components/landing/showcase.css";
import {
	INTENT_ITEMS,
	type IntentKey,
	ROTATE_MS,
} from "#/components/landing/showcase-intents";
import { usePrefersReducedMotion } from "#/components/landing/use-prefers-reduced-motion";
import { Waypoint } from "#/components/landing/waypoint";
import "#/components/prototype/rec-pass.css";

export type RecVariant = "a" | "b" | "c";

const ORDER: (RecVariant | null)[] = [null, "a", "b", "c"];
const NAMES: Record<RecVariant, string> = {
	a: "Record cell",
	b: "Head pin",
	c: "Under-etch",
};

// Per-view record — a founder-metric best, proposed copy for the operator.
// `star` is the etched value; `label` is its stat-strip caption for variant
// a; `cell` marks which live stat variant c annotates.
const RECORDS: Record<
	IntentKey,
	{ label: string; star: string; cell: number }
> = {
	health: { label: "BEST STREAK", star: "41 DAYS ALL UP", cell: 0 },
	activity: { label: "BEST DAY", star: "3,420 VISITS", cell: 0 },
	money: { label: "MILESTONE", star: "FIRST € · MAR 3", cell: 0 },
	mail: { label: "BEST DAY", star: "100% · 512 SENT", cell: 0 },
};

/* -------------------- record slot primitives -------------------- */

/** Variant a: a fourth stat cell, right-pushed, green ★ record. */
function RecCell({ view, variant }: { view: IntentKey; variant: RecVariant }) {
	if (variant !== "a") return null;
	const r = RECORDS[view];
	return (
		<div className="scp-stat rec-cell">
			<span className="scp-etch rec-etch-green">★ {r.label}</span>
			<span className="scp-stat-num scp-green">{r.star}</span>
		</div>
	);
}

/** Variant b: a calm-green record pill in the window head. */
function RecPin({ view, variant }: { view: IntentKey; variant: RecVariant }) {
	if (variant !== "b") return null;
	const r = RECORDS[view];
	return (
		<span className="rec-pin">
			★ <span className="rec-pin-label">{r.label}</span> {r.star}
		</span>
	);
}

/** Variant c: a hairline record sub-line under one live stat. */
function RecUnder({
	view,
	variant,
	index,
}: {
	view: IntentKey;
	variant: RecVariant;
	index: number;
}) {
	const r = RECORDS[view];
	if (variant !== "c" || r.cell !== index) return null;
	return (
		<span className="rec-under">
			<span className="rec-under-star">★</span> {r.label} {r.star}
		</span>
	);
}

/* ---------- Health: uptime ticks + error rows, one view ---------- */

const TICK_ROWS = [
	{ name: "invoicer", wobble: -1, incident: -1 },
	{ name: "shiplog", wobble: 9, incident: 31 },
	{ name: "pantry-api", wobble: 23, incident: -1 },
];
const TICK_COUNT = 42;
const TICK_IDS = Array.from({ length: TICK_COUNT }, (_, i) => `t${i}`);

function HealthPanel({ variant }: { variant: RecVariant }) {
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
				<span className="rec-head-right">
					<RecPin view="health" variant={variant} />
					<span className="scp-tag-amber">1 NEEDS ACTION</span>
				</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">ALL PROJECTS</span>
					<span className="scp-stat-num scp-green">12/12 up</span>
					<RecUnder view="health" variant={variant} index={0} />
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
				<RecCell view="health" variant={variant} />
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

function ActivityPanel({ variant }: { variant: RecVariant }) {
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
				<span className="rec-head-right">
					<RecPin view="activity" variant={variant} />
					<span className="scp-tag-amber">SPIKE DETECTED</span>
				</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">TRAFFIC</span>
					<span className="scp-stat-num">
						{total.toLocaleString("en-US")} <small>req/min</small>
					</span>
					<RecUnder view="activity" variant={variant} index={0} />
				</div>
				<div className="scp-stat">
					<span className="scp-etch">SIGNUPS THIS WEEK</span>
					<span className="scp-stat-num scp-green">142 ▲ +38%</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">STARS THIS WEEK</span>
					<span className="scp-stat-num">★ +61</span>
				</div>
				<RecCell view="activity" variant={variant} />
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

function MoneyPanel({ variant }: { variant: RecVariant }) {
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
				<span className="rec-head-right">
					<RecPin view="money" variant={variant} />
					<span className="scp-tag-amber">1 FAILED TODAY</span>
				</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">THIS MONTH</span>
					<span className="scp-stat-num">€3,204</span>
					<RecUnder view="money" variant={variant} index={0} />
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
				<RecCell view="money" variant={variant} />
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

function MailIntentPanel({ variant }: { variant: RecVariant }) {
	return (
		<div className="scp-win">
			<div className="scp-win-head">
				<span className="scp-etch">MAIL · POSTMARK</span>
				<span className="rec-head-right">
					<RecPin view="mail" variant={variant} />
					<span className="scp-tag-amber">1 BOUNCED</span>
				</span>
			</div>
			<div className="scp-stats">
				<div className="scp-stat">
					<span className="scp-etch">SENT TODAY</span>
					<span className="scp-stat-num">412</span>
					<RecUnder view="mail" variant={variant} index={0} />
				</div>
				<div className="scp-stat">
					<span className="scp-etch">DELIVERED</span>
					<span className="scp-stat-num scp-green">99.2%</span>
				</div>
				<div className="scp-stat">
					<span className="scp-etch">BOUNCED</span>
					<span className="scp-stat-num scp-amber">1</span>
				</div>
				<RecCell view="mail" variant={variant} />
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

export const REC_PANELS: Record<
	IntentKey,
	(props: { variant: RecVariant }) => React.ReactNode
> = {
	health: HealthPanel,
	activity: ActivityPanel,
	money: MoneyPanel,
	mail: MailIntentPanel,
};

/* ------- showcase host (copied from landing/showcase.tsx) --------- */
// Mirrors the real Showcase wiring so the record is judged against real
// rail rotation, bezel chrome and view density; only the mounted panel
// swaps to the record-augmented copy. Replaces <Showcase /> while ?rec= is
// active.

export function RecShowcase({ variant }: { variant: RecVariant }) {
	const reduced = usePrefersReducedMotion();
	const [sel, setSel] = useState<{ key: IntentKey; n: number }>({
		key: "health",
		n: 0,
	});
	const [paused, setPaused] = useState(false);
	const [railFocused, setRailFocused] = useState(false);
	const frozen = reduced || paused || railFocused;
	const tabRefs = useRef<Record<IntentKey, HTMLButtonElement | null>>({
		health: null,
		activity: null,
		money: null,
		mail: null,
	});
	const active = INTENT_ITEMS.find((i) => i.key === sel.key);
	const Panel = REC_PANELS[sel.key];

	useEffect(() => {
		if (frozen) return;
		const idx = INTENT_ITEMS.findIndex((i) => i.key === sel.key);
		const t = setTimeout(() => {
			setSel((prev) => ({
				key: INTENT_ITEMS[(idx + 1) % INTENT_ITEMS.length].key,
				n: prev.n + 1,
			}));
		}, ROTATE_MS);
		return () => clearTimeout(t);
	}, [sel, frozen]);

	const selectKey = (key: IntentKey) =>
		setSel((prev) => ({ key, n: prev.n + 1 }));

	const onTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
		let nextIdx: number | null = null;
		if (e.key === "ArrowRight" || e.key === "ArrowDown") {
			nextIdx = (idx + 1) % INTENT_ITEMS.length;
		} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
			nextIdx = (idx - 1 + INTENT_ITEMS.length) % INTENT_ITEMS.length;
		} else if (e.key === "Home") {
			nextIdx = 0;
		} else if (e.key === "End") {
			nextIdx = INTENT_ITEMS.length - 1;
		}
		if (nextIdx === null) return;
		e.preventDefault();
		const nextKey = INTENT_ITEMS[nextIdx].key;
		selectKey(nextKey);
		tabRefs.current[nextKey]?.focus();
	};

	return (
		<section
			className="lp-section lp-band"
			id="wp-hq"
			aria-label="Inside the headquarters"
		>
			<Waypoint index="02" label="THE HQ" />
			<h2 className="lp-h2">Inside the headquarters.</h2>
			<p className="lp-sub">
				The views you get on day one, across every project you run.
			</p>

			<div className="wsi-bezel">
				<div className="wsi-bezel-top">
					<span className="scp-etch">ALFREDO OS 0.1</span>
					<span className="scp-etch">HQ / {active?.etch ?? ""}</span>
					<span className="scp-etch">SIMULATED DATA</span>
					<button
						type="button"
						className="scp-etch wsi-pause"
						aria-pressed={paused}
						aria-label={paused ? "Resume rotation" : "Pause rotation"}
						onClick={() => setPaused((p) => !p)}
					>
						<span aria-hidden="true">{paused ? "▶ PLAY" : "II PAUSE"}</span>
					</button>
				</div>

				<div className="wsi-app">
					<div
						className="wsi-menu"
						role="tablist"
						aria-label="HQ views"
						onFocus={() => setRailFocused(true)}
						onBlur={(e) => {
							if (!e.currentTarget.contains(e.relatedTarget as Node)) {
								setRailFocused(false);
							}
						}}
					>
						{INTENT_ITEMS.map((item, idx) => {
							const on = sel.key === item.key;
							return (
								<button
									type="button"
									role="tab"
									id={`wsi-tab-${item.key}`}
									aria-selected={on}
									aria-controls={`wsi-panel-${item.key}`}
									tabIndex={on ? 0 : -1}
									className={`wsi-key${on ? " wsi-key-on" : ""}`}
									key={item.key}
									ref={(el) => {
										tabRefs.current[item.key] = el;
									}}
									onClick={() => selectKey(item.key)}
									onKeyDown={(e) => onTabKeyDown(e, idx)}
								>
									<span
										className={`wsi-key-led${on ? " wsi-key-led-on" : ""}`}
										aria-hidden="true"
									/>
									<span className="wsi-key-name">{item.name}</span>
									<span className="wsi-key-services">{item.services}</span>
									{on && !frozen && (
										<span className="wsi-key-track" aria-hidden="true">
											<span
												className="wsi-key-fill"
												key={`${sel.key}-${sel.n}`}
											/>
										</span>
									)}
								</button>
							);
						})}
					</div>
					<div className="wsi-main">
						<div className="wsi-stage">
							<div
								className="wsi-view"
								key={sel.key}
								role="tabpanel"
								id={`wsi-panel-${sel.key}`}
								aria-labelledby={`wsi-tab-${sel.key}`}
								// biome-ignore lint/a11y/noNoninteractiveTabindex: APG tabpanel, keyboard-reachable by design
								tabIndex={0}
							>
								<Panel variant={variant} />
							</div>
						</div>
						<div className="wsi-captionbar">
							<p className="wsi-caption">{active?.line ?? ""}</p>
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
	);
}

/* ---------------------- variant state ------------------------ */

/** Reads ?rec= on mount (dev only) and mirrors changes back into the URL. */
export function useRecPass(): [
	RecVariant | null,
	(v: RecVariant | null) => void,
] {
	const [variant, setVariant] = useState<RecVariant | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("rec");
		if (v === "a" || v === "b" || v === "c") setVariant(v);
	}, []);

	const update = (v: RecVariant | null) => {
		setVariant(v);
		const q = new URLSearchParams(window.location.search);
		if (v === null) q.delete("rec");
		else q.set("rec", v);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [variant, update];
}

/* ---------------------- switcher bar ------------------------- */

export function RecSwitcher({
	current,
	onChange,
}: {
	current: RecVariant | null;
	onChange: (v: RecVariant | null) => void;
}) {
	useEffect(() => {
		if (import.meta.env.PROD) return;
		const onKey = (e: KeyboardEvent) => {
			const t = e.target as HTMLElement | null;
			if (
				t &&
				(t.tagName === "INPUT" ||
					t.tagName === "TEXTAREA" ||
					t.isContentEditable)
			)
				return;
			if (e.key !== "[" && e.key !== "]") return;
			const i = ORDER.indexOf(current);
			const next =
				e.key === "]"
					? ORDER[(i + 1) % ORDER.length]
					: ORDER[(i - 1 + ORDER.length) % ORDER.length];
			onChange(next);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [current, onChange]);

	if (import.meta.env.PROD) return null;

	const cycle = (dir: 1 | -1) => {
		const i = ORDER.indexOf(current);
		onChange(ORDER[(i + dir + ORDER.length) % ORDER.length]);
	};

	return (
		<div className="rec-switcher">
			<button
				type="button"
				onClick={() => cycle(-1)}
				aria-label="Previous record variant"
			>
				←
			</button>
			<span>
				{current === null
					? "REC: OFF — [ ] to flip"
					: `REC ${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button
				type="button"
				onClick={() => cycle(1)}
				aria-label="Next record variant"
			>
				→
			</button>
		</div>
	);
}
