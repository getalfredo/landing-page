// PROTOTYPE — throwaway (wayfinder #26, round 3). Overlay layout won, calm
// pace locked. The loop is now a pure function of time — worldAt(t) — driven
// by one rAF clock, which makes the new draggable progress bar (with chapter
// markers, YouTube-style) exact: scrubbing and marker-jumps replay any moment.
// Story (operator's script):
//   1 landing-page     analytics+email            → mild traffic
//   2 geo-monitor      analytics+db+auth          → signups; landing-page spikes
//   3 growth-automator analytics+email+db+auth    → spikes on all three; health
//                                                   issue, then resolved
//   4 content-factory  everything                 → landing-page retired; slow
//                                                   start, viral link, payments
//   teardown: projects leave one by one → empty state → loop
// Analytics is always on by default; the projects row carries an "+ new"
// control the ghost click hits; the form overlay lives on the RIGHT and
// hides quickly after a deploy. Dashboard essentials: WAITLIST · TRAFFIC
// (trend) · MRR. Axes left: view = desktop | mobile (?hv2=1, dev only).
//
// Wayfinder #46 adds METRIC MILESTONES on a second axis (?ms=). Crossing
// times are derived from the same rate integrals by bisection, so the
// celebrations stay a pure function of t. Three treatments:
//   stamp  — celebrate at the metric source: tile flashes, keeps an etched pin
//   beat   — milestone takes over the spotlight; records marked on the scrubber
//   ledger — a record strip above the tiles prints each milestone, keeps count
// Waitlist rates ×2 vs #26 so the loop closes on a "100 on the waitlist" beat.
//
// Wayfinder #47 (this round) adds a STORY axis (?story=v1|v2). The timeline
// skeleton is shared; v2 swaps the cast for real-feeling indie SaaS names,
// rewrites the spotlight copy for aspiration + relief, and turns on the
// legibility choreography (staggered spot reveal, attention sweep, source-
// card focus link, ambient ALL QUIET overview). Applied to BOTH stories as
// fold-in rules: incident spots preempt milestone celebrations (blackout
// around the DOWN window), and the #53 local-time etch + --tod-glow.
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { consoleCssVars } from "#/components/landing/console-vars";
import { useLocalTime } from "#/components/landing/local-time";
import "#/components/prototype/hero-demo-v2.css";

/* ---------------------------------------------------------------- axes -- */

export type Hv2Axes = {
	view: "desktop" | "mobile";
	ms: "off" | "stamp" | "beat" | "ledger";
	story: "v1" | "v2";
};
type Story = Hv2Axes["story"];

const AXIS_OPTIONS = {
	view: ["desktop", "mobile"],
	ms: ["off", "stamp", "beat", "ledger"],
	story: ["v1", "v2"],
} as const;
const DEFAULT_AXES: Hv2Axes = { view: "desktop", ms: "beat", story: "v2" };

export function useHeroV2(): [Hv2Axes | null, (a: Hv2Axes | null) => void] {
	const [axes, setAxes] = useState<Hv2Axes | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		if (!q.has("hv2")) return;
		const v = q.get("view");
		const m = q.get("ms");
		const s = q.get("story");
		setAxes({
			view: v === "mobile" ? "mobile" : DEFAULT_AXES.view,
			ms: (AXIS_OPTIONS.ms as readonly string[]).includes(m ?? "")
				? (m as Hv2Axes["ms"])
				: DEFAULT_AXES.ms,
			story: s === "v1" ? "v1" : DEFAULT_AXES.story,
		});
	}, []);

	const update = (a: Hv2Axes | null) => {
		setAxes(a);
		const q = new URLSearchParams(window.location.search);
		if (a === null) {
			for (const k of ["hv2", "view", "ms", "story"]) q.delete(k);
		} else {
			q.set("hv2", "1");
			q.set("view", a.view);
			q.set("ms", a.ms);
			q.set("story", a.story);
		}
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [axes, update];
}

/* ----------------------------------------------------------- the story -- */

// Order per operator: analytics first and always preselected.
const INTEGRATIONS = [
	{ id: "analytics", label: "Analytics", spec: "on your server", chip: "AN" },
	{ id: "email", label: "Email", spec: "transactional", chip: "EM" },
	{ id: "db", label: "Database", spec: "live data", chip: "DB" },
	{ id: "auth", label: "Auth", spec: "sessions, oauth", chip: "AU" },
	{ id: "payments", label: "Payments", spec: "checkout + billing", chip: "PA" },
];

const CAST = [
	{ name: "landing-page", picks: [0, 1], dwell: 2.4 },
	{ name: "geo-monitor", picks: [0, 2, 3], dwell: 5.4 },
	{ name: "growth-automator", picks: [0, 1, 2, 3], dwell: 6.8 },
	{ name: "content-factory", picks: [0, 1, 2, 3, 4], dwell: 8.6 },
];

// #47 story v2 cast: real-feeling indie SaaS someone wishes they were
// running. Same timeline skeleton (keyed on v1 names), display-mapped here.
//   landing-page — kept: it's literally what the visitor is on, and it earns
//                  its retirement beat ("did its job")
//   shipnote     — changelogs for indie apps (signups chapter)
//   cronpilot    — cron jobs with a pulse (spike + incident chapter)
//   snapkit      — screenshot API (slow start → viral → first revenue)
const CAST_V2 = ["landing-page", "shipnote", "cronpilot", "snapkit"];
const NAME_V2 = new Map(CAST.map((c, i) => [c.name, CAST_V2[i]]));
const dn = (proj: string, story: Story) =>
	story === "v2" ? (NAME_V2.get(proj) ?? proj) : proj;

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
		let sel = typeAt + c.name.length * 0.045 + 0.3;
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
	"geo-monitor": [
		[CH[1].liveAt, MULTI[0], 1.8],
		[MULTI[0], DOWN[0], 18],
		[DOWN[1], QUIET_AT, 3],
	],
	"growth-automator": [
		[CH[2].liveAt, MULTI[1], 26],
		[MULTI[1], QUIET_AT, 3.2],
	],
	"content-factory": [
		[CH[3].liveAt, VIRAL_AT, 0.9],
		[VIRAL_AT, VIRAL_END, 55],
		[VIRAL_END, QUIET_AT, 16],
	],
};

// ×2 vs #26 so "100 on the waitlist" crosses before teardown (#46)
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
	pin: string; // short record label (stamp pins, ledger lines)
	sub: Record<Story, string>;
	tile: "waitlist" | "traffic" | "mrr" | "row";
};

const CEL_LEN = 2.6; // seconds a celebration holds

const MILESTONE_DEFS: Omit<Milestone, "celAt" | "celEnd">[] = [
	{
		id: "v100",
		at: crossT(viewsRaw, 100),
		etch: "TRAFFIC",
		big: "100th visitor",
		pin: "100 VISITS",
		sub: {
			v1: "counted across every project",
			v2: "counted across every project",
		},
		tile: "traffic",
	},
	{
		id: "p3",
		at: CH[2].liveAt,
		etch: "PROJECTS",
		big: "3 projects live",
		pin: "3 LIVE",
		sub: {
			v1: "one HQ watching all of them",
			v2: "one HQ watching all of them",
		},
		tile: "row",
	},
	{
		id: "wl50",
		at: crossT(waitRaw, 50),
		etch: "WAITLIST",
		big: "50 on the waitlist",
		pin: "50 SIGNUPS",
		sub: {
			v1: "geo-monitor keeps signing them up",
			v2: "shipnote keeps signing them up",
		},
		tile: "waitlist",
	},
	{
		id: "eur1",
		at: PAYMENTS[0].at,
		etch: "REVENUE",
		big: "First € earned",
		pin: "FIRST €",
		sub: {
			v1: "content-factory · checkout completed",
			v2: "snapkit · checkout completed",
		},
		tile: "mrr",
	},
	{
		id: "wl100",
		at: crossT(waitRaw, 100),
		etch: "WAITLIST",
		big: "100 on the waitlist",
		pin: "100 SIGNUPS",
		sub: {
			v1: "the hundredth signup, counted live",
			v2: "the hundredth signup, counted live",
		},
		tile: "waitlist",
	},
];

const MILESTONES: Milestone[] = MILESTONE_DEFS.filter((m) =>
	Number.isFinite(m.at),
)
	.sort((a, b) => a.at - b.at)
	.map((m) => ({ ...m, celAt: m.at, celEnd: m.at + CEL_LEN }));

// #47 fold-in rule: incident spots preempt milestone celebrations. No
// celebration window may overlap the DOWN→RECOVERED drama; one that is
// already running gets CUT when the incident lands (which reads as the
// incident stealing the spotlight — deliberate), one that would start
// inside it waits the incident out.
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

type Mile = {
	reached: Milestone[]; // crossed at time t (resets with the loop)
	active: Milestone | null; // celebration window containing t
	frac: number; // 0..1 through the active window
};

function mileAt(t: number): Mile {
	const reached = MILESTONES.filter((m) => m.at <= t);
	const active = MILESTONES.find((m) => t >= m.celAt && t < m.celEnd) ?? null;
	return {
		reached,
		active,
		frac: active ? (t - active.celAt) / CEL_LEN : 0,
	};
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
	mile: Mile;
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
		mile: mileAt(t),
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

function Hv2Engine({ axes }: { axes: Hv2Axes }) {
	const [now, setNow] = useState(0);
	const origin = useRef(0);
	const vertical = axes.view === "mobile";
	// #53 fold-in: the visitor's real wall clock on the bezel, and a glow
	// multiplier that brightens the LEDs after dark.
	const { hhmm, glow } = useLocalTime();

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			// static composed frame: mid-story, three projects, surge visible;
			// the scrubber still works — each click is a discrete jump
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

	// the axis bar lives outside the engine; jump requests arrive as events
	useEffect(() => {
		const onJump = (e: Event) => {
			const t = (e as CustomEvent<number>).detail;
			origin.current = performance.now() / 1000 - t;
			setNow(t);
		};
		window.addEventListener("hv2-jump", onJump);
		return () => window.removeEventListener("hv2-jump", onJump);
	}, []);

	const w = worldAt(now);

	return (
		<section
			className={`hv2-bezel${vertical ? " hv2-mobile" : ""}${
				axes.story === "v2" ? " hv2-s2" : ""
			}`}
			aria-label="Alfredo HQ demo (prototype v2)"
			style={{ ...consoleCssVars, "--tod-glow": glow } as CSSProperties}
		>
			<div className="hv2-btop">
				<span className="hv2-etch">ALFREDO OS 0.1</span>
				<span className="hv2-etch">HQ / LIVE</span>
				<span className="hv2-etch">{hhmm ?? "--:--"}</span>
			</div>

			<div className={`hv2-glass${vertical ? " hv2-vert" : ""}`}>
				<div className="hv2-full">
					<Dash w={w} ms={axes.ms} story={axes.story} />
					<div
						className={`hv2-sheet${w.form ? " hv2-sheet-in" : ""}`}
						aria-hidden={!w.form}
					>
						{w.form && <DeployForm form={w.form} story={axes.story} />}
					</div>
				</div>
			</div>

			{/* the bottom cap: full-width scrubber, chapter titles underneath */}
			<ProgressBar
				now={now}
				onSeek={seek}
				chapter={w.chapter}
				markers={axes.ms === "beat"}
				story={axes.story}
			/>
		</section>
	);
}

/* -------------------------------------------------------- progress bar -- */

function ProgressBar({
	now,
	onSeek,
	chapter,
	markers,
	story,
}: {
	now: number;
	onSeek: (t: number) => void;
	chapter: number;
	markers: boolean;
	story: Story;
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

	const active = chapter >= 0 ? CH[chapter].name : null;

	return (
		<div className="hv2-progress">
			{/* mouse-only scrubber this round */}
			<div className="hv2-track" ref={trackRef} onPointerDown={onPointerDown}>
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
							className="hv2-seg-wrap"
							key={`${seg.from}`}
							style={{ flexGrow: segLen }}
						>
							<div className="hv2-seg-track">
								<div className="hv2-seg-fill" style={{ width: `${fill}%` }} />
							</div>
							<span
								className={`hv2-seg-title hv2-etch${
									seg.label && seg.label === active ? " hv2-seg-title-on" : ""
								}`}
							>
								{seg.label && dn(seg.label, story)}
							</span>
						</div>
					);
				})}
				{/* beat variant: record markers, youtube key-moment style */}
				{markers &&
					MILESTONES.map((m) => (
						<span
							className={`hv2-ms-mark${now >= m.at ? " hv2-ms-mark-hit" : ""}`}
							key={m.id}
							style={{ left: `${(m.at / TOTAL) * 100}%` }}
							title={m.big}
							aria-hidden="true"
						/>
					))}
			</div>
		</div>
	);
}

/* --------------------------------------------------------- the form ---- */

function DeployForm({
	form,
	story,
}: {
	form: NonNullable<World["form"]>;
	story: Story;
}) {
	// the timeline types at v1-name speed; a shorter v2 name just finishes
	// its typing early, which reads as a natural pause before the picks
	const shown = dn(form.name, story);
	return (
		<div className={`hv2-form hv2-form-${form.phase}`}>
			<div className="hv2-form-head">
				<span className="hv2-etch">NEW PROJECT</span>
				<span
					className={`hv2-led${form.phase === "sent" ? " hv2-led-amber" : ""}`}
					aria-hidden="true"
				/>
			</div>

			<div className="hv2-field">
				<span className="hv2-field-label">Project name</span>
				<span className="hv2-input">
					{shown.slice(0, form.typed)}
					{form.phase === "filling" && form.typed < shown.length && (
						<span className="hv2-caret" aria-hidden="true" />
					)}
				</span>
			</div>

			<span className="hv2-field-label">Integrations</span>
			<div className="hv2-intcards">
				{INTEGRATIONS.map((it, i) => {
					const on = form.checked.has(i);
					return (
						<div
							className={`hv2-intcard${on ? " hv2-intcard-on" : ""}`}
							key={it.id}
						>
							<span className="hv2-intbox" aria-hidden="true">
								{on ? "✓" : ""}
							</span>
							<span className="hv2-intname">{it.label}</span>
							<span className="hv2-intspec">
								{i === 0 ? "always on" : it.spec}
							</span>
							{form.ring === i && (
								<span className="hv2-ring" aria-hidden="true" />
							)}
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

function Dash({ w, ms, story }: { w: World; ms: Hv2Axes["ms"]; story: Story }) {
	const { reached, active } = w.mile;
	// stamp variant: which tile is celebrating right now, which pins it keeps
	const celTile = ms === "stamp" && active ? active.tile : null;
	const pinsFor = (tile: Milestone["tile"]) =>
		ms === "stamp"
			? reached.filter((m) => m.tile === tile).map((m) => m.pin)
			: [];
	const rowMile = reached.find((m) => m.tile === "row");
	// #47 v2 legibility: the project card the spotlight is talking about
	// lights a focus link, so the eye connects card ↔ story
	const focus =
		story === "v2" && !(ms === "beat" && active) && "proj" in w.spot
			? w.spot.proj
			: null;
	return (
		<div className="hv2-dash">
			{/* thin fixed top row: every project + the add-new control */}
			<div className="hv2-toprow">
				{w.projects.map((p) => (
					<div
						className={`hv2-proj hv2-proj-${p.status}${
							p.name === focus ? " hv2-proj-focus" : ""
						}`}
						key={p.name}
					>
						{p.ripple && (
							<span
								className={`hv2-ripple hv2-ripple-${p.ripple.color}`}
								key={p.ripple.key}
								aria-hidden="true"
							/>
						)}
						<span className="hv2-proj-head">
							<span
								className={`hv2-led${
									p.status === "down"
										? " hv2-led-red"
										: p.status === "prov"
											? " hv2-led-amber"
											: p.status === "off"
												? " hv2-led-off"
												: ""
								}`}
								aria-hidden="true"
							/>
							<span className="hv2-proj-name">{dn(p.name, story)}</span>
						</span>
						<span className="hv2-proj-chips">
							{p.picks.map((pk, i) => (
								<span
									className={`hv2-chip${i < p.lit ? " hv2-chip-lit" : ""}`}
									key={INTEGRATIONS[pk].id}
								>
									{INTEGRATIONS[pk].chip}
								</span>
							))}
						</span>
						<span className="hv2-proj-state hv2-etch">
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
					className={`hv2-proj hv2-plus${w.plusActive ? " hv2-plus-active" : ""}`}
				>
					{w.plusRing && (
						<span className="hv2-ripple hv2-ripple-green" aria-hidden="true" />
					)}
					<span className="hv2-plus-sign" aria-hidden="true">
						+
					</span>
					<span className="hv2-plus-label">new project</span>
				</div>
				{/* stamp variant: the fleet-size record pins onto the row itself */}
				{ms === "stamp" && rowMile && (
					<div
						className={`hv2-ms-rowpin${
							celTile === "row" ? " hv2-ms-cele" : ""
						}`}
					>
						<span className="hv2-ms-star" aria-hidden="true">
							★
						</span>
						<span className="hv2-etch">{rowMile.pin}</span>
					</div>
				)}
			</div>

			{ms === "beat" && active ? (
				<MilestoneSpot m={active} story={story} />
			) : (
				<Spotlight w={w} story={story} />
			)}

			{ms === "ledger" && <MsLedger w={w} />}

			{/* essentials: waitlist, traffic trend, MRR */}
			<div className="hv2-tiles">
				<Tile
					etch="WAITLIST"
					num={fmt(w.waitlist)}
					ripple={w.spot.kind === "signups"}
					pins={pinsFor("waitlist")}
					cele={celTile === "waitlist"}
				/>
				<div
					className={`hv2-tile${celTile === "traffic" ? " hv2-ms-cele" : ""}`}
				>
					{celTile === "traffic" && (
						<span className="hv2-ripple hv2-ripple-amber" aria-hidden="true" />
					)}
					<span className="hv2-etch">TRAFFIC</span>
					<div className="hv2-tile-row">
						<span className="hv2-tile-num">
							{fmt(Math.round(w.rate * 60))}/min
						</span>
						<span className="hv2-trend" aria-hidden="true">
							{w.trend.map((r, i) => (
								<span
									className="hv2-trend-bar"
									// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length sample strip
									key={i}
									style={{
										height: `${Math.max(8, (r / Math.max(...w.trend, 1)) * 100)}%`,
									}}
								/>
							))}
						</span>
					</div>
					<Pins pins={pinsFor("traffic")} />
				</div>
				<Tile
					etch="MRR"
					num={`€ ${fmt(w.mrr)}`}
					ripple={w.spot.kind === "payments" && w.toasts.length > 0}
					pins={pinsFor("mrr")}
					cele={celTile === "mrr"}
				/>
			</div>
		</div>
	);
}

function Tile({
	etch,
	num,
	ripple,
	warn,
	pins = [],
	cele,
}: {
	etch: string;
	num: string;
	ripple?: boolean;
	warn?: boolean;
	pins?: string[];
	cele?: boolean;
}) {
	return (
		<div
			className={`hv2-tile${warn ? " hv2-tile-warn" : ""}${cele ? " hv2-ms-cele" : ""}`}
		>
			{ripple && (
				<span className="hv2-ripple hv2-ripple-green" aria-hidden="true" />
			)}
			{cele && (
				<span className="hv2-ripple hv2-ripple-amber" aria-hidden="true" />
			)}
			<span className="hv2-etch">{etch}</span>
			<span className="hv2-tile-num">{num}</span>
			<Pins pins={pins} />
		</div>
	);
}

/* stamp variant: etched record pins a tile keeps after the flash */
function Pins({ pins }: { pins: string[] }) {
	if (pins.length === 0) return null;
	return (
		<span className="hv2-ms-pins">
			{pins.map((p) => (
				<span className="hv2-ms-pin" key={p}>
					<span className="hv2-ms-star" aria-hidden="true">
						★
					</span>
					{p}
				</span>
			))}
		</span>
	);
}

/* beat variant: the milestone takes the spotlight as a story beat */
function MilestoneSpot({ m, story }: { m: Milestone; story: Story }) {
	return (
		<div className="hv2-spot hv2-ms-spot" key={m.id}>
			<div className="hv2-spot-head">
				<span className="hv2-etch">MILESTONE · {m.etch}</span>
				<span className="hv2-tag-amber">RECORD</span>
			</div>
			<span className="hv2-ms-spot-big">
				<span className="hv2-ms-star hv2-ms-star-big" aria-hidden="true">
					★
				</span>
				{m.big}
			</span>
			<span className="hv2-spot-sub">{m.sub[story]}</span>
		</div>
	);
}

/* ledger variant: a record strip that prints each milestone and keeps count */
function MsLedger({ w }: { w: World }) {
	const { reached, active } = w.mile;
	const latest = active ?? reached[reached.length - 1] ?? null;
	// typewriter while celebrating; settled etch afterwards
	const line = latest
		? active
			? latest.big.slice(
					0,
					Math.max(0, Math.floor((w.t - active.celAt) / 0.045)),
				)
			: latest.big
		: "";
	return (
		<div className={`hv2-ms-strip${active ? " hv2-ms-cele" : ""}`}>
			<span className="hv2-etch">RECORDS</span>
			<span className={`hv2-ms-line${active ? " hv2-ms-line-hot" : ""}`}>
				{latest ? (
					<>
						<span className="hv2-ms-star" aria-hidden="true">
							★
						</span>
						{line}
						{active && <span className="hv2-caret" aria-hidden="true" />}
					</>
				) : (
					<span className="hv2-ms-line-idle">none yet — keep shipping</span>
				)}
			</span>
			<span className="hv2-ms-pips" aria-hidden="true">
				{MILESTONES.map((m) => (
					<span
						className={`hv2-ms-pip${
							reached.includes(m) ? " hv2-ms-pip-on" : ""
						}`}
						key={m.id}
					/>
				))}
			</span>
		</div>
	);
}

function Spark({ trend }: { trend: number[] }) {
	const max = Math.max(...trend, 1);
	return (
		<div className="hv2-spark" aria-hidden="true">
			{trend.map((r, i) => (
				<span
					className="hv2-spark-bar"
					// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length sample strip
					key={i}
					style={{ height: `${Math.max(4, (r / max) * 100)}%` }}
				/>
			))}
		</div>
	);
}

/* v2 quiet state: instead of an empty void, an ambient overview — every
   project humming, nothing demanding attention. Quiet life fills the space
   the #26 round flagged as dead. */
function QuietAmbient({ w, story }: { w: World; story: Story }) {
	return (
		<div className="hv2-spot hv2-quiet2" key="quiet2">
			<div className="hv2-spot-head">
				<span className="hv2-etch">ALL QUIET</span>
				<span className="hv2-tag-green">HEALTHY</span>
			</div>
			<div className="hv2-qrows">
				{w.projects
					.filter((p) => p.status !== "out")
					.map((p) => (
						<div className="hv2-qrow" key={p.name}>
							<span
								className={`hv2-led${p.status === "off" ? " hv2-led-off" : ""}`}
								aria-hidden="true"
							/>
							<span className="hv2-qrow-name">{dn(p.name, story)}</span>
							<span className="hv2-qrow-val hv2-num">
								{fmt(integ(VIEW_RATES[p.name] ?? [], w.t))} views
							</span>
							<span className="hv2-qrow-state hv2-etch">
								{p.status === "off" ? "ARCHIVED" : "OK"}
							</span>
						</div>
					))}
			</div>
			<span className="hv2-spot-sub">nothing needs you — go build</span>
		</div>
	);
}

function Spotlight({ w, story }: { w: World; story: Story }) {
	const s = w.spot;
	const v2 = story === "v2";
	// v2 legibility: text-only spots cluster their content mid-panel instead
	// of stretching headline and sub to opposite edges
	const mid = v2 ? " hv2-spot-mid" : "";
	const nm = "proj" in s ? dn(s.proj, story) : "";

	if (s.kind === "empty") {
		return (
			<div className="hv2-spot hv2-spot-idle">
				<span className="hv2-empty-led" aria-hidden="true" />
				<span className="hv2-spot-big">No projects yet</span>
				<span className="hv2-spot-sub">
					{v2
						? "one deploy wires everything — analytics, email, database, auth"
						: "Create your first project — everything gets wired for you."}
				</span>
			</div>
		);
	}
	if (s.kind === "quiet") {
		if (v2) return <QuietAmbient w={w} story={story} />;
		return (
			<div className="hv2-spot hv2-spot-idle">
				<span className="hv2-etch">ALL QUIET</span>
				<span className="hv2-spot-sub">nothing needs you</span>
			</div>
		);
	}
	if (s.kind === "wiring") {
		const picks = CH.find((c) => c.name === s.proj)?.picks ?? [];
		return (
			<div className={`hv2-spot${mid}`} key={`w-${s.proj}`}>
				<div className="hv2-spot-head">
					<span className="hv2-etch">DEPLOYING</span>
					<span className="hv2-tag-amber">WIRING</span>
				</div>
				<span className="hv2-spot-big">{nm}</span>
				<span className="hv2-spot-sub">
					{v2
						? `${picks
								.map((i) => INTEGRATIONS[i].label.toLowerCase())
								.join(" · ")} — wired in one step`
						: "integrations coming online…"}
				</span>
			</div>
		);
	}
	if (s.kind === "live") {
		return (
			<div className={`hv2-spot${mid}`} key={`l-${s.proj}`}>
				<div className="hv2-spot-head">
					<span className="hv2-etch">DEPLOYED</span>
					<span className="hv2-tag-green">LIVE</span>
				</div>
				<span className="hv2-spot-big">{nm}</span>
				<span className="hv2-spot-sub">
					{v2
						? "live — watched from this screen from here on"
						: "wired and watched from here on"}
				</span>
			</div>
		);
	}
	if (s.kind === "trickle") {
		return (
			<div className="hv2-spot" key="trickle">
				<div className="hv2-spot-head">
					<span className="hv2-etch">TRAFFIC</span>
					<span className="hv2-tag-green">FIRST VISITORS</span>
				</div>
				<span className="hv2-spot-big hv2-num">
					{fmt(integ(VIEW_RATES["landing-page"], w.t))}
				</span>
				<Spark trend={w.trend} />
				<span className="hv2-spot-sub">
					{v2
						? `${nm} — someone's out there reading`
						: `${nm} — a steady trickle`}
				</span>
			</div>
		);
	}
	if (s.kind === "signups") {
		return (
			<div className={`hv2-spot${mid}`} key="signups">
				<div className="hv2-spot-head">
					<span className="hv2-etch">WAITLIST</span>
					<span className="hv2-tag-green">GROWING</span>
				</div>
				<span className="hv2-spot-big hv2-num">{fmt(w.waitlist)}</span>
				<span className="hv2-spot-sub">
					{v2
						? `${nm} — strangers trusting you with their email`
						: `${nm} — signups rolling in`}
				</span>
			</div>
		);
	}
	if (s.kind === "spike" || s.kind === "viral") {
		return (
			<div className="hv2-spot hv2-spot-viral" key={`${s.kind}-${s.proj}`}>
				<div className="hv2-spot-head">
					<span className="hv2-etch">
						{s.kind === "viral" ? "TRAFFIC · VIRAL" : "TRAFFIC · SPIKE"}
					</span>
					<span className="hv2-tag-amber">SURGING</span>
				</div>
				<span className="hv2-spot-big hv2-num">
					{fmt(Math.round(w.rate * 60))}/min
				</span>
				<Spark trend={w.trend} />
				<span className="hv2-spot-sub">
					{s.kind === "viral"
						? v2
							? `${nm} — the launch tweet is everywhere`
							: `${nm} — the link is everywhere`
						: v2
							? `${nm} — your post landed`
							: `${nm} — traffic spike`}
				</span>
			</div>
		);
	}
	if (s.kind === "multispike") {
		return (
			<div className="hv2-spot hv2-spot-viral" key="multi">
				<div className="hv2-spot-head">
					<span className="hv2-etch">TRAFFIC · ALL PROJECTS</span>
					<span className="hv2-tag-amber">CLIMBING</span>
				</div>
				<span className="hv2-spot-big hv2-num">
					{fmt(Math.round(w.rate * 60))}/min
				</span>
				<Spark trend={w.trend} />
				<span className="hv2-spot-sub">
					{v2
						? "three projects surging — still one screen"
						: "three projects, one surge"}
				</span>
			</div>
		);
	}
	if (s.kind === "down") {
		return (
			<div className={`hv2-spot hv2-spot-down${mid}`} key="down">
				<div className="hv2-spot-head">
					<span className="hv2-etch">HEALTH</span>
					<span className="hv2-tag-red">DOWN</span>
				</div>
				<span className="hv2-spot-big">{nm} not responding</span>
				<span className="hv2-spot-sub">
					{v2
						? "caught in 3s — no angry DMs, no refund requests"
						: "caught in 3s — before the first user noticed"}
				</span>
			</div>
		);
	}
	if (s.kind === "recovered") {
		return (
			<div className={`hv2-spot${mid}`} key="recovered">
				<div className="hv2-spot-head">
					<span className="hv2-etch">HEALTH</span>
					<span className="hv2-tag-green">RECOVERED</span>
				</div>
				<span className="hv2-spot-big">{nm} is back</span>
				<span className="hv2-spot-sub">
					{v2
						? "downtime 2s — nobody ever knew"
						: "downtime 2s · you'd have been pinged"}
				</span>
			</div>
		);
	}
	if (s.kind === "retired") {
		return (
			<div className={`hv2-spot hv2-spot-idle${mid}`} key="retired">
				<div className="hv2-spot-head">
					<span className="hv2-etch">FLEET</span>
					<span className="hv2-tag-dim">RETIRED</span>
				</div>
				<span className="hv2-spot-big">{nm} archived</span>
				<span className="hv2-spot-sub">
					{v2
						? "it did its job — its integrations keep running for the rest"
						: "its job is done — the integrations keep running for the rest"}
				</span>
			</div>
		);
	}
	// payments
	return (
		<div className="hv2-spot" key="payments">
			<div className="hv2-spot-head">
				<span className="hv2-etch">PAYMENTS</span>
				<span className="hv2-tag-green">+€ {fmt(w.mrr)}</span>
			</div>
			<div className="hv2-toasts">
				{w.toasts.map((toast) => (
					<div className="hv2-toast" key={toast.id}>
						<span className="hv2-toast-amt">€ {toast.amt}</span>
						<span className="hv2-toast-proj">{nm}</span>
						<span className="hv2-toast-label">{toast.label}</span>
					</div>
				))}
			</div>
			<span className="hv2-spot-sub">
				{v2
					? "first € on your own server — MRR starts here"
					: "first revenue — MRR starts here"}
			</span>
		</div>
	);
}

/* ----------------------------------------------------- switcher bar ---- */

function Hv2Bar({
	axes,
	onAxes,
}: {
	axes: Hv2Axes;
	onAxes: (a: Hv2Axes | null) => void;
}) {
	return (
		<div className="hv2-bar" style={consoleCssVars}>
			<div className="hv2-bar-group">
				<span className="hv2-bar-label">VIEW</span>
				{AXIS_OPTIONS.view.map((opt) => (
					<button
						type="button"
						key={opt}
						className={`hv2-bar-btn${axes.view === opt ? " hv2-bar-on" : ""}`}
						onClick={() => onAxes({ ...axes, view: opt })}
					>
						{opt}
					</button>
				))}
			</div>
			<div className="hv2-bar-group">
				<span className="hv2-bar-label">STORY</span>
				{AXIS_OPTIONS.story.map((opt) => (
					<button
						type="button"
						key={opt}
						className={`hv2-bar-btn${axes.story === opt ? " hv2-bar-on" : ""}`}
						onClick={() => onAxes({ ...axes, story: opt })}
					>
						{opt}
					</button>
				))}
			</div>
			<div className="hv2-bar-group">
				<span className="hv2-bar-label">MILESTONES</span>
				{AXIS_OPTIONS.ms.map((opt) => (
					<button
						type="button"
						key={opt}
						className={`hv2-bar-btn${axes.ms === opt ? " hv2-bar-on" : ""}`}
						onClick={() => onAxes({ ...axes, ms: opt })}
					>
						{opt}
					</button>
				))}
			</div>
			<div className="hv2-bar-group">
				<span className="hv2-bar-label">JUMP</span>
				{MILESTONES.map((m) => (
					<button
						type="button"
						key={m.id}
						className="hv2-bar-btn"
						title={m.big}
						onClick={() =>
							window.dispatchEvent(
								new CustomEvent("hv2-jump", {
									detail: Math.max(0, m.celAt - 0.7),
								}),
							)
						}
					>
						★ {m.pin.toLowerCase()}
					</button>
				))}
			</div>
			<button
				type="button"
				className="hv2-bar-btn hv2-bar-exit"
				onClick={() => onAxes(null)}
			>
				✕ exit
			</button>
		</div>
	);
}

export function HeroDemoV2({
	axes,
	onAxes,
}: {
	axes: Hv2Axes;
	onAxes: (a: Hv2Axes | null) => void;
}) {
	return (
		<>
			<Hv2Engine key={axes.view} axes={axes} />
			<Hv2Bar axes={axes} onAxes={onAxes} />
		</>
	);
}
