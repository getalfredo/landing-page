// The hero HQ demo, promoted from the v2 prototype (#26 overlay layout,
// #47 story v2, #46 beat milestones, #53 clock + --tod-glow). One glass:
// the dashboard is always full, the deploy form slides in as a right-side
// sheet and hides after each deploy. The loop is a pure function of time —
// worldAt(t) — driven by one rAF clock, so the YouTube-style scrubber
// (chapter titles, milestone diamonds) replays any moment exactly.
// Story: landing-page → shipnote → cronpilot (owns the incident) →
// snapkit (slow start → viral → first revenue), then ALL QUIET, teardown,
// empty, loop. Reduced motion gets a static composed frame mid-story; the
// scrubber still seeks, each click a discrete jump.
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { consoleCssVars } from "#/components/landing/console-vars";
import { useLocalTime } from "#/components/landing/local-time";
import "#/components/landing/hero-demo.css";

/* ----------------------------------------------------------- the story -- */

// Analytics first and always preselected.
const INTEGRATIONS = [
	{ id: "analytics", label: "Analytics", spec: "on your server", chip: "AN" },
	{ id: "email", label: "Email", spec: "transactional", chip: "EM" },
	{ id: "db", label: "Database", spec: "live data", chip: "DB" },
	{ id: "auth", label: "Auth", spec: "sessions, oauth", chip: "AU" },
	{ id: "payments", label: "Payments", spec: "checkout + billing", chip: "PA" },
];

// typeLen keeps the original storyboard's typing window (#47): a shorter
// display name finishes typing early, which reads as a natural pause
// before the integration picks.
const CAST = [
	{ name: "landing-page", typeLen: 12, picks: [0, 1], dwell: 2.4 },
	{ name: "shipnote", typeLen: 11, picks: [0, 2, 3], dwell: 5.4 },
	{ name: "cronpilot", typeLen: 16, picks: [0, 1, 2, 3], dwell: 6.8 },
	{ name: "snapkit", typeLen: 15, picks: [0, 1, 2, 3, 4], dwell: 8.6 },
];

type Chapter = {
	name: string;
	picks: number[];
	plusAt: number; // ghost click on the "+ new" card
	formAt: number; // sheet slides in
	typeAt: number;
	rings: { pick: number; at: number }[]; // non-analytics selections
	readyAt: number;
	pressAt: number; // Deploy fires, form dims
	wireAt: number; // card appears, chips start lighting
	liveAt: number;
	hideAt: number; // sheet gone (quick)
	outAt: number; // teardown removal
};

const RING_GAPS = [0.34, 0.5, 0.28, 0.44];

function build() {
	const chapters: Chapter[] = [];
	let cursor = 1.3;
	for (const c of CAST) {
		const plusAt = cursor;
		const formAt = plusAt + 0.3;
		const typeAt = formAt + 0.45;
		let sel = typeAt + c.typeLen * 0.045 + 0.3;
		const rings = c.picks.slice(1).map((pick, i) => {
			const at = sel;
			sel += RING_GAPS[i % RING_GAPS.length];
			return { pick, at };
		});
		const readyAt = sel + 0.2;
		const pressAt = readyAt + 0.4;
		const wireAt = pressAt + 0.18;
		const liveAt = wireAt + 0.35 + c.picks.length * 0.22;
		const hideAt = liveAt + 0.15;
		chapters.push({
			name: c.name,
			picks: c.picks,
			plusAt,
			formAt,
			typeAt,
			rings,
			readyAt,
			pressAt,
			wireAt,
			liveAt,
			hideAt,
			outAt: 0,
		});
		cursor = hideAt + c.dwell;
	}
	const quietAt = cursor;
	chapters.forEach((ch, i) => {
		ch.outAt = quietAt + 0.5 + i * 0.55;
	});
	const emptyAt = chapters[chapters.length - 1].outAt + 0.55;
	return { chapters, quietAt, emptyAt, total: emptyAt + 1.7 };
}

const {
	chapters: CH,
	quietAt: QUIET_AT,
	emptyAt: EMPTY_AT,
	total: TOTAL,
} = build();

/* story event times, all derived from the chapter clock */
const SIGNUPS_AT = CH[1].liveAt + 0.3;
const LP_SPIKE: [number, number] = [CH[1].liveAt + 1.5, CH[1].liveAt + 4.2];
const MULTI: [number, number] = [CH[2].liveAt + 0.5, CH[2].liveAt + 3.8];
const DOWN: [number, number] = [CH[2].liveAt + 2.1, CH[2].liveAt + 4.1];
const RETIRE_AT = CH[3].liveAt + 0.9;
const VIRAL_AT = CH[3].liveAt + 2.7;
const VIRAL_END = VIRAL_AT + 3.6;
const PAYMENTS = [
	{ at: VIRAL_AT + 1.3, amt: 49, label: "checkout completed" },
	{ at: VIRAL_AT + 2.1, amt: 19, label: "subscription started" },
	{ at: VIRAL_AT + 2.9, amt: 120, label: "annual upgrade" },
];

/* deterministic metrics — piecewise rates integrated over t */
type Seg = [number, number, number]; // from, to, per-second

const VIEW_RATES: Record<string, Seg[]> = {
	"landing-page": [
		[CH[0].liveAt, LP_SPIKE[0], 2.5],
		[LP_SPIKE[0], LP_SPIKE[1], 30],
		[LP_SPIKE[1], MULTI[0], 4],
		[MULTI[0], MULTI[1], 24],
		[MULTI[1], CH[3].liveAt, 4],
		[CH[3].liveAt, RETIRE_AT, 2],
	],
	shipnote: [
		[CH[1].liveAt, MULTI[0], 1.8],
		[MULTI[0], DOWN[0], 18],
		[DOWN[1], QUIET_AT, 3],
	],
	cronpilot: [
		[CH[2].liveAt, MULTI[1], 26],
		[MULTI[1], QUIET_AT, 3.2],
	],
	snapkit: [
		[CH[3].liveAt, VIRAL_AT, 0.9],
		[VIRAL_AT, VIRAL_END, 55],
		[VIRAL_END, QUIET_AT, 16],
	],
};

// Rates sized so "100 on the waitlist" crosses before teardown (#46).
const WAITLIST_RATE: Seg[] = [
	[SIGNUPS_AT, MULTI[0], 2.4],
	[MULTI[0], MULTI[1], 7],
	[MULTI[1], VIRAL_AT, 2.8],
	[VIRAL_AT, VIRAL_END, 6.4],
	[VIRAL_END, QUIET_AT, 3],
];

function integRaw(segs: Seg[], t: number) {
	let sum = 0;
	for (const [a, b, r] of segs) sum += Math.max(0, Math.min(t, b) - a) * r;
	return sum;
}
function integ(segs: Seg[], t: number) {
	return Math.floor(integRaw(segs, t));
}
function rateAt(segs: Seg[], t: number) {
	for (const [a, b, r] of segs) if (t >= a && t < b) return r;
	return 0;
}
function totalRate(t: number) {
	return Object.values(VIEW_RATES).reduce((s, segs) => s + rateAt(segs, t), 0);
}

function fmt(n: number) {
	return n.toLocaleString("en-US");
}

/* --------------------------------------------------- metric milestones -- */
// #46 — every crossing time is solved from the same deterministic rate
// integrals, so milestones never drift from what the tiles display.

function crossT(f: (t: number) => number, target: number) {
	let lo = 0;
	let hi = QUIET_AT;
	if (f(hi) < target) return Number.POSITIVE_INFINITY; // never crosses
	for (let i = 0; i < 48; i++) {
		const m = (lo + hi) / 2;
		if (f(m) >= target) hi = m;
		else lo = m;
	}
	return hi;
}

const viewsRaw = (t: number) =>
	Object.values(VIEW_RATES).reduce((s, segs) => s + integRaw(segs, t), 0);
const waitRaw = (t: number) => integRaw(WAITLIST_RATE, t);

type Milestone = {
	id: string;
	at: number; // metric crossing
	celAt: number; // celebration start (staggered so windows never overlap)
	celEnd: number; // celebration end (may be cut short by an incident)
	etch: string; // metric family, etched
	big: string; // headline
	sub: string;
};

const CEL_LEN = 2.6; // seconds a celebration holds

const MILESTONE_DEFS: Omit<Milestone, "celAt" | "celEnd">[] = [
	{
		id: "v100",
		at: crossT(viewsRaw, 100),
		etch: "TRAFFIC",
		big: "100th visitor",
		sub: "counted across every project",
	},
	{
		id: "p3",
		at: CH[2].liveAt,
		etch: "PROJECTS",
		big: "3 projects live",
		sub: "one HQ watching all of them",
	},
	{
		id: "wl50",
		at: crossT(waitRaw, 50),
		etch: "WAITLIST",
		big: "50 on the waitlist",
		sub: "shipnote keeps signing them up",
	},
	{
		id: "eur1",
		at: PAYMENTS[0].at,
		etch: "REVENUE",
		big: "First € earned",
		sub: "snapkit · checkout completed",
	},
	{
		id: "wl100",
		at: crossT(waitRaw, 100),
		etch: "WAITLIST",
		big: "100 on the waitlist",
		sub: "the hundredth signup, counted live",
	},
];

const MILESTONES: Milestone[] = MILESTONE_DEFS.filter((m) =>
	Number.isFinite(m.at),
)
	.sort((a, b) => a.at - b.at)
	.map((m) => ({ ...m, celAt: m.at, celEnd: m.at + CEL_LEN }));

// #47 rule: incident spots preempt milestone celebrations. No celebration
// window may overlap the DOWN→RECOVERED drama; one already running gets
// CUT when the incident lands (the incident visibly steals the spotlight —
// deliberate), one that would start inside it waits the incident out.
const BLACKOUT: [number, number] = [DOWN[0] - 0.15, DOWN[1] + 0.8];

// stagger: a milestone landing inside the previous celebration queues up
{
	let prevEnd = Number.NEGATIVE_INFINITY;
	for (const m of MILESTONES) {
		let s = Math.max(m.at, prevEnd + 0.15);
		if (s >= BLACKOUT[0] && s < BLACKOUT[1]) s = BLACKOUT[1];
		let e = s + CEL_LEN;
		if (s < BLACKOUT[0] && e > BLACKOUT[0]) e = BLACKOUT[0];
		m.celAt = s;
		m.celEnd = e;
		prevEnd = e;
	}
}

function milestoneAt(t: number): Milestone | null {
	return MILESTONES.find((m) => t >= m.celAt && t < m.celEnd) ?? null;
}

/* --------------------------------------------------------- worldAt(t) -- */

type ProjStatus = "prov" | "live" | "down" | "off" | "out";

type Spot =
	| { kind: "empty" }
	| { kind: "quiet" }
	| {
			kind: "wiring" | "live" | "trickle" | "signups" | "retired";
			proj: string;
	  }
	| { kind: "spike" | "viral"; proj: string }
	| { kind: "multispike" }
	| { kind: "down" | "recovered"; proj: string }
	| { kind: "payments"; proj: string };

const SPOTS: [number, Spot][] = (
	[
		[0, { kind: "empty" }],
		...CH.flatMap<[number, Spot]>((ch) => [
			[ch.wireAt, { kind: "wiring", proj: ch.name }],
			[ch.liveAt, { kind: "live", proj: ch.name }],
		]),
		[CH[0].liveAt + 1.2, { kind: "trickle", proj: CH[0].name }],
		[SIGNUPS_AT, { kind: "signups", proj: CH[1].name }],
		[LP_SPIKE[0], { kind: "spike", proj: CH[0].name }],
		[MULTI[0], { kind: "multispike" }],
		[DOWN[0], { kind: "down", proj: CH[1].name }],
		[DOWN[1], { kind: "recovered", proj: CH[1].name }],
		[RETIRE_AT, { kind: "retired", proj: CH[0].name }],
		[VIRAL_AT, { kind: "viral", proj: CH[3].name }],
		[PAYMENTS[0].at, { kind: "payments", proj: CH[3].name }],
		[QUIET_AT, { kind: "quiet" }],
		[EMPTY_AT, { kind: "empty" }],
	] as [number, Spot][]
).sort((a, b) => a[0] - b[0]);

function spotAt(t: number): Spot {
	let cur: Spot = { kind: "empty" };
	for (const [at, s] of SPOTS) {
		if (at <= t) cur = s;
		else break;
	}
	return cur;
}

type World = {
	t: number;
	projects: {
		name: string;
		picks: number[];
		status: ProjStatus;
		lit: number;
		ripple: { key: string; color: "green" | "red" } | null;
	}[];
	form: {
		visible: boolean;
		phase: "open" | "filling" | "ready" | "sent";
		name: string;
		typed: number;
		picks: number[];
		checked: Set<number>;
		ring: number; // integration index, -1 none
	} | null;
	spot: Spot;
	toasts: { id: number; amt: number; label: string }[];
	waitlist: number;
	mrr: number;
	rate: number;
	trend: number[];
	plusRing: boolean;
	plusActive: boolean;
	chapter: number; // -1 outside chapters
	milestone: Milestone | null;
};

function inWin(t: number, from: number, len = 0.9) {
	return t >= from && t < from + len;
}

function worldAt(t: number): World {
	/* projects */
	const projects: World["projects"] = [];
	CH.forEach((ch, i) => {
		if (t < ch.wireAt || t >= ch.outAt + 0.5) return;
		let status: ProjStatus =
			t >= ch.outAt ? "out" : t < ch.liveAt ? "prov" : "live";
		if (status === "live" && i === 1 && t >= DOWN[0] && t < DOWN[1])
			status = "down";
		if (status === "live" && i === 0 && t >= RETIRE_AT) status = "off";
		const lit =
			t < ch.liveAt
				? Math.max(0, Math.floor((t - ch.wireAt - 0.35) / 0.22))
				: ch.picks.length;
		// ripple windows: birth, down, recovery
		let ripple: World["projects"][number]["ripple"] = null;
		if (inWin(t, ch.liveAt)) ripple = { key: "live", color: "green" };
		if (i === 1 && inWin(t, DOWN[0])) ripple = { key: "down", color: "red" };
		if (i === 1 && inWin(t, DOWN[1])) ripple = { key: "up", color: "green" };
		projects.push({
			name: ch.name,
			picks: ch.picks,
			status,
			lit: Math.min(lit, ch.picks.length),
			ripple,
		});
	});

	/* chapter: last one started, until the outro — youtube-style persistence */
	let chapter = -1;
	if (t < QUIET_AT)
		for (const [i, ch] of CH.entries()) if (t >= ch.plusAt) chapter = i;

	/* form */
	let form: World["form"] = null;
	for (const ch of CH) {
		if (t >= ch.plusAt && t < ch.hideAt) {
			if (t >= ch.formAt) {
				const typed = Math.max(
					0,
					Math.min(ch.name.length, Math.floor((t - ch.typeAt) / 0.045)),
				);
				const checked = new Set<number>([0]); // analytics: always on
				for (const r of ch.rings) if (t >= r.at + 0.2) checked.add(r.pick);
				const ring = ch.rings.find((r) => t >= r.at && t < r.at + 0.45);
				form = {
					visible: true,
					phase:
						t >= ch.pressAt
							? "sent"
							: t >= ch.readyAt
								? "ready"
								: t >= ch.typeAt
									? "filling"
									: "open",
					name: ch.name,
					typed,
					picks: ch.picks,
					checked,
					ring: ring ? ring.pick : -1,
				};
			}
			break;
		}
	}

	const trend = Array.from({ length: 16 }, (_, i) =>
		totalRate(t - (15 - i) * 0.45),
	);

	return {
		t,
		projects,
		form,
		spot: spotAt(t),
		toasts: PAYMENTS.filter((p) => p.at <= t).map((p, i) => ({
			id: i,
			amt: p.amt,
			label: p.label,
		})),
		waitlist: integ(WAITLIST_RATE, t),
		mrr: PAYMENTS.filter((p) => p.at <= t).reduce((s, p) => s + p.amt, 0),
		rate: totalRate(t),
		trend,
		plusRing: CH.some((ch) => t >= ch.plusAt && t < ch.plusAt + 0.5),
		plusActive: form !== null,
		chapter,
		milestone: milestoneAt(t),
	};
}

/* progress bar chapter segments */
const BAR_SEGS = [
	{ from: 0, to: CH[0].plusAt, label: "" },
	...CH.map((ch, i) => ({
		from: ch.plusAt,
		to: i < CH.length - 1 ? CH[i + 1].plusAt : QUIET_AT,
		label: ch.name,
	})),
	{ from: QUIET_AT, to: TOTAL, label: "" },
];

/* ---------------------------------------------------- the demo engine -- */

export function HeroDemo() {
	const [now, setNow] = useState(0);
	const origin = useRef(0);
	// #53: the visitor's real wall clock on the bezel, and a glow multiplier
	// that brightens the LEDs after dark.
	const { hhmm, glow } = useLocalTime();

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			// static composed frame: mid-story, three projects, surge visible;
			// the scrubber still works — each seek is a discrete jump
			setNow(MULTI[0] + 0.8);
			return;
		}
		origin.current = performance.now() / 1000;
		let raf = 0;
		const tick = () => {
			setNow((performance.now() / 1000 - origin.current) % TOTAL);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, []);

	const seek = (t: number) => {
		const clamped = Math.max(0, Math.min(TOTAL - 0.01, t));
		origin.current = performance.now() / 1000 - clamped;
		setNow(clamped);
	};

	const w = worldAt(now);

	return (
		<section
			className="hd-bezel"
			aria-label="Alfredo HQ demo — a simulated stretch of indie projects deploying and running on one dashboard"
			style={{ ...consoleCssVars, "--tod-glow": glow } as CSSProperties}
		>
			<div className="hd-btop" aria-hidden="true">
				<span className="hd-etch">ALFREDO OS 0.1</span>
				<span className="hd-etch">HQ / LIVE</span>
				<span className="hd-etch">{hhmm ?? "--:--"}</span>
			</div>

			{/* the simulated screen: pure theater, hidden from the tree */}
			<div className="hd-glass" aria-hidden="true">
				<div className="hd-full">
					<Dash w={w} />
					<div className={`hd-sheet${w.form ? " hd-sheet-in" : ""}`}>
						{w.form && <DeployForm form={w.form} />}
					</div>
				</div>
			</div>

			{/* the bottom cap: full-width scrubber, chapter titles underneath */}
			<ProgressBar now={now} onSeek={seek} chapter={w.chapter} />
		</section>
	);
}

/* -------------------------------------------------------- progress bar -- */

function ProgressBar({
	now,
	onSeek,
	chapter,
}: {
	now: number;
	onSeek: (t: number) => void;
	chapter: number;
}) {
	const trackRef = useRef<HTMLDivElement>(null);

	const seekFromPointer = (clientX: number) => {
		const rect = trackRef.current?.getBoundingClientRect();
		if (!rect) return;
		onSeek(((clientX - rect.left) / rect.width) * TOTAL);
	};

	const onPointerDown = (e: React.PointerEvent) => {
		seekFromPointer(e.clientX);
		const move = (ev: PointerEvent) => seekFromPointer(ev.clientX);
		const up = () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		e.preventDefault();
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowRight") onSeek(now + 2);
		else if (e.key === "ArrowLeft") onSeek(now - 2);
		else if (e.key === "Home") onSeek(0);
		else if (e.key === "End") onSeek(TOTAL - 0.01);
		else return;
		e.preventDefault();
	};

	const active = chapter >= 0 ? CH[chapter].name : null;

	return (
		<div className="hd-progress">
			<div
				className="hd-track"
				ref={trackRef}
				onPointerDown={onPointerDown}
				onKeyDown={onKeyDown}
				role="slider"
				tabIndex={0}
				aria-label="Demo timeline"
				aria-valuemin={0}
				aria-valuemax={Math.round(TOTAL)}
				aria-valuenow={Math.round(now)}
				aria-valuetext={`${Math.round(now)} of ${Math.round(TOTAL)} seconds${
					active ? `, chapter ${active}` : ""
				}`}
			>
				{BAR_SEGS.map((seg) => {
					const segLen = seg.to - seg.from;
					const fill =
						now <= seg.from
							? 0
							: now >= seg.to
								? 100
								: ((now - seg.from) / segLen) * 100;
					return (
						<div
							className="hd-seg-wrap"
							key={`${seg.from}`}
							style={{ flexGrow: segLen }}
						>
							<div className="hd-seg-track">
								<div className="hd-seg-fill" style={{ width: `${fill}%` }} />
							</div>
							<span
								className={`hd-seg-title hd-etch${
									seg.label && seg.label === active ? " hd-seg-title-on" : ""
								}`}
							>
								{seg.label}
							</span>
						</div>
					);
				})}
				{/* record markers, youtube key-moment style (#46) */}
				{MILESTONES.map((m) => (
					<span
						className={`hd-ms-mark${now >= m.at ? " hd-ms-mark-hit" : ""}`}
						key={m.id}
						title={m.big}
						aria-hidden="true"
						style={{ left: `${(m.at / TOTAL) * 100}%` }}
					/>
				))}
			</div>
		</div>
	);
}

/* --------------------------------------------------------- the form ---- */

function DeployForm({ form }: { form: NonNullable<World["form"]> }) {
	return (
		<div className={`hd-form hd-form-${form.phase}`}>
			<div className="hd-form-head">
				<span className="hd-etch">NEW PROJECT</span>
				<span
					className={`hd-led${form.phase === "sent" ? " hd-led-amber" : ""}`}
				/>
			</div>

			<div className="hd-field">
				<span className="hd-field-label">Project name</span>
				<span className="hd-input">
					{form.name.slice(0, form.typed)}
					{form.phase === "filling" && form.typed < form.name.length && (
						<span className="hd-caret" />
					)}
				</span>
			</div>

			<span className="hd-field-label">Integrations</span>
			<div className="hd-intcards">
				{INTEGRATIONS.map((it, i) => {
					const on = form.checked.has(i);
					return (
						<div
							className={`hd-intcard${on ? " hd-intcard-on" : ""}`}
							key={it.id}
						>
							<span className="hd-intbox">{on ? "✓" : ""}</span>
							<span className="hd-intname">{it.label}</span>
							<span className="hd-intspec">
								{i === 0 ? "always on" : it.spec}
							</span>
							{form.ring === i && <span className="hd-ring" />}
						</div>
					);
				})}
			</div>

			<button
				type="button"
				tabIndex={-1}
				className={`lp-btn ${form.phase === "ready" ? "lp-btn-next" : "lp-btn-keycap"}`}
			>
				{form.phase === "sent" ? "Deploying…" : "Deploy"}
			</button>
		</div>
	);
}

/* ---------------------------------------------------------- dashboard -- */

function Dash({ w }: { w: World }) {
	// #47 legibility: the project card the spotlight is talking about lights
	// a focus link, so the eye connects card ↔ story; suppressed during
	// milestone beats and never fighting the red DOWN state.
	const focus = !w.milestone && "proj" in w.spot ? w.spot.proj : null;
	return (
		<div className="hd-dash">
			{/* thin fixed top row: every project + the add-new control */}
			<div className="hd-toprow">
				{w.projects.map((p) => (
					<div
						className={`hd-proj hd-proj-${p.status}${
							p.name === focus ? " hd-proj-focus" : ""
						}`}
						key={p.name}
					>
						{p.ripple && (
							<span
								className={`hd-ripple hd-ripple-${p.ripple.color}`}
								key={p.ripple.key}
							/>
						)}
						<span className="hd-proj-head">
							<span
								className={`hd-led${
									p.status === "down"
										? " hd-led-red"
										: p.status === "prov"
											? " hd-led-amber"
											: p.status === "off"
												? " hd-led-off"
												: ""
								}`}
							/>
							<span className="hd-proj-name">{p.name}</span>
						</span>
						<span className="hd-proj-chips">
							{p.picks.map((pk, i) => (
								<span
									className={`hd-chip${i < p.lit ? " hd-chip-lit" : ""}`}
									key={INTEGRATIONS[pk].id}
								>
									{INTEGRATIONS[pk].chip}
								</span>
							))}
						</span>
						<span className="hd-proj-state hd-etch">
							{p.status === "prov"
								? "WIRING…"
								: p.status === "down"
									? "DOWN"
									: p.status === "off"
										? "RETIRED"
										: "LIVE"}
						</span>
					</div>
				))}
				<div
					className={`hd-proj hd-plus${w.plusActive ? " hd-plus-active" : ""}`}
				>
					{w.plusRing && <span className="hd-ripple hd-ripple-green" />}
					<span className="hd-plus-sign">+</span>
					<span className="hd-plus-label">new project</span>
				</div>
			</div>

			{w.milestone ? <MilestoneSpot m={w.milestone} /> : <Spotlight w={w} />}

			{/* essentials: waitlist, traffic trend, MRR */}
			<div className="hd-tiles">
				<Tile
					etch="WAITLIST"
					num={fmt(w.waitlist)}
					ripple={w.spot.kind === "signups"}
				/>
				<div className="hd-tile">
					<span className="hd-etch">TRAFFIC</span>
					<div className="hd-tile-row">
						<span className="hd-tile-num">
							{fmt(Math.round(w.rate * 60))}/min
						</span>
						<span className="hd-trend">
							{w.trend.map((r, i) => (
								<span
									className="hd-trend-bar"
									// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length sample strip
									key={i}
									style={{
										height: `${Math.max(8, (r / Math.max(...w.trend, 1)) * 100)}%`,
									}}
								/>
							))}
						</span>
					</div>
				</div>
				<Tile
					etch="MRR"
					num={`€ ${fmt(w.mrr)}`}
					ripple={w.spot.kind === "payments" && w.toasts.length > 0}
				/>
			</div>
		</div>
	);
}

function Tile({
	etch,
	num,
	ripple,
}: {
	etch: string;
	num: string;
	ripple?: boolean;
}) {
	return (
		<div className="hd-tile">
			{ripple && <span className="hd-ripple hd-ripple-green" />}
			<span className="hd-etch">{etch}</span>
			<span className="hd-tile-num">{num}</span>
		</div>
	);
}

/* the milestone takes the spotlight as a story beat (#46) */
function MilestoneSpot({ m }: { m: Milestone }) {
	return (
		<div className="hd-spot hd-ms-spot" key={m.id}>
			<div className="hd-spot-head">
				<span className="hd-etch">MILESTONE · {m.etch}</span>
				<span className="hd-tag-amber">RECORD</span>
			</div>
			<span className="hd-ms-spot-big">
				<span className="hd-ms-star hd-ms-star-big">★</span>
				{m.big}
			</span>
			<span className="hd-spot-sub">{m.sub}</span>
		</div>
	);
}

function Spark({ trend }: { trend: number[] }) {
	const max = Math.max(...trend, 1);
	return (
		<div className="hd-spark">
			{trend.map((r, i) => (
				<span
					className="hd-spark-bar"
					// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length sample strip
					key={i}
					style={{ height: `${Math.max(4, (r / max) * 100)}%` }}
				/>
			))}
		</div>
	);
}

/* quiet state (#47): instead of an empty void, an ambient overview — every
   project humming, nothing demanding attention */
function QuietAmbient({ w }: { w: World }) {
	return (
		<div className="hd-spot hd-quiet" key="quiet">
			<div className="hd-spot-head">
				<span className="hd-etch">ALL QUIET</span>
				<span className="hd-tag-green">HEALTHY</span>
			</div>
			<div className="hd-qrows">
				{w.projects
					.filter((p) => p.status !== "out")
					.map((p) => (
						<div className="hd-qrow" key={p.name}>
							<span
								className={`hd-led${p.status === "off" ? " hd-led-off" : ""}`}
							/>
							<span className="hd-qrow-name">{p.name}</span>
							<span className="hd-qrow-val hd-num">
								{fmt(integ(VIEW_RATES[p.name] ?? [], w.t))} views
							</span>
							<span className="hd-qrow-state hd-etch">
								{p.status === "off" ? "ARCHIVED" : "OK"}
							</span>
						</div>
					))}
			</div>
			<span className="hd-spot-sub">nothing needs you — go build</span>
		</div>
	);
}

function Spotlight({ w }: { w: World }) {
	const s = w.spot;
	const nm = "proj" in s ? s.proj : "";

	if (s.kind === "empty") {
		return (
			<div className="hd-spot hd-spot-idle">
				<span className="hd-empty-led" />
				<span className="hd-spot-big">No projects yet</span>
				<span className="hd-spot-sub">
					one deploy wires everything — analytics, email, database, auth
				</span>
			</div>
		);
	}
	if (s.kind === "quiet") {
		return <QuietAmbient w={w} />;
	}
	if (s.kind === "wiring") {
		const picks = CH.find((c) => c.name === s.proj)?.picks ?? [];
		return (
			<div className="hd-spot hd-spot-mid" key={`w-${s.proj}`}>
				<div className="hd-spot-head">
					<span className="hd-etch">DEPLOYING</span>
					<span className="hd-tag-amber">WIRING</span>
				</div>
				<span className="hd-spot-big">{nm}</span>
				<span className="hd-spot-sub">
					{picks.map((i) => INTEGRATIONS[i].label.toLowerCase()).join(" · ")} —
					wired in one step
				</span>
			</div>
		);
	}
	if (s.kind === "live") {
		return (
			<div className="hd-spot hd-spot-mid" key={`l-${s.proj}`}>
				<div className="hd-spot-head">
					<span className="hd-etch">DEPLOYED</span>
					<span className="hd-tag-green">LIVE</span>
				</div>
				<span className="hd-spot-big">{nm}</span>
				<span className="hd-spot-sub">
					live — watched from this screen from here on
				</span>
			</div>
		);
	}
	if (s.kind === "trickle") {
		return (
			<div className="hd-spot" key="trickle">
				<div className="hd-spot-head">
					<span className="hd-etch">TRAFFIC</span>
					<span className="hd-tag-green">FIRST VISITORS</span>
				</div>
				<span className="hd-spot-big hd-num">
					{fmt(integ(VIEW_RATES["landing-page"], w.t))}
				</span>
				<Spark trend={w.trend} />
				<span className="hd-spot-sub">{nm} — someone's out there reading</span>
			</div>
		);
	}
	if (s.kind === "signups") {
		return (
			<div className="hd-spot hd-spot-mid" key="signups">
				<div className="hd-spot-head">
					<span className="hd-etch">WAITLIST</span>
					<span className="hd-tag-green">GROWING</span>
				</div>
				<span className="hd-spot-big hd-num">{fmt(w.waitlist)}</span>
				<span className="hd-spot-sub">
					{nm} — strangers trusting you with their email
				</span>
			</div>
		);
	}
	if (s.kind === "spike" || s.kind === "viral") {
		return (
			<div className="hd-spot hd-spot-viral" key={`${s.kind}-${s.proj}`}>
				<div className="hd-spot-head">
					<span className="hd-etch">
						{s.kind === "viral" ? "TRAFFIC · VIRAL" : "TRAFFIC · SPIKE"}
					</span>
					<span className="hd-tag-amber">SURGING</span>
				</div>
				<span className="hd-spot-big hd-num">
					{fmt(Math.round(w.rate * 60))}/min
				</span>
				<Spark trend={w.trend} />
				<span className="hd-spot-sub">
					{s.kind === "viral"
						? `${nm} — the launch tweet is everywhere`
						: `${nm} — your post landed`}
				</span>
			</div>
		);
	}
	if (s.kind === "multispike") {
		return (
			<div className="hd-spot hd-spot-viral" key="multi">
				<div className="hd-spot-head">
					<span className="hd-etch">TRAFFIC · ALL PROJECTS</span>
					<span className="hd-tag-amber">CLIMBING</span>
				</div>
				<span className="hd-spot-big hd-num">
					{fmt(Math.round(w.rate * 60))}/min
				</span>
				<Spark trend={w.trend} />
				<span className="hd-spot-sub">
					three projects surging — still one screen
				</span>
			</div>
		);
	}
	if (s.kind === "down") {
		return (
			<div className="hd-spot hd-spot-down hd-spot-mid" key="down">
				<div className="hd-spot-head">
					<span className="hd-etch">HEALTH</span>
					<span className="hd-tag-red">DOWN</span>
				</div>
				<span className="hd-spot-big">{nm} not responding</span>
				<span className="hd-spot-sub">
					caught in 3s — no angry DMs, no refund requests
				</span>
			</div>
		);
	}
	if (s.kind === "recovered") {
		return (
			<div className="hd-spot hd-spot-mid" key="recovered">
				<div className="hd-spot-head">
					<span className="hd-etch">HEALTH</span>
					<span className="hd-tag-green">RECOVERED</span>
				</div>
				<span className="hd-spot-big">{nm} is back</span>
				<span className="hd-spot-sub">downtime 2s — nobody ever knew</span>
			</div>
		);
	}
	if (s.kind === "retired") {
		return (
			<div className="hd-spot hd-spot-idle hd-spot-mid" key="retired">
				<div className="hd-spot-head">
					<span className="hd-etch">FLEET</span>
					<span className="hd-tag-dim">RETIRED</span>
				</div>
				<span className="hd-spot-big">{nm} archived</span>
				<span className="hd-spot-sub">
					it did its job — its integrations keep running for the rest
				</span>
			</div>
		);
	}
	// payments
	return (
		<div className="hd-spot" key="payments">
			<div className="hd-spot-head">
				<span className="hd-etch">PAYMENTS</span>
				<span className="hd-tag-green">+€ {fmt(w.mrr)}</span>
			</div>
			<div className="hd-toasts">
				{w.toasts.map((toast) => (
					<div className="hd-toast" key={toast.id}>
						<span className="hd-toast-amt">€ {toast.amt}</span>
						<span className="hd-toast-proj">{nm}</span>
						<span className="hd-toast-label">{toast.label}</span>
					</div>
				))}
			</div>
			<span className="hd-spot-sub">
				first € on your own server — MRR starts here
			</span>
		</div>
	);
}
