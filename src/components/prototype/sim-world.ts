// PROTOTYPE — throwaway (wayfinder #42, gamified sim). ONE world model for
// both modes: the ambient collapse loop in Every day after (attract — a
// director script dispatches the same actions a player would) and the
// fullscreen playable sim (guided 8-beat spine, then free play). The
// with/without toggle re-renders the SAME state: one HQ, or one nameless
// pane per (project × tray) — the pane count is the scoreboard.
// Remove with sim-pass.tsx / sim-pass.css.

export type TrayId =
	| "analytics"
	| "email"
	| "db"
	| "auth"
	| "payments"
	| "errors"
	| "uptime";

// With-side may etch the real truth-list providers (#40 boundary ruling);
// the without-side panes stay nameless — tray label + project only.
export const TRAYS: {
	id: TrayId;
	label: string;
	provider: string;
	chip: string;
	implicit?: boolean;
}[] = [
	{ id: "analytics", label: "Analytics", provider: "Umami", chip: "AN" },
	{ id: "email", label: "Email", provider: "Postmark", chip: "EM" },
	{ id: "db", label: "Database", provider: "Convex", chip: "DB" },
	{ id: "auth", label: "Auth", provider: "Better-Auth", chip: "AU" },
	{ id: "payments", label: "Payments", provider: "Creem", chip: "PA" },
	{
		id: "errors",
		label: "Errors",
		provider: "Sentry",
		chip: "ER",
		implicit: true,
	},
	{
		id: "uptime",
		label: "Uptime",
		provider: "Uptime Kuma",
		chip: "UP",
		implicit: true,
	},
];

export const PICKABLE = TRAYS.filter((t) => !t.implicit);
export const IMPLICIT = TRAYS.filter((t) => t.implicit).map((t) => t.id);

export const trayOf = (id: TrayId) =>
	TRAYS.find((t) => t.id === id) ?? TRAYS[0];

/* ------------------------------------------------------------- beats ---- */

// The guided spine (~8 player-performed beats incl. dive-in + CTA card).
// `hot` names the surface the amber hot-key treatment attaches to.
export const BEATS = [
	{
		id: "deploy-1",
		hot: "deploy",
		prompt:
			"Deploy your first project. Two trays are picked — errors and uptime come standard.",
	},
	{
		id: "incident-1",
		hot: "incident",
		prompt: "Something broke already. Catch it from here. One click.",
	},
	{
		id: "deploy-2",
		hot: "plus",
		prompt:
			"Ship another one. Watch the trays this time — anything already running is reused.",
	},
	{
		id: "toggle-out",
		hot: "toggle",
		prompt: "Same projects, same day — now without Alfredo. Flip it.",
	},
	{
		id: "without",
		hot: "none", // variant decides: spectacle stares, pain hunts
		prompt: "", // set per variant in the UI
	},
	{
		id: "collapse",
		hot: "toggle",
		prompt: "Bring it back. Flip to Alfredo.",
	},
] as const;

export const FREE_BEAT = BEATS.length; // sandbox
export type BeatIndex = number; // 0..FREE_BEAT

/* ------------------------------------------------------------- state ---- */

export type SimProject = {
	id: string;
	name: string;
	trays: TrayId[]; // full set incl. implicit, in TRAYS order
	reused: TrayId[]; // subset that was already running at deploy time
	deployedAt: number;
	liveAt: number;
};

export type SimIncident = {
	id: string;
	projectId: string;
	tray: TrayId;
	title: string;
	firedAt: number;
	state: "firing" | "caught";
	caughtAt?: number;
	by?: "you" | "alfredo";
	clicks?: number; // pain-mode hunt cost
};

export type FeedItem = {
	id: string;
	t: number;
	text: string;
	tone: "dim" | "green" | "amber" | "red";
};

export type Sheet = {
	name: string;
	picks: TrayId[];
	locked: boolean; // guided presets are not editable
};

export type World = {
	t: number;
	mode: "attract" | "guided" | "free";
	beat: BeatIndex;
	view: "with" | "without";
	viewFlippedAt: number; // drives shatter/collapse animation
	projects: SimProject[];
	sheet: Sheet | null;
	incidents: SimIncident[];
	feed: FeedItem[];
	// pain-mode hunt state: panes opened since the live incident fired
	openedPanes: string[];
	huntClicks: number;
	// live numbers (accumulated in tick so they only ever count up)
	traffic: number;
	mails: number;
	revenue: number;
	// aggregate candidates (#40: runs / deploys / auto-caught feed the LIVE etch)
	counters: {
		runs: number;
		deploys: number;
		caught: number;
		autoCaught: number;
	};
	nextIncidentAt: number;
	nextPaymentAt: number;
	freeAt: number;
	cta: "hidden" | "shown" | "dismissed";
	seq: number; // id + pseudo-random counter
};

/* ------------------------------------------------------- pure helpers --- */

// deterministic pseudo-random from the action counter — no Math.random
function rnd(seq: number) {
	const x = Math.sin(seq * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
}

function hashName(name: string) {
	let h = 0;
	for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
	return h;
}

// per-project visitors/second — alive, wobbling, deterministic
export function trafficRate(p: SimProject, t: number) {
	if (t < p.liveAt) return 0;
	const h = hashName(p.name);
	const base = 1.6 + (h % 5) * 0.9;
	const wobble =
		1 + 0.4 * Math.sin(t * 0.6 + h) + 0.2 * Math.sin(t * 1.7 + h * 2);
	const rampT = Math.min(1, (t - p.liveAt) / 6);
	return base * wobble * rampT;
}

export function totalRate(w: World) {
	return w.projects.reduce((s, p) => s + trafficRate(p, w.t), 0);
}

export function trend(w: World, n = 14, step = 0.5) {
	return Array.from({ length: n }, (_, i) => {
		const t = w.t - (n - 1 - i) * step;
		return w.projects.reduce((s, p) => s + trafficRate(p, t), 0);
	});
}

export function trayLit(p: SimProject, tray: TrayId, t: number) {
	if (p.reused.includes(tray)) return t >= p.deployedAt;
	const idx = p.trays.filter((x) => !p.reused.includes(x)).indexOf(tray);
	return t >= p.deployedAt + 0.45 + idx * 0.4;
}

export function projectStatus(
	p: SimProject,
	t: number,
	incidents: SimIncident[],
) {
	if (t < p.liveAt) return "wiring" as const;
	if (incidents.some((i) => i.projectId === p.id && i.state === "firing"))
		return "alert" as const;
	return "live" as const;
}

// The scoreboard: one nameless pane per (project × tray).
export type Pane = { id: string; project: SimProject; tray: TrayId };

export function panesOf(w: World): Pane[] {
	return w.projects.flatMap((p) =>
		p.trays.map((tray) => ({ id: `${p.id}:${tray}`, project: p, tray })),
	);
}

export function firingIncident(w: World) {
	return w.incidents.find((i) => i.state === "firing") ?? null;
}

const INCIDENT_TITLES: Partial<Record<TrayId, string>> = {
	uptime: "not responding",
	errors: "exception spike",
	email: "bounce rate climbing",
	payments: "checkout failing",
	db: "queries timing out",
	auth: "logins erroring",
};

const FREE_NAMES = [
	"invoice-bot",
	"status-page",
	"ai-wrapper",
	"newsletter",
	"side-shop",
	"link-tool",
	"cron-daddy",
	"pixel-farm",
];

/* ----------------------------------------------------------- actions ---- */

export type Action =
	| { type: "tick"; dt: number }
	| { type: "open-sheet" }
	| { type: "sheet-name" }
	| { type: "sheet-tray"; tray: TrayId }
	| { type: "deploy" }
	| { type: "catch"; id: string }
	| { type: "toggle"; view: "with" | "without" }
	| { type: "open-pane"; id: string }
	| { type: "fix-pane"; incidentId: string }
	| { type: "cta-dismiss" }
	| { type: "fire-incident"; projectIdx: number; tray: TrayId } // director
	| { type: "reset"; mode: World["mode"] };

/* -------------------------------------------------------------- init ---- */

const GUIDED_PRESETS: { name: string; picks: TrayId[] }[] = [
	{ name: "landing-page", picks: ["analytics", "email"] },
	{ name: "geo-api", picks: ["analytics", "db", "auth"] },
];

// ghost cast for the attract loop — 3 deploys → 14 panes on the without side
const ATTRACT_CAST: { name: string; picks: TrayId[] }[] = [
	{ name: "landing-page", picks: ["analytics", "email"] },
	{ name: "geo-api", picks: ["analytics", "db", "auth"] },
	{ name: "side-shop", picks: ["analytics", "email", "payments"] },
];

export function init(mode: World["mode"], runs = 0): World {
	return {
		t: 0,
		mode,
		beat: mode === "guided" ? 0 : FREE_BEAT,
		view: "with",
		viewFlippedAt: -10,
		projects: [],
		sheet:
			mode === "guided"
				? {
						name: GUIDED_PRESETS[0].name,
						picks: GUIDED_PRESETS[0].picks,
						locked: true,
					}
				: null,
		incidents: [],
		feed: [
			{
				id: "boot",
				t: 0,
				text: "simulation booted · nothing is real",
				tone: "dim",
			},
		],
		openedPanes: [],
		huntClicks: 0,
		traffic: 0,
		mails: 0,
		revenue: 0,
		counters: { runs, deploys: 0, caught: 0, autoCaught: 0 },
		nextIncidentAt: Number.POSITIVE_INFINITY,
		nextPaymentAt: Number.POSITIVE_INFINITY,
		freeAt: Number.POSITIVE_INFINITY,
		cta: "hidden",
		seq: 1,
	};
}

/* ----------------------------------------------------------- reducer ---- */

function feed(w: World, text: string, tone: FeedItem["tone"]): FeedItem[] {
	return [{ id: `f${w.seq}`, t: w.t, text, tone }, ...w.feed].slice(0, 7);
}

function withTrays(picks: TrayId[]): TrayId[] {
	const all = [...picks, ...IMPLICIT];
	return TRAYS.map((t) => t.id).filter((id) => all.includes(id));
}

function deploy(w: World): World {
	if (!w.sheet) return w;
	const running = new Set(w.projects.flatMap((p) => p.trays));
	const trays = withTrays(w.sheet.picks);
	const reused = trays.filter((t) => running.has(t));
	const fresh = trays.length - reused.length;
	const p: SimProject = {
		id: `p${w.seq}`,
		name: w.sheet.name,
		trays,
		reused,
		deployedAt: w.t,
		liveAt: w.t + 0.5 + fresh * 0.4,
	};
	const note =
		reused.length > 0
			? `${p.name} live · ${reused.length} trays reused, ${fresh} started`
			: `${p.name} deploying · ${fresh} trays starting`;
	return {
		...w,
		seq: w.seq + 1,
		projects: [...w.projects, p],
		sheet: null,
		counters: { ...w.counters, deploys: w.counters.deploys + 1 },
		feed: feed(w, note, reused.length > 0 ? "green" : "amber"),
		// guided beats 0 and 2 both end on a deploy
		beat:
			w.mode === "guided" && (w.beat === 0 || w.beat === 2)
				? w.beat + 1
				: w.beat,
		// entering beat 1 (incident-1): schedule the scripted first incident
		nextIncidentAt:
			w.mode === "guided" && w.beat === 0 ? p.liveAt + 2.2 : w.nextIncidentAt,
	};
}

function fireIncident(w: World, projectIdx: number, tray: TrayId): World {
	const p = w.projects[projectIdx % Math.max(1, w.projects.length)];
	if (!p) return w;
	const inc: SimIncident = {
		id: `i${w.seq}`,
		projectId: p.id,
		tray,
		title: INCIDENT_TITLES[tray] ?? "acting up",
		firedAt: w.t,
		state: "firing",
	};
	return {
		...w,
		seq: w.seq + 1,
		incidents: [inc, ...w.incidents].slice(0, 8),
		openedPanes: [],
		huntClicks: 0,
		feed: feed(
			w,
			`${p.name} · ${trayOf(tray).label.toLowerCase()} ${inc.title}`,
			"red",
		),
	};
}

function catchIncident(
	w: World,
	id: string,
	by: "you" | "alfredo",
	clicks = 1,
): World {
	const inc = w.incidents.find((i) => i.id === id && i.state === "firing");
	if (!inc) return w;
	const p = w.projects.find((x) => x.id === inc.projectId);
	const incidents = w.incidents.map((i) =>
		i.id === id
			? { ...i, state: "caught" as const, caughtAt: w.t, by, clicks }
			: i,
	);
	const counters = {
		...w.counters,
		caught: w.counters.caught + (by === "you" ? 1 : 0),
		autoCaught: w.counters.autoCaught + (by === "alfredo" ? 1 : 0),
	};
	const text =
		by === "alfredo"
			? `${p?.name} · auto-caught, restarted`
			: clicks > 1
				? `${p?.name} · found it in ${clicks} clicks`
				: `${p?.name} · caught in 1 click`;
	return {
		...w,
		incidents,
		counters,
		feed: feed(w, text, "green"),
		// guided beat 1 ends when the player catches
		beat: w.mode === "guided" && w.beat === 1 && by === "you" ? 2 : w.beat,
	};
}

function tick(w: World, dt: number): World {
	const t = w.t + dt;
	let next: World = { ...w, t };

	// live numbers only accumulate — the world breathes
	const rate = totalRate(next);
	next.traffic += rate * dt;
	const mailProjects = next.projects.filter(
		(p) => t >= p.liveAt && p.trays.includes("email"),
	).length;
	next.mails += mailProjects * 0.5 * dt;

	// scripted first incident (guided beat 1) + free-play incident cadence
	if (t >= next.nextIncidentAt && !firingIncident(next)) {
		if (next.mode === "guided" && next.beat === 1) {
			next = fireIncident(next, 0, "uptime");
			next.nextIncidentAt = Number.POSITIVE_INFINITY;
		} else if (next.projects.length > 0) {
			const trays: TrayId[] = [
				"uptime",
				"errors",
				"email",
				"db",
				"payments",
				"auth",
			];
			const pIdx = Math.floor(rnd(next.seq) * next.projects.length);
			const candidates = trays.filter((x) =>
				next.projects[pIdx].trays.includes(x),
			);
			const tray =
				candidates[Math.floor(rnd(next.seq + 1) * candidates.length)];
			next = fireIncident(next, pIdx, tray ?? "uptime");
			next.nextIncidentAt = t + 9 + rnd(next.seq + 2) * 7;
		}
	}

	// with Alfredo wired, unattended incidents catch themselves (free play only)
	const firing = firingIncident(next);
	if (
		firing &&
		next.mode !== "guided" &&
		next.view === "with" &&
		t - firing.firedAt > 3.5
	) {
		next = catchIncident(next, firing.id, "alfredo");
	}

	// payments ping once the tray runs
	const paying = next.projects.some(
		(p) => t >= p.liveAt && p.trays.includes("payments"),
	);
	if (paying && !Number.isFinite(next.nextPaymentAt)) {
		next.nextPaymentAt = t + 2;
	}
	if (paying && t >= next.nextPaymentAt) {
		const amt = [19, 49, 9, 120][Math.floor(rnd(next.seq) * 4)];
		next.revenue += amt;
		next.seq += 1;
		next.feed = feed(next, `payment received · €${amt}`, "green");
		next.nextPaymentAt = t + 5 + rnd(next.seq) * 9;
	}

	// the run completes when the collapse beat ends → free play + CTA timer
	if (
		next.mode === "free" &&
		next.cta === "hidden" &&
		Number.isFinite(next.freeAt)
	) {
		const deployed = next.counters.deploys;
		if (t - next.freeAt > 24 || deployed >= 4) next.cta = "shown";
	}

	return next;
}

export function reduce(w: World, a: Action): World {
	switch (a.type) {
		case "tick":
			return tick(w, a.dt);
		case "reset":
			return init(a.mode, w.counters.runs);
		case "open-sheet": {
			if (w.sheet) return w;
			if (w.mode === "guided" && w.beat === 2) {
				return {
					...w,
					sheet: { ...GUIDED_PRESETS[1], locked: true },
				};
			}
			if (w.mode === "attract") {
				const preset = ATTRACT_CAST[w.projects.length % ATTRACT_CAST.length];
				return { ...w, sheet: { ...preset, locked: true } };
			}
			const name = FREE_NAMES[w.seq % FREE_NAMES.length];
			return {
				...w,
				seq: w.seq + 1,
				sheet: { name, picks: ["analytics"], locked: false },
			};
		}
		case "sheet-name": {
			if (!w.sheet || w.sheet.locked) return w;
			return {
				...w,
				seq: w.seq + 1,
				sheet: { ...w.sheet, name: FREE_NAMES[w.seq % FREE_NAMES.length] },
			};
		}
		case "sheet-tray": {
			if (!w.sheet || w.sheet.locked) return w;
			const has = w.sheet.picks.includes(a.tray);
			const picks = has
				? w.sheet.picks.filter((t) => t !== a.tray)
				: [...w.sheet.picks, a.tray];
			if (picks.length === 0) return w;
			return { ...w, sheet: { ...w.sheet, picks } };
		}
		case "deploy":
			return deploy(w);
		case "catch":
			return catchIncident(w, a.id, "you");
		case "fire-incident":
			return fireIncident(w, a.projectIdx, a.tray);
		case "toggle": {
			if (a.view === w.view) return w;
			let next: World = { ...w, view: a.view, viewFlippedAt: w.t };
			if (w.mode === "guided") {
				if (w.beat === 3 && a.view === "without") {
					// the without beat: an incident fires into the sprawl shortly
					next.beat = 4;
					next.nextIncidentAt = w.t + 1.4;
					next.mode = "guided";
				} else if ((w.beat === 4 || w.beat === 5) && a.view === "with") {
					// the collapse — run complete, sandbox unlocks
					next = {
						...next,
						beat: FREE_BEAT,
						mode: "free",
						freeAt: w.t,
						counters: { ...w.counters, runs: w.counters.runs + 1 },
						nextIncidentAt: w.t + 8,
						feed: feed(w, "run complete · sandbox open", "amber"),
					};
				}
			}
			return next;
		}
		case "open-pane": {
			if (w.openedPanes.includes(a.id)) return w;
			return {
				...w,
				openedPanes: [...w.openedPanes, a.id],
				huntClicks: w.huntClicks + 1,
			};
		}
		case "fix-pane": {
			const next = catchIncident(w, a.incidentId, "you", w.huntClicks + 1);
			// pain variant: fixing in the sprawl ends the without beat
			if (w.mode === "guided" && w.beat === 4)
				return {
					...next,
					beat: 5,
					openedPanes: [],
					huntClicks: next.huntClicks,
				};
			return { ...next, openedPanes: [] };
		}
		case "cta-dismiss":
			return { ...w, cta: "dismissed" };
	}
}

/* -------------------------------------------------- attract director ---- */

// The collapse loop, scripted through the same reducer: ghost deploys grow
// the sprawl, an incident pulses, everything collapses back into one HQ.
export type DirectorStep = { at: number; action: Action };

export const ATTRACT_LOOP = 26; // seconds
export const ATTRACT_SCRIPT: DirectorStep[] = [
	{ at: 0.5, action: { type: "open-sheet" } },
	{ at: 1.0, action: { type: "deploy" } },
	{ at: 4.0, action: { type: "open-sheet" } },
	{ at: 4.5, action: { type: "deploy" } },
	{ at: 7.5, action: { type: "open-sheet" } },
	{ at: 8.0, action: { type: "deploy" } },
	{ at: 10.5, action: { type: "toggle", view: "without" } },
	{
		at: 12.5,
		action: { type: "fire-incident", projectIdx: 1, tray: "errors" },
	},
	{ at: 16.5, action: { type: "catch", id: "" } }, // resolved off-screen; id patched at dispatch
	{ at: 18.5, action: { type: "toggle", view: "with" } },
	{ at: ATTRACT_LOOP, action: { type: "reset", mode: "attract" } },
];
