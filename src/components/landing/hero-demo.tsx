// The interactive hero HQ demo, promoted from prototype variant N with the
// rulings folded in: attract fill (#20), ledger dashboard as the only mode
// (#22), guided one-hot button cycle Deploy → Show dashboard → + New
// project (#12), HQ etches (#17), checklist strings per #14. Nothing
// advances on its own except the boot readout after a deliberate Deploy
// click; the attract fill is pre-step theater. Reduced-motion visitors get
// the form pre-filled. Palette arrives as CSS custom properties set inline
// on the demo root from console-tokens; hero-demo.css consumes var(--…).

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { consoleCssVars } from "#/components/landing/console-vars";
import { useLocalTime } from "#/components/landing/local-time";
import "#/components/landing/hero-demo.css";

const ALL_SERVICES = [
	{ id: "auth", label: "Auth", spec: "better-auth, sessions, oauth" },
	{ id: "email", label: "Email", spec: "postmark, transactional" },
	{ id: "db", label: "Database", spec: "convex, live data" },
	{ id: "analytics", label: "Analytics", spec: "umami, on your server" },
	{
		id: "pay",
		cliId: "payments",
		label: "Payments",
		spec: "creem, checkout + billing",
	},
];

type Project = {
	name: string;
	up: string;
	views: number;
	sig: number;
	stars: number;
	mail: number;
	bounce: number;
	eur: number;
	fail: number;
	load: number;
};

const FLEET_START: Project[] = [
	{
		name: "invoicer",
		up: "148d",
		views: 48210,
		sig: 214,
		stars: 38,
		mail: 291,
		bounce: 1,
		eur: 2840,
		fail: 0,
		load: 5,
	},
	{
		name: "shiplog",
		up: "63d",
		views: 9184,
		sig: 46,
		stars: 112,
		mail: 44,
		bounce: 0,
		eur: 348,
		fail: 0,
		load: 3,
	},
	{
		name: "pantry-api",
		up: "212d",
		views: 130552,
		sig: 0,
		stars: 421,
		mail: 812,
		bounce: 2,
		eur: 0,
		fail: 0,
		load: 8,
	},
];

const NEWBORN_START: Project = {
	name: "my-saas",
	up: "0m",
	views: 0,
	sig: 0,
	stars: 0,
	mail: 0,
	bounce: 0,
	eur: 0,
	fail: 0,
	load: 2,
};

const SEGMENTS = Array.from({ length: 10 }, (_, i) => `seg-${i}`);

const PROJECT_NAME = "my-saas";

function fmt(n: number) {
	return n.toLocaleString("en-US");
}

// Live tick — dashboard data breathes whether or not it's on screen.
function useFleetTick() {
	const [fleet, setFleet] = useState(FLEET_START);
	const [newborn, setNewborn] = useState(NEWBORN_START);

	useEffect(() => {
		const id = setInterval(() => {
			setFleet((prev) =>
				prev.map((p) => ({
					...p,
					views: p.views + Math.floor(Math.random() * 9),
					sig: Math.random() < 0.03 ? p.sig + 1 : p.sig,
					stars: Math.random() < 0.02 ? p.stars + 1 : p.stars,
					mail: Math.random() < 0.06 ? p.mail + 1 : p.mail,
					eur: p.eur > 0 && Math.random() < 0.025 ? p.eur + 49 : p.eur,
					load: Math.max(
						1,
						Math.min(10, p.load + Math.floor(Math.random() * 3) - 1),
					),
				})),
			);
			setNewborn((p) => ({
				...p,
				views: p.views + (Math.random() < 0.4 ? 1 : 0),
				sig: Math.random() < 0.008 ? p.sig + 1 : p.sig,
				mail: Math.random() < 0.01 ? p.mail + 1 : p.mail,
				load: Math.max(
					1,
					Math.min(3, p.load + Math.floor(Math.random() * 3) - 1),
				),
			}));
		}, 900);
		return () => clearInterval(id);
	}, []);

	return { fleet, newborn };
}

type Tile = { key: string; etch: string; num: string; note: string };

// #22 ledger — the tile row doubles as the column header. Presentational:
// props in, no local state.
function DashScreen({
	tiles,
	shown,
	newbornName,
}: {
	tiles: Tile[];
	shown: Project[];
	newbornName: string;
}) {
	return (
		<div className="wcn-dash">
			<div className="wcn-lgrid">
				<div className="wcn-lspacer">
					<span className="wcn-etch">PROJECT</span>
				</div>
				{tiles.map((tl) => (
					<div className="wcn-tile" key={tl.key}>
						<span className="wcn-etch">{tl.etch}</span>
						<span className="wcn-tile-num">{tl.num}</span>
						<span className="wcn-tile-note">{tl.note}</span>
					</div>
				))}
			</div>

			<div className="wcn-lrows">
				{shown.map((p) => (
					<div
						className={`wcn-lrow${p.name === newbornName ? " wcn-new" : ""}`}
						key={p.name}
					>
						<div className="wcn-lcell wcn-lname">
							<span className="wcn-card-name">
								<span className="wcn-led" aria-hidden="true" />
								{p.name}
							</span>
						</div>
						<div className="wcn-lcell">
							<span className="wcn-mono">{fmt(p.views)}</span>
							<span className="wcn-cell-sub">
								{p.sig} signups · {p.stars} stars
							</span>
						</div>
						<div className="wcn-lcell">
							<span className="wcn-mono">{p.mail}</span>
							<span className="wcn-cell-sub">{p.bounce} bounced</span>
						</div>
						<div className="wcn-lcell">
							<span className="wcn-mono">€ {fmt(p.eur)}</span>
							<span className="wcn-cell-sub">{p.fail} failed</span>
						</div>
						<div className="wcn-lcell">
							<span className="wcn-mono">up {p.up}</span>
							<div className="wcn-loadbar" aria-hidden="true">
								{SEGMENTS.map((segId, s) => (
									<span
										className={`wcn-seg${s < p.load ? " wcn-seg-lit" : ""}`}
										key={segId}
									/>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="wcn-dash-term">
				<span className="wcn-term-mini">
					{"> status — "}
					{shown.length}
					{" projects · bay 00"}
					{shown.length + 1}
					{" free"}
				</span>
				<span className="wcn-cursor" aria-hidden="true" />
			</div>
		</div>
	);
}

// Presentational: props in, no local state. Toggle/deploy behavior stays in
// HeroDemo's orchestration.
function DeployScreen({
	typed,
	on,
	ring,
	booting,
	fillDone,
	formSpent,
	chosenCount,
	bootSnap,
	bootKey,
	btnClass,
	onToggle,
	onDeploy,
}: {
	typed: number;
	on: Record<string, boolean>;
	ring: string | null;
	booting: boolean;
	fillDone: boolean;
	formSpent: boolean;
	chosenCount: number;
	bootSnap: string[] | null;
	bootKey: number;
	btnClass: (key: "deploy" | "dash" | "new") => string;
	onToggle: (id: string) => void;
	onDeploy: () => void;
}) {
	return (
		<div className="wcn-deployview">
			<div className="wcn-panel">
				<div className="wcn-panel-head">
					<span className="wcn-etch">PROJECT</span>
					<span className="wcn-mono wcn-projname">
						{PROJECT_NAME.slice(0, typed)}
						{typed < PROJECT_NAME.length && (
							<span className="wcn-cursor" aria-hidden="true" />
						)}
					</span>
				</div>
				<div className="wcn-checks">
					{ALL_SERVICES.map((s) => (
						<button
							type="button"
							className="wcn-check"
							key={s.id}
							aria-pressed={on[s.id]}
							disabled={booting || !fillDone}
							onClick={() => onToggle(s.id)}
						>
							<span className="wcn-box" aria-hidden="true">
								{on[s.id] ? "✓" : ""}
							</span>
							<span className="wcn-check-name">{s.label}</span>
							<span className="wcn-check-spec">{s.spec}</span>
							{ring === s.id && (
								<span className="wcn-clickring" aria-hidden="true" />
							)}
						</button>
					))}
				</div>
				<div className="wcn-panel-foot">
					<button
						type="button"
						className={btnClass("deploy")}
						disabled={!fillDone || formSpent || chosenCount === 0 || booting}
						onClick={onDeploy}
					>
						Deploy
					</button>
				</div>
			</div>

			<div className="wcn-term">
				{bootSnap ? (
					<div key={bootKey}>
						{bootSnap.map((line, i) => (
							<div
								className="wcn-term-line"
								key={line}
								style={
									booting
										? { animationDelay: `${0.15 + i * 0.12}s` }
										: { opacity: 1 }
								}
							>
								{line}
							</div>
						))}
					</div>
				) : (
					<div className="wcn-term-line" style={{ opacity: 1 }}>
						{"> "}
						<span className="wcn-cursor" aria-hidden="true" />
					</div>
				)}
			</div>
		</div>
	);
}

export function HeroDemo() {
	const [screen, setScreen] = useState<"deploy" | "dash">("deploy");
	// #20: the form starts empty and fills itself — nothing pre-checked.
	const [on, setOn] = useState<Record<string, boolean>>(
		Object.fromEntries(ALL_SERVICES.map((s) => [s.id, false])),
	);
	const [typed, setTyped] = useState(0);
	const [ring, setRing] = useState<string | null>(null);
	const [fillDone, setFillDone] = useState(false);
	const [formSpent, setFormSpent] = useState(false);
	const [booting, setBooting] = useState(false);
	const [bootKey, setBootKey] = useState(0);
	const [bootSnap, setBootSnap] = useState<string[] | null>(null);
	const [deployed, setDeployed] = useState(false);
	const [armed, setArmed] = useState(false);
	const { fleet, newborn } = useFleetTick();
	const { hhmm, glow } = useLocalTime();

	const timers = useRef<number[]>([]);
	const t = (fn: () => void, ms: number) => {
		timers.current.push(window.setTimeout(fn, ms));
	};
	useEffect(
		() => () => {
			for (const id of timers.current) clearTimeout(id);
		},
		[],
	);

	const chosen = ALL_SERVICES.filter((s) => on[s.id]);

	// ---- the attract fill: type the name, ghost-click each box ----
	const checkOne = (idx: number, then?: () => void) => {
		const id = ALL_SERVICES[idx].id;
		setRing(id);
		t(() => setOn((prev) => ({ ...prev, [id]: true })), 170);
		t(() => setRing(null), 520);
		t(() => then?.(), 460);
	};
	const fillFrom = (idx: number) => {
		if (idx >= ALL_SERVICES.length) {
			setFillDone(true);
			return;
		}
		checkOne(idx, () => fillFrom(idx + 1));
	};
	const runAll = () => {
		for (let i = 1; i <= PROJECT_NAME.length; i++) {
			t(() => setTyped(i), 70 * i);
		}
		t(() => fillFrom(0), 70 * PROJECT_NAME.length + 380);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: mount-only attract sequence
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			// #20 per the #16 precedent: reduced motion gets the form pre-filled.
			setTyped(PROJECT_NAME.length);
			setOn(Object.fromEntries(ALL_SERVICES.map((s) => [s.id, true])));
			setFillDone(true);
			return;
		}
		t(runAll, 700);
	}, []);

	const deploy = () => {
		if (!fillDone || formSpent || chosen.length === 0 || booting) return;
		const lines = [
			`> alfredo up ${PROJECT_NAME} --with ${chosen.map((s) => s.cliId ?? s.id).join(",")}`,
			...chosen.map((s) => {
				const cli = s.cliId ?? s.id;
				return `${cli} ${".".repeat(16 - cli.length)} ok`;
			}),
			`READY  00:0${Math.min(9, chosen.length)}`,
		];
		setBootKey((k) => k + 1);
		setBootSnap(lines);
		setBooting(true);
		setFormSpent(true); // Deploy stays inactive from here on (#20)
		setArmed(false);
		// #20: much quicker — the dashboard is ready right behind the boot.
		t(
			() => {
				setBooting(false);
				setDeployed(true);
				setArmed(true);
			},
			250 + lines.length * 120,
		);
	};

	const newProject = () => {
		setScreen("deploy");
		setArmed(false);
		setFormSpent(false);
		setFillDone(false);
		setTyped(0);
		setOn(Object.fromEntries(ALL_SERVICES.map((s) => [s.id, false])));
		setBootSnap(null);
		// the click itself was the interaction — refill without another wait
		t(runAll, 450);
	};

	const shown = deployed ? [...fleet, newborn] : fleet;
	const totViews = shown.reduce((a, p) => a + p.views, 0);
	const totMail = shown.reduce((a, p) => a + p.mail, 0);
	const totBounce = shown.reduce((a, p) => a + p.bounce, 0);
	const totEur = shown.reduce((a, p) => a + p.eur, 0);
	const busiest = shown.reduce((a, p) => (p.views > a.views ? p : a));

	// The locked #19/#22 tile row — ACTIVITY · MAIL · MONEY · HEALTH; the
	// hero dashboard stays intent-only, no provider etches (#22).
	const TILES = [
		{
			key: "activity",
			etch: "ACTIVITY",
			num: fmt(totViews),
			note: `busiest: ${busiest.name}`,
		},
		{
			key: "mail",
			etch: "MAIL",
			num: fmt(totMail),
			note: `${totBounce} bounced`,
		},
		{
			key: "money",
			etch: "MONEY",
			num: `€ ${fmt(totEur)}`,
			note: "0 failed charges",
		},
		{
			key: "health",
			etch: "HEALTH",
			num: `${shown.length}/${shown.length} up`,
			note: "0 open issues",
		},
	];

	// Exactly one hot button at a time: Deploy → Show dashboard → + New project.
	const next: "deploy" | "dash" | "new" | null = booting
		? null
		: screen === "dash"
			? "new"
			: armed
				? "dash"
				: fillDone && !formSpent && chosen.length > 0
					? "deploy"
					: null;
	const btnClass = (key: "deploy" | "dash" | "new") =>
		`lp-btn ${next === key ? "lp-btn-next" : "lp-btn-keycap"}`;

	return (
		<section
			className="wcn-bezel"
			aria-label="Alfredo HQ demo"
			style={{ ...consoleCssVars, "--tod-glow": glow } as CSSProperties}
		>
			<div className="wcn-bezel-top">
				<span className="wcn-etch">ALFREDO OS 0.1</span>
				<span className="wcn-etch">
					HQ / {screen === "dash" ? "DASHBOARD" : "DEPLOY"}
				</span>
				<span className="wcn-etch wcn-unit">UNIT 000-001</span>
				{/* #53: the visitor's real wall clock — the demo's one live detail */}
				<span className="wcn-etch wcn-clock">{hhmm ?? "--:--"}</span>
			</div>

			<div className="wcn-app">
				<div className="wcn-appbar">
					<span className="wcn-etch">
						{screen === "dash" ? "PROJECT OVERVIEW" : "NEW PROJECT"}
					</span>
					{screen === "deploy" ? (
						// Only exists once it IS the next step — no idle affordance.
						next === "dash" && (
							<button
								type="button"
								className={`wcn-action ${btnClass("dash")}`}
								onClick={() => setScreen("dash")}
							>
								Show dashboard →
							</button>
						)
					) : (
						<button
							type="button"
							className={`wcn-action ${btnClass("new")}`}
							onClick={newProject}
						>
							+ New project
						</button>
					)}
				</div>

				<div className="wcn-stage">
					{screen === "deploy" && (
						<DeployScreen
							typed={typed}
							on={on}
							ring={ring}
							booting={booting}
							fillDone={fillDone}
							formSpent={formSpent}
							chosenCount={chosen.length}
							bootSnap={bootSnap}
							bootKey={bootKey}
							btnClass={btnClass}
							onToggle={(id) => setOn((prev) => ({ ...prev, [id]: !prev[id] }))}
							onDeploy={deploy}
						/>
					)}

					{screen === "dash" && (
						<DashScreen
							tiles={TILES}
							shown={shown}
							newbornName={newborn.name}
						/>
					)}
				</div>
			</div>

			<div className="wcn-bezel-bottom">
				<span className="wcn-etch wcn-microprint">
					YOUR SERVERS · ONE HQ · N PROJECTS
				</span>
			</div>
		</section>
	);
}
