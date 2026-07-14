// PROTOTYPE — throwaway (wayfinder #26, round 2). Hero demo v2 after the
// operator's react pass: one story loop from empty state to teardown —
//   empty → deploy my-saas (plain) → linkloom (goes viral) → papertrail
//   (payment notifs) → relay-api (uptime wobble) → remove one by one → empty
// The terminal is gone: deployment renders on the dashboard itself (the new
// project card provisions its integrations, then flips LIVE). The left side
// is a real form (input + clickable integration cards) that dims and hands
// off to the card when Deploy fires. Stories are exaggerated with pings and
// ripples. Axes (floating bar, dev only, behind ?hv2=1):
//   layout = beats | overlay    (split eases on story beats vs form-as-overlay)
//   pace   = calm | punchy      (dwell times + ripple intensity)
//   view   = desktop | mobile   (mobile vertical / bottom-sheet)
import { useEffect, useRef, useState } from "react";
import { consoleCssVars } from "#/components/landing/console-vars";
import "#/components/prototype/hero-demo-v2.css";

/* ---------------------------------------------------------------- axes -- */

export type Hv2Axes = {
	layout: "beats" | "overlay";
	pace: "calm" | "punchy";
	view: "desktop" | "mobile";
};

const AXIS_OPTIONS = {
	layout: ["beats", "overlay"],
	pace: ["calm", "punchy"],
	view: ["desktop", "mobile"],
} as const;

const DEFAULT_AXES: Hv2Axes = {
	layout: "beats",
	pace: "calm",
	view: "desktop",
};

// Enabled only in dev builds with ?hv2 present. Reads the URL after mount
// (SSR-safe); axis params are optional and default above.
export function useHeroV2(): [Hv2Axes | null, (a: Hv2Axes | null) => void] {
	const [axes, setAxes] = useState<Hv2Axes | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		if (!q.has("hv2")) return;
		const pick = <K extends keyof Hv2Axes>(key: K): Hv2Axes[K] => {
			const v = q.get(key);
			const opts = AXIS_OPTIONS[key] as readonly string[];
			return (v && opts.includes(v) ? v : DEFAULT_AXES[key]) as Hv2Axes[K];
		};
		setAxes({ layout: pick("layout"), pace: pick("pace"), view: pick("view") });
	}, []);

	const update = (a: Hv2Axes | null) => {
		setAxes(a);
		const q = new URLSearchParams(window.location.search);
		if (a === null) {
			for (const k of ["hv2", "layout", "pace", "view"]) q.delete(k);
		} else {
			q.set("hv2", "1");
			for (const k of Object.keys(AXIS_OPTIONS) as (keyof Hv2Axes)[])
				q.set(k, a[k]);
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

/* ---------------------------------------------------------------- cast -- */

const INTEGRATIONS = [
	{ id: "auth", label: "Auth", spec: "sessions, oauth", chip: "AU" },
	{ id: "email", label: "Email", spec: "transactional", chip: "EM" },
	{ id: "db", label: "Database", spec: "live data", chip: "DB" },
	{ id: "analytics", label: "Analytics", spec: "on your server", chip: "AN" },
	{ id: "payments", label: "Payments", spec: "checkout + billing", chip: "PA" },
];

type StoryKind = "plain" | "viral" | "money" | "uptime";

// Four deploys, four stories; picks index into INTEGRATIONS, gaps make the
// selection feel human (quick, uneven).
const CAST: {
	name: string;
	picks: number[];
	gaps: number[];
	story: StoryKind;
}[] = [
	{
		name: "my-saas",
		picks: [0, 1, 2, 3, 4],
		gaps: [150, 80, 220, 100, 170],
		story: "plain",
	},
	{ name: "linkloom", picks: [0, 2, 3], gaps: [130, 190, 90], story: "viral" },
	{
		name: "papertrail",
		picks: [0, 1, 4],
		gaps: [100, 230, 120],
		story: "money",
	},
	{ name: "relay-api", picks: [0, 2], gaps: [160, 90], story: "uptime" },
];

type ProjState = "prov" | "live" | "down" | "out";

type Proj = {
	name: string;
	picks: number[];
	state: ProjState;
	lit: number; // integrations provisioned so far
	views: number;
	eur: number;
	pulse: "green" | "red" | null;
	pulseKey: number;
};

type Toast = { id: number; amt: number; label: string };

const TOASTS: Omit<Toast, "id">[] = [
	{ amt: 49, label: "checkout completed" },
	{ amt: 19, label: "subscription renewed" },
	{ amt: 120, label: "annual upgrade" },
];

type FormPhase = "hidden" | "idle" | "filling" | "ready" | "sent";

type Form = {
	phase: FormPhase;
	name: string;
	typed: number;
	picks: number[];
	picked: number; // how many of picks are selected so far
	ring: number; // integration index currently ring-pulsing, -1 none
};

const FORM_START: Form = {
	phase: "idle",
	name: CAST[0].name,
	typed: 0,
	picks: CAST[0].picks,
	picked: 0,
	ring: -1,
};

const SPARK = [
	4, 3, 5, 4, 6, 5, 7, 6, 8, 11, 16, 26, 40, 58, 74, 88, 96, 92, 100,
].map((h, i) => ({ id: `sp-${i}`, h }));

function fmt(n: number) {
	return n.toLocaleString("en-US");
}

/* ---------------------------------------------------- the demo engine -- */

// Story spotlight: what the dashboard is talking about right now.
type Spot =
	| { kind: "empty" }
	| { kind: "quiet" }
	| { kind: StoryKind; proj: string; recovered?: boolean };

function Hv2Engine({ axes }: { axes: Hv2Axes }) {
	const [projects, setProjects] = useState<Proj[]>([]);
	const [form, setForm] = useState<Form>(FORM_START);
	const [spot, setSpot] = useState<Spot>({ kind: "empty" });
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [tilePing, setTilePing] = useState({
		activity: 0,
		money: 0,
		health: 0,
	});
	const [formFocus, setFormFocus] = useState(true); // beats: which side leads

	const viral = useRef<string | null>(null);
	const timers = useRef<number[]>([]);
	const vertical = axes.view === "mobile";

	const t = (fn: () => void, ms: number) => {
		timers.current.push(window.setTimeout(fn, ms));
	};

	/* live tick — live projects breathe; the viral one surges */
	useEffect(() => {
		const id = setInterval(() => {
			setProjects((prev) =>
				prev.map((p) =>
					p.state === "live" || p.state === "down"
						? {
								...p,
								views:
									p.views +
									(viral.current === p.name
										? 55 + Math.floor(Math.random() * 70)
										: Math.floor(Math.random() * 4)),
							}
						: p,
				),
			);
		}, 450);
		return () => clearInterval(id);
	}, []);

	/* the director — one scripted loop, restarted per pace/view/layout */
	// biome-ignore lint/correctness/useExhaustiveDependencies: scripted loop, restarted wholesale
	useEffect(() => {
		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (prefersReduced) {
			// Static composed frame: two projects live, viral spotlight, form filled.
			setProjects([
				mkProj(CAST[0], "live", 1284),
				mkProj(CAST[1], "live", 18432),
			]);
			setForm({ ...FORM_START, typed: CAST[0].name.length, picked: 5 });
			setSpot({ kind: "viral", proj: CAST[1].name });
			setFormFocus(false);
			return;
		}

		const m = axes.pace === "punchy" ? 0.72 : 1;

		const pulse = (name: string, color: "green" | "red") =>
			setProjects((prev) =>
				prev.map((p) =>
					p.name === name
						? { ...p, pulse: color, pulseKey: p.pulseKey + 1 }
						: p,
				),
			);
		const ping = (tile: keyof typeof tilePing) =>
			setTilePing((prev) => ({ ...prev, [tile]: prev[tile] + 1 }));

		const script = () => {
			let at = 0;
			const step = (ms: number, fn?: () => void) => {
				if (fn) t(fn, at);
				at += ms * m;
			};

			/* reset — empty HQ, form waiting */
			step(0, () => {
				setProjects([]);
				setToasts([]);
				setSpot({ kind: "empty" });
				setForm({ ...FORM_START, phase: "idle" });
				setFormFocus(true);
				viral.current = null;
			});
			step(1400);

			CAST.forEach((c, ci) => {
				/* fill the form — quick, uneven, human */
				step(0, () => {
					setFormFocus(true);
					setForm({
						phase: "filling",
						name: c.name,
						typed: 0,
						picks: c.picks,
						picked: 0,
						ring: -1,
					});
				});
				step(350);
				for (let i = 1; i <= c.name.length; i++)
					step(42, () => setForm((f) => ({ ...f, typed: i })));
				step(240);
				c.picks.forEach((pk, i) => {
					step(0, () => setForm((f) => ({ ...f, ring: pk })));
					step(c.gaps[i], () =>
						setForm((f) => ({ ...f, picked: i + 1, ring: -1 })),
					);
				});
				step(300, () => setForm((f) => ({ ...f, phase: "ready" })));

				/* Deploy — the form dims and hands off to the dashboard card */
				step(340, () => {
					setForm((f) => ({ ...f, phase: "sent" }));
					setProjects((prev) => [...prev, mkProj(c, "prov", 0)]);
					setFormFocus(false);
				});
				// integrations light up on the card, one by one, uneven
				c.picks.forEach((_, i) => {
					step(170 + (i % 2) * 70, () =>
						setProjects((prev) =>
							prev.map((p) => (p.name === c.name ? { ...p, lit: i + 1 } : p)),
						),
					);
				});
				step(280, () => {
					setProjects((prev) =>
						prev.map((p) => (p.name === c.name ? { ...p, state: "live" } : p)),
					);
					pulse(c.name, "green");
					setSpot({ kind: c.story, proj: c.name });
					if (ci < CAST.length - 1)
						setForm({
							phase: axes.layout === "overlay" ? "hidden" : "idle",
							name: CAST[ci + 1].name,
							typed: 0,
							picks: CAST[ci + 1].picks,
							picked: 0,
							ring: -1,
						});
					else setForm((f) => ({ ...f, phase: "hidden" }));
				});

				/* the story */
				if (c.story === "plain") {
					step(2100);
				}
				if (c.story === "viral") {
					// starts slowly… then the front page hits
					step(1000, () => {
						viral.current = c.name;
						pulse(c.name, "green");
						ping("activity");
					});
					step(1600, () => {
						pulse(c.name, "green");
						ping("activity");
					});
					step(1800, () => {
						viral.current = null;
					});
				}
				if (c.story === "money") {
					TOASTS.forEach((toast, ti) => {
						step([700, 1150, 620][ti], () => {
							setToasts((prev) => [...prev, { ...toast, id: ti }]);
							setProjects((prev) =>
								prev.map((p) =>
									p.name === c.name ? { ...p, eur: p.eur + toast.amt } : p,
								),
							);
							pulse(c.name, "green");
							ping("money");
						});
					});
					step(1500);
				}
				if (c.story === "uptime") {
					step(900, () => {
						setProjects((prev) =>
							prev.map((p) =>
								p.name === c.name ? { ...p, state: "down" } : p,
							),
						);
						pulse(c.name, "red");
						ping("health");
					});
					step(1900, () => {
						setProjects((prev) =>
							prev.map((p) =>
								p.name === c.name ? { ...p, state: "live" } : p,
							),
						);
						pulse(c.name, "green");
						ping("health");
						setSpot({ kind: "uptime", proj: c.name, recovered: true });
					});
					step(1700);
				}
			});

			/* teardown — projects leave one by one, back to the empty state */
			step(600, () => setSpot({ kind: "quiet" }));
			for (let i = CAST.length - 1; i >= 0; i--) {
				const name = CAST[i].name;
				step(0, () =>
					setProjects((prev) =>
						prev.map((p) => (p.name === name ? { ...p, state: "out" } : p)),
					),
				);
				step(560, () =>
					setProjects((prev) => prev.filter((p) => p.name !== name)),
				);
			}
			step(200, () => setSpot({ kind: "empty" }));
			step(900);
			return at;
		};

		const loop = () => {
			const len = script();
			t(loop, len);
		};
		loop();

		return () => {
			for (const id of timers.current) clearTimeout(id);
			timers.current = [];
		};
	}, [axes.pace, axes.view, axes.layout]);

	/* derived — "out" projects stay rendered so the pop-out animation plays */
	const shown = projects;
	const live = projects.filter((p) => p.state === "live" || p.state === "down");
	const totViews = live.reduce((a, p) => a + p.views, 0);
	const totEur = live.reduce((a, p) => a + p.eur, 0);
	const downCount = projects.filter((p) => p.state === "down").length;

	const beats = axes.layout === "beats";
	const splitPct = beats
		? formFocus
			? vertical
				? 54
				: 44
			: vertical
				? 30
				: 26
		: 0;

	return (
		<section
			className={`hv2-bezel hv2-pace-${axes.pace}${vertical ? " hv2-mobile" : ""}`}
			aria-label="Alfredo HQ demo (prototype v2)"
			style={consoleCssVars}
		>
			<div className="hv2-btop">
				<span className="hv2-etch">ALFREDO OS 0.1</span>
				<span className="hv2-etch">HQ / LIVE</span>
				<span className="hv2-etch">UNIT 000-001</span>
			</div>

			<div className={`hv2-glass${vertical ? " hv2-vert" : ""}`}>
				{beats ? (
					<>
						<div
							className="hv2-pane-form"
							style={
								vertical
									? { height: `${splitPct}%` }
									: { width: `${splitPct}%` }
							}
						>
							<DeployForm form={form} />
						</div>
						<div className="hv2-seam" aria-hidden="true" />
						<div className="hv2-pane-dash">
							<Dash
								projects={shown}
								spot={spot}
								toasts={toasts}
								totViews={totViews}
								totEur={totEur}
								downCount={downCount}
								tilePing={tilePing}
							/>
						</div>
					</>
				) : (
					<div className="hv2-full">
						<Dash
							projects={shown}
							spot={spot}
							toasts={toasts}
							totViews={totViews}
							totEur={totEur}
							downCount={downCount}
							tilePing={tilePing}
						/>
						<div
							className={`hv2-sheet${form.phase !== "hidden" ? " hv2-sheet-in" : ""}`}
						>
							<DeployForm form={form} />
						</div>
					</div>
				)}
			</div>

			<div className="hv2-bbot">
				<span className="hv2-etch hv2-microprint">
					YOUR SERVERS · ONE HQ · N PROJECTS
				</span>
			</div>
		</section>
	);
}

function mkProj(
	c: (typeof CAST)[number],
	state: ProjState,
	views: number,
): Proj {
	return {
		name: c.name,
		picks: c.picks,
		state,
		lit: state === "prov" ? 0 : c.picks.length,
		views,
		eur: 0,
		pulse: null,
		pulseKey: 0,
	};
}

/* --------------------------------------------------------- the form ---- */

function DeployForm({ form }: { form: Form }) {
	return (
		<div className={`hv2-form hv2-form-${form.phase}`}>
			<span className="hv2-etch">NEW PROJECT</span>

			{/* fake input — the demo types into it, nobody else does */}
			<div className="hv2-field">
				<span className="hv2-field-label">Project name</span>
				<span className="hv2-input">
					{form.name.slice(0, form.typed)}
					{form.phase === "filling" && form.typed < form.name.length && (
						<span className="hv2-caret" aria-hidden="true" />
					)}
				</span>
			</div>

			<span className="hv2-field-label">Integrations</span>
			<div className="hv2-intcards">
				{INTEGRATIONS.map((it, i) => {
					const on = form.picks.slice(0, form.picked).includes(i);
					return (
						<div
							className={`hv2-intcard${on ? " hv2-intcard-on" : ""}`}
							key={it.id}
						>
							<span className="hv2-intbox" aria-hidden="true">
								{on ? "✓" : ""}
							</span>
							<span className="hv2-intname">{it.label}</span>
							<span className="hv2-intspec">{it.spec}</span>
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

function Dash({
	projects,
	spot,
	toasts,
	totViews,
	totEur,
	downCount,
	tilePing,
}: {
	projects: Proj[];
	spot: Spot;
	toasts: Toast[];
	totViews: number;
	totEur: number;
	downCount: number;
	tilePing: { activity: number; money: number; health: number };
}) {
	if (projects.length === 0) {
		return (
			<div className="hv2-dash hv2-dash-empty">
				<span className="hv2-etch">FLEET — 0 PROJECTS</span>
				<div className="hv2-empty">
					<span className="hv2-empty-led" aria-hidden="true" />
					<span className="hv2-empty-title">No projects yet</span>
					<span className="hv2-empty-sub">
						Create your first project — everything gets wired for you.
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="hv2-dash">
			{/* thin fixed top row: every project, live status + integration chips */}
			<div className="hv2-toprow">
				{projects.map((p) => (
					<div className={`hv2-proj hv2-proj-${p.state}`} key={p.name}>
						{p.pulse && (
							<span
								className={`hv2-ripple hv2-ripple-${p.pulse}`}
								key={p.pulseKey}
								aria-hidden="true"
							/>
						)}
						<span className="hv2-proj-head">
							<span
								className={`hv2-led${p.state === "down" ? " hv2-led-red" : ""}${p.state === "prov" ? " hv2-led-amber" : ""}`}
								aria-hidden="true"
							/>
							<span className="hv2-proj-name">{p.name}</span>
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
							{p.state === "prov"
								? "WIRING…"
								: p.state === "down"
									? "DOWN"
									: "LIVE"}
						</span>
					</div>
				))}
			</div>

			{/* the story spotlight */}
			<Spotlight spot={spot} projects={projects} toasts={toasts} />

			{/* essentials only */}
			<div className="hv2-tiles">
				<Tile etch="ACTIVITY" num={fmt(totViews)} pingKey={tilePing.activity} />
				<Tile etch="MONEY" num={`€ ${fmt(totEur)}`} pingKey={tilePing.money} />
				<Tile
					etch="HEALTH"
					num={
						downCount > 0
							? `${downCount} down`
							: `${projects.filter((p) => p.state !== "out").length}/${projects.filter((p) => p.state !== "out").length} up`
					}
					warn={downCount > 0}
					pingKey={tilePing.health}
				/>
			</div>
		</div>
	);
}

function Tile({
	etch,
	num,
	warn,
	pingKey,
}: {
	etch: string;
	num: string;
	warn?: boolean;
	pingKey: number;
}) {
	return (
		<div className={`hv2-tile${warn ? " hv2-tile-warn" : ""}`}>
			{pingKey > 0 && (
				<span
					className={`hv2-ripple ${warn ? "hv2-ripple-red" : "hv2-ripple-green"}`}
					key={pingKey}
					aria-hidden="true"
				/>
			)}
			<span className="hv2-etch">{etch}</span>
			<span className="hv2-tile-num">{num}</span>
		</div>
	);
}

function Spotlight({
	spot,
	projects,
	toasts,
}: {
	spot: Spot;
	projects: Proj[];
	toasts: Toast[];
}) {
	if (spot.kind === "empty") return null;

	if (spot.kind === "quiet") {
		return (
			<div className="hv2-spot">
				<span className="hv2-etch">ALL QUIET</span>
				<span className="hv2-spot-sub">nothing needs you</span>
			</div>
		);
	}

	if (spot.kind === "plain") {
		const p = projects.find((x) => x.name === spot.proj);
		return (
			<div className="hv2-spot" key={spot.proj}>
				<div className="hv2-spot-head">
					<span className="hv2-etch">DEPLOYED</span>
					<span className="hv2-tag-green">LIVE</span>
				</div>
				<span className="hv2-spot-big">{spot.proj}</span>
				<span className="hv2-spot-sub">
					{p?.picks.length ?? 5} integrations wired · nothing else to do
				</span>
			</div>
		);
	}

	if (spot.kind === "viral") {
		const p = projects.find((x) => x.name === spot.proj);
		return (
			<div className="hv2-spot hv2-spot-viral" key={spot.proj}>
				<div className="hv2-spot-head">
					<span className="hv2-etch">TRAFFIC · SPIKE</span>
					<span className="hv2-tag-amber">SURGING</span>
				</div>
				<span className="hv2-spot-big hv2-num">{fmt(p?.views ?? 0)}</span>
				<div className="hv2-spark" aria-hidden="true">
					{SPARK.map((b, i) => (
						<span
							className="hv2-spark-bar"
							key={b.id}
							style={{ height: `${b.h}%`, animationDelay: `${i * 0.05}s` }}
						/>
					))}
				</div>
				<span className="hv2-spot-sub">
					{spot.proj} — started slow, going viral
				</span>
			</div>
		);
	}

	if (spot.kind === "money") {
		return (
			<div className="hv2-spot" key={spot.proj}>
				<div className="hv2-spot-head">
					<span className="hv2-etch">PAYMENTS</span>
					<span className="hv2-tag-green">
						+€ {fmt(toasts.reduce((a, x) => a + x.amt, 0))}
					</span>
				</div>
				<div className="hv2-toasts">
					{toasts.map((toast) => (
						<div className="hv2-toast" key={toast.id}>
							<span className="hv2-toast-amt">€ {toast.amt}</span>
							<span className="hv2-toast-proj">{spot.proj}</span>
							<span className="hv2-toast-label">{toast.label}</span>
						</div>
					))}
					{toasts.length === 0 && (
						<div className="hv2-toast hv2-toast-wait">
							<span className="hv2-toast-amt">…</span>
							<span className="hv2-toast-label">listening</span>
						</div>
					)}
				</div>
			</div>
		);
	}

	// uptime
	return (
		<div
			className={`hv2-spot ${spot.recovered ? "" : "hv2-spot-down"}`}
			key={`${spot.proj}-${spot.recovered ? "up" : "down"}`}
		>
			<div className="hv2-spot-head">
				<span className="hv2-etch">HEALTH</span>
				{spot.recovered ? (
					<span className="hv2-tag-green">RECOVERED</span>
				) : (
					<span className="hv2-tag-red">DOWN</span>
				)}
			</div>
			<span className="hv2-spot-big">
				{spot.recovered
					? `${spot.proj} is back`
					: `${spot.proj} not responding`}
			</span>
			<span className="hv2-spot-sub">
				{spot.recovered
					? "downtime 14s · you'd have been pinged"
					: "caught in 3s — before the first user noticed"}
			</span>
		</div>
	);
}

/* ----------------------------------------------------- switcher bar ---- */

const AXIS_LABELS: Record<keyof Hv2Axes, string> = {
	layout: "LAYOUT",
	pace: "PACE",
	view: "VIEW",
};

function Hv2Bar({
	axes,
	onAxes,
}: {
	axes: Hv2Axes;
	onAxes: (a: Hv2Axes | null) => void;
}) {
	return (
		<div className="hv2-bar" style={consoleCssVars}>
			{(Object.keys(AXIS_OPTIONS) as (keyof Hv2Axes)[]).map((axis) => (
				<div className="hv2-bar-group" key={axis}>
					<span className="hv2-bar-label">{AXIS_LABELS[axis]}</span>
					{AXIS_OPTIONS[axis].map((opt) => (
						<button
							type="button"
							key={opt}
							className={`hv2-bar-btn${axes[axis] === opt ? " hv2-bar-on" : ""}`}
							onClick={() => onAxes({ ...axes, [axis]: opt })}
						>
							{opt}
						</button>
					))}
				</div>
			))}
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
			{/* any axis change restarts the loop cleanly */}
			<Hv2Engine key={`${axes.layout}-${axes.pace}-${axes.view}`} axes={axes} />
			<Hv2Bar axes={axes} onAxes={onAxes} />
		</>
	);
}
