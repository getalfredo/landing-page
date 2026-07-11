// PROTOTYPE variant N — "Hero Demo, click-driven" (wayfinder #12, throwaway).
// One interactive hero console replacing the auto-playing acts. Two screens
// (DEPLOY, DASHBOARD) inside one fixed-height glass — the user clicks
// through; nothing advances on its own except the boot readout after a
// deliberate Deploy click. Button scheme (picked from the 6-way affordance
// round): exactly ONE "next step" button is hot at a time, walking the
// guided cycle Deploy → Show dashboard → + New project. The hot button is
// an amber keycap with an amber breathing pulse and a blinking LED dot;
// every other button (incl. Join waitlist) is the calm bone keycap.
// Extended for wayfinder #16: the H1 product word cycles via CyclingWord
// (mechanism under exploration — see h1-cycle.tsx, `?h1=` picker).
// Extended for wayfinder #20: the deploy screen reads as a form being
// filled in — typewriter project name, ghost-click circles checking the
// integrations, then Deploy arms. Boot is much quicker; Deploy goes
// inactive once used, until + New project resets the form. The fill
// trigger is under exploration via `?fill=` (attract | first | step).
// Extended for wayfinder #22: dashboard screen reworked against the
// truth-list (#14) and the intent grouping (#19) — tile row is now
// ACTIVITY · MAIL · MONEY · HEALTH, the bay count lives on the
// mini-terminal line, and the deploy checklist etches the real
// integrations (secrets dropped: invisible wiring, not an integration).
// The cards region under the tiles is under exploration via `?dash=`
// (cards | ledger | columns).
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
	CyclingWord,
	type H1Mode,
	type H1Run,
} from "#/components/prototype/h1-cycle";

const ALL_SERVICES = [
	{ id: "auth", label: "Auth", spec: "better-auth, sessions + oauth" },
	{ id: "email", label: "Email", spec: "postmark, transactional" },
	{ id: "db", label: "Database", spec: "convex, live queries" },
	{ id: "analytics", label: "Analytics", spec: "umami, cookieless" },
	{ id: "pay", label: "Payments", spec: "creem, checkout + billing" },
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

// The three candidate answers to "when does the form-fill play?" — the
// ruling this round decides (ticket #20). Attract is the working default.
export type FillMode = "attract" | "first" | "step";
export const FILL_MODES: Record<FillMode, string> = {
	attract: "fill plays on load; deploy stays user-driven",
	first: "form idles until the first click on the console",
	step: "every click on the console runs one fill action",
};

// The three candidate answers to "how do the project cards express the
// four intents?" — ticket #22 ruled: ledger. Cards and columns stay
// switchable as iteration history.
export type DashMode = "cards" | "ledger" | "columns";
export const DASH_MODES: Record<DashMode, string> = {
	cards: "project cards, concrete stats under the intent tiles",
	ledger: "one matrix: project rows under the four intent columns",
	columns: "intent-major: each tile heads its own per-project column",
};

function fmt(n: number) {
	return n.toLocaleString("en-US");
}

export function VariantNHeroDemo({
	h1Mode = "flip",
	h1Run = "loop",
	fill = "attract",
	dash = "ledger",
}: {
	h1Mode?: H1Mode;
	h1Run?: H1Run;
	fill?: FillMode;
	dash?: DashMode;
}) {
	const [screen, setScreen] = useState<"deploy" | "dash">("deploy");
	// #20: the form starts empty and fills itself — nothing pre-checked.
	const [on, setOn] = useState<Record<string, boolean>>(
		Object.fromEntries(ALL_SERVICES.map((s) => [s.id, false])),
	);
	const [typed, setTyped] = useState(0);
	const [ring, setRing] = useState<string | null>(null);
	const [started, setStarted] = useState(false);
	const [fillDone, setFillDone] = useState(false);
	const [formSpent, setFormSpent] = useState(false);
	const [booting, setBooting] = useState(false);
	const [bootKey, setBootKey] = useState(0);
	const [bootSnap, setBootSnap] = useState<string[] | null>(null);
	const [deployed, setDeployed] = useState(false);
	const [armed, setArmed] = useState(false);
	const [fleet, setFleet] = useState(FLEET_START);
	const [newborn, setNewborn] = useState(NEWBORN_START);
	const [joined, setJoined] = useState(false);

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

	// ---- the fill sequence: type the name, ghost-click each box ----
	const busy = useRef(false);
	const stepIdx = useRef(0);

	const typeName = (then?: () => void) => {
		busy.current = true;
		for (let i = 1; i <= PROJECT_NAME.length; i++) {
			t(() => setTyped(i), 70 * i);
		}
		t(
			() => {
				busy.current = false;
				then?.();
			},
			70 * PROJECT_NAME.length + 380,
		);
	};
	const checkOne = (idx: number, then?: () => void) => {
		busy.current = true;
		const id = ALL_SERVICES[idx].id;
		setRing(id);
		t(() => setOn((prev) => ({ ...prev, [id]: true })), 170);
		t(() => setRing(null), 520);
		t(() => {
			busy.current = false;
			then?.();
		}, 460);
	};
	const fillFrom = (idx: number) => {
		if (idx >= ALL_SERVICES.length) {
			setFillDone(true);
			return;
		}
		checkOne(idx, () => fillFrom(idx + 1));
	};
	const runAll = () => {
		setStarted(true);
		typeName(() => fillFrom(0));
	};
	const skipToFilled = () => {
		setTyped(PROJECT_NAME.length);
		setOn(Object.fromEntries(ALL_SERVICES.map((s) => [s.id, true])));
		setStarted(true);
		setFillDone(true);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: mount-only — mode switches remount via key
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			skipToFilled();
			return;
		}
		if (fill === "attract") t(runAll, 700);
	}, []);

	// first/step modes: clicks on the glass drive the fill.
	const onGlassClick = () => {
		if (fillDone || busy.current) return;
		if (fill === "first") {
			if (!started) runAll();
			return;
		}
		if (fill === "step") {
			const i = stepIdx.current;
			if (i === 0) {
				setStarted(true);
				typeName();
			} else if (i <= ALL_SERVICES.length) {
				checkOne(
					i - 1,
					i === ALL_SERVICES.length ? () => setFillDone(true) : undefined,
				);
			}
			stepIdx.current = i + 1;
		}
	};

	const deploy = () => {
		if (!fillDone || formSpent || chosen.length === 0 || booting) return;
		const lines = [
			`> alfredo up ${PROJECT_NAME} --with ${chosen.map((s) => s.id).join(",")}`,
			...chosen.map((s) => `${s.id} ${".".repeat(16 - s.id.length)} ok`),
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
		stepIdx.current = 0;
		setStarted(false);
		// the click itself was the interaction — refill without another wait
		if (fill !== "step") t(runAll, 450);
	};

	// Live tick — dashboard data breathes whether or not it's on screen.
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

	const shown = deployed ? [...fleet, newborn] : fleet;
	const totViews = shown.reduce((a, p) => a + p.views, 0);
	const totMail = shown.reduce((a, p) => a + p.mail, 0);
	const totBounce = shown.reduce((a, p) => a + p.bounce, 0);
	const totEur = shown.reduce((a, p) => a + p.eur, 0);
	const busiest = shown.reduce((a, p) => (p.views > a.views ? p : a));

	// The locked #19 tile row — ACTIVITY · MAIL · MONEY · HEALTH. Providers
	// (truth-list, #14) are etched where the dash mode has room for them.
	const TILES = [
		{
			key: "activity",
			etch: "ACTIVITY",
			prov: "UMAMI · BETTER-AUTH · GITHUB",
			num: fmt(totViews),
			note: `busiest: ${busiest.name}`,
		},
		{
			key: "mail",
			etch: "MAIL",
			prov: "POSTMARK",
			num: fmt(totMail),
			note: `${totBounce} bounced`,
		},
		{
			key: "money",
			etch: "MONEY",
			prov: "CREEM",
			num: `€ ${fmt(totEur)}`,
			note: "0 failed charges",
		},
		{
			key: "health",
			etch: "HEALTH",
			prov: "UPTIME KUMA · SENTRY",
			num: `${shown.length}/${shown.length} up`,
			note: "0 open issues",
		},
	];
	const colValue = (key: string, p: Project) =>
		key === "activity"
			? fmt(p.views)
			: key === "mail"
				? String(p.mail)
				: key === "money"
					? `€ ${fmt(p.eur)}`
					: `up ${p.up}`;

	// Exactly one hot button at a time: Deploy → Show dashboard → + New project.
	// Deploy only arms once the form has filled itself; once used it never
	// re-arms for this form (#20).
	const next: "deploy" | "dash" | "new" | null = booting
		? null
		: screen === "dash"
			? "new"
			: armed
				? "dash"
				: fillDone && !formSpent
					? "deploy"
					: null;
	const btnClass = (key: "deploy" | "dash" | "new") =>
		`wcn-btn ${next === key ? "wcn-btn-next" : "wcn-btn-keycap"}`;

	return (
		<div className="wcn">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{stylesN}</style>

			<header className="wcn-head">
				<span className="wcn-wordmark">
					Alfredo
					<span className="wcn-wordmark-led" aria-hidden="true" />
				</span>
				<span className="wcn-etch">SELF-HOSTED</span>
			</header>

			<main>
				<section className="wcn-hero">
					<h1 className="wcn-h1">
						Ship your next{" "}
						<CyclingWord key={`${h1Mode}-${h1Run}`} mode={h1Mode} run={h1Run} />{" "}
						in minutes.
						<br />
						Watch them all from <span className="wcn-green">one console.</span>
					</h1>
					<p className="wcn-sub">
						Auth, email, database, analytics — wired once, on your own server.
						And because Alfredo wired them, it watches them all.
					</p>
				</section>

				{/* biome-ignore lint/a11y/useKeyWithClickEvents: prototype — the glass itself is the fill trigger in first/step modes */}
				<section
					className="wcn-bezel"
					aria-label="Alfredo console demo"
					onClick={onGlassClick}
				>
					<div className="wcn-bezel-top">
						<span className="wcn-etch">ALFREDO OS 0.1</span>
						<span className="wcn-etch">
							CONSOLE / {screen === "dash" ? "DASHBOARD" : "DEPLOY"}
						</span>
						<span className="wcn-etch">UNIT 000-001</span>
					</div>

					<div className="wcn-app">
						<div className="wcn-appbar">
							<span className="wcn-etch">
								{screen === "dash" ? "FLEET OVERVIEW" : "NEW PROJECT"}
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
													onClick={() =>
														setOn((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
													}
												>
													<span className="wcn-box" aria-hidden="true">
														{on[s.id] ? "✓" : ""}
													</span>
													<span className="wcn-check-name">{s.label}</span>
													<span className="wcn-check-spec">{s.spec}</span>
													{ring === s.id && (
														<span
															className="wcn-clickring"
															aria-hidden="true"
														/>
													)}
												</button>
											))}
										</div>
										<div className="wcn-panel-foot">
											<button
												type="button"
												className={btnClass("deploy")}
												disabled={
													!fillDone ||
													formSpent ||
													chosen.length === 0 ||
													booting
												}
												onClick={deploy}
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
												{!fillDone && fill === "first" && !started
													? "click the console to begin "
													: !fillDone && fill === "step"
														? "click — next step "
														: ""}
												<span className="wcn-cursor" aria-hidden="true" />
											</div>
										)}
									</div>
								</div>
							)}

							{screen === "dash" && (
								<div className="wcn-dash">
									{/* the locked tile row; in ledger mode it doubles as the column header */}
									{dash !== "columns" && (
										<div
											className={dash === "ledger" ? "wcn-lgrid" : "wcn-tiles"}
										>
											{dash === "ledger" && (
												<div className="wcn-lspacer">
													<span className="wcn-etch">PROJECT</span>
												</div>
											)}
											{TILES.map((tl) => (
												<div className="wcn-tile" key={tl.key}>
													<span className="wcn-etch">{tl.etch}</span>
													<span className="wcn-tile-num">{tl.num}</span>
													<span className="wcn-tile-note">{tl.note}</span>
												</div>
											))}
										</div>
									)}

									{dash === "cards" && (
										<div className="wcn-cards">
											{shown.map((p) => (
												<article
													className={`wcn-card${p.name === newborn.name ? " wcn-new" : ""}`}
													key={p.name}
												>
													<div className="wcn-card-head">
														<span className="wcn-card-name">
															<span className="wcn-led" aria-hidden="true" />
															{p.name}
														</span>
														<span className="wcn-etch">UP {p.up}</span>
													</div>
													<div className="wcn-loadbar" aria-hidden="true">
														{SEGMENTS.map((segId, s) => (
															<span
																className={`wcn-seg${s < p.load ? " wcn-seg-lit" : ""}`}
																key={segId}
															/>
														))}
													</div>
													<div className="wcn-card-stats">
														<span className="wcn-stat">
															<span className="wcn-etch">VIEWS</span>
															<span className="wcn-mono">{fmt(p.views)}</span>
														</span>
														<span className="wcn-stat">
															<span className="wcn-etch">MAIL</span>
															<span className="wcn-mono">{p.mail}</span>
														</span>
														<span className="wcn-stat">
															<span className="wcn-etch">EUR</span>
															<span className="wcn-mono">{fmt(p.eur)}</span>
														</span>
													</div>
												</article>
											))}
										</div>
									)}

									{dash === "ledger" && (
										<div className="wcn-lrows">
											{shown.map((p) => (
												<div
													className={`wcn-lrow${p.name === newborn.name ? " wcn-new" : ""}`}
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
														<span className="wcn-cell-sub">
															{p.bounce} bounced
														</span>
													</div>
													<div className="wcn-lcell">
														<span className="wcn-mono">€ {fmt(p.eur)}</span>
														<span className="wcn-cell-sub">
															{p.fail} failed
														</span>
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
									)}

									{dash === "columns" && (
										<div className="wcn-cols">
											{TILES.map((tl) => (
												<div className="wcn-col" key={tl.key}>
													<div className="wcn-col-head">
														<span className="wcn-etch">{tl.etch}</span>
														<span className="wcn-tile-num">{tl.num}</span>
														<span className="wcn-etch wcn-col-prov">
															{tl.prov}
														</span>
													</div>
													<div className="wcn-colrows">
														{shown.map((p) => (
															<div
																className={`wcn-colrow${p.name === newborn.name ? " wcn-new" : ""}`}
																key={p.name}
															>
																<span className="wcn-colrow-name">
																	{tl.key === "health" && (
																		<span
																			className="wcn-led"
																			aria-hidden="true"
																		/>
																	)}
																	{p.name}
																</span>
																<span className="wcn-mono wcn-colrow-num">
																	{colValue(tl.key, p)}
																</span>
															</div>
														))}
													</div>
												</div>
											))}
										</div>
									)}

									<div className="wcn-dash-term">
										<span className="wcn-term-mini">
											{"> fleet — "}
											{shown.length}
											{" projects · bay 00"}
											{shown.length + 1}
											{" free"}
										</span>
										<span className="wcn-cursor" aria-hidden="true" />
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="wcn-bezel-bottom">
						<span className="wcn-etch wcn-microprint">
							ONE BOX · ONE CONSOLE · N PROJECTS
						</span>
					</div>
				</section>

				<section className="wcn-ctawrap">
					<form
						className="wcn-cta"
						onSubmit={(e) => {
							e.preventDefault();
							setJoined(true);
						}}
					>
						{joined ? (
							<p className="wcn-joined">WAITLIST ● CONFIRMED</p>
						) : (
							<>
								<label className="wcn-slot">
									<span className="wcn-etch wcn-slot-label">OPERATOR</span>
									<input
										className="wcn-input"
										type="email"
										required
										placeholder="you@yourdomain.dev"
										aria-label="Email address"
									/>
								</label>
								<button
									className="wcn-key wcn-btn wcn-btn-keycap"
									type="submit"
								>
									Join waitlist
								</button>
							</>
						)}
					</form>
				</section>
			</main>

			<footer className="wcn-foot">
				<span className="wcn-etch wcn-microprint">
					ALFREDO · THE HOME FOR YOUR PROJECTS · SELF-HOSTED, YOURS FOREVER
				</span>
			</footer>
		</div>
	);
}

// Dev-only picker for the #20 fill-trigger ruling, mirroring H1CyclePicker.
export function FillModePicker({ fill }: { fill: FillMode }) {
	const navigate = useNavigate();

	if (import.meta.env.PROD) return null;

	const set = (f: FillMode) =>
		navigate({
			to: "/",
			search: (prev) => ({
				variant: prev.variant ?? "n",
				h1: prev.h1 ?? "flip",
				h1run: prev.h1run ?? "loop",
				fill: f,
				dash: prev.dash ?? "ledger",
			}),
			replace: true,
		});

	return (
		<div style={fillPickerStyle}>
			<span style={{ opacity: 0.55, marginRight: 2 }}>FILL</span>
			{(Object.keys(FILL_MODES) as FillMode[]).map((f) => (
				<button
					type="button"
					key={f}
					onClick={() => set(f)}
					style={fillPickerBtn(f === fill)}
					title={FILL_MODES[f]}
				>
					{f}
				</button>
			))}
		</div>
	);
}

// Dev-only picker for the #22 dashboard-treatment ruling.
export function DashModePicker({ dash }: { dash: DashMode }) {
	const navigate = useNavigate();

	if (import.meta.env.PROD) return null;

	const set = (d: DashMode) =>
		navigate({
			to: "/",
			search: (prev) => ({
				variant: prev.variant ?? "n",
				h1: prev.h1 ?? "flip",
				h1run: prev.h1run ?? "loop",
				fill: prev.fill ?? "attract",
				dash: d,
			}),
			replace: true,
		});

	return (
		<div style={{ ...fillPickerStyle, bottom: 112 }}>
			<span style={{ opacity: 0.55, marginRight: 2 }}>DASH</span>
			{(Object.keys(DASH_MODES) as DashMode[]).map((d) => (
				<button
					type="button"
					key={d}
					onClick={() => set(d)}
					style={fillPickerBtn(d === dash)}
					title={DASH_MODES[d]}
				>
					{d}
				</button>
			))}
		</div>
	);
}

const fillPickerStyle: React.CSSProperties = {
	position: "fixed",
	bottom: 64,
	left: 16,
	zIndex: 9999,
	display: "flex",
	alignItems: "center",
	gap: 6,
	background: "#111",
	color: "#fff",
	borderRadius: 999,
	padding: "8px 12px",
	boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
	fontFamily: "ui-monospace, monospace",
	fontSize: 12,
};

const fillPickerBtn = (active: boolean): React.CSSProperties => ({
	background: active ? "#ffd23c" : "#333",
	color: active ? "#111" : "#fff",
	border: "none",
	borderRadius: 999,
	padding: "4px 10px",
	cursor: "pointer",
	fontFamily: "inherit",
	fontSize: 12,
});

const stylesN = `
.wcn {
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
.wcn-etch {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	font-weight: 400;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--paper-soft);
}
.wcn-mono {
	font-family: "IBM Plex Mono", monospace;
	font-size: 14px;
	font-variant-numeric: tabular-nums;
}
.wcn-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.wcn-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.wcn-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 9px var(--led-glow);
}
.wcn-hero { text-align: center; padding: 56px 24px 0; }
.wcn-h1 {
	margin: 0;
	font-size: clamp(34px, 5vw, 58px);
	font-weight: 700;
	line-height: 1.06;
	letter-spacing: -0.04em;
}
.wcn-green { color: var(--green-text); text-shadow: 0 0 22px rgba(88, 232, 92, 0.35); }
.wcn-sub {
	margin: 22px auto 0;
	max-width: 56ch;
	font-size: 17px;
	line-height: 1.6;
	color: #b3ad9b;
}
.wcn-bezel {
	max-width: 980px;
	margin: 48px auto 0;
	padding: 0 24px;
}
.wcn-bezel-top,
.wcn-bezel-bottom {
	background: var(--panel);
	border: 1px solid var(--seam);
	display: flex;
	justify-content: space-between;
	padding: 10px 24px;
}
.wcn-bezel-top { border-radius: 14px 14px 0 0; border-bottom: none; }
.wcn-bezel-bottom {
	border-radius: 0 0 14px 14px;
	border-top: none;
	justify-content: center;
	box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
/* Fixed-height glass: the two screens swap inside, nothing reflows. */
.wcn-app {
	background: var(--surface);
	border: 1px solid var(--seam);
	height: 560px;
	display: flex;
	flex-direction: column;
	box-shadow: inset 0 4px 18px rgba(0, 0, 0, 0.6);
}
.wcn-appbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 22px;
	border-bottom: 1px solid var(--seam);
	flex-shrink: 0;
	min-height: 58px;
}
.wcn-stage { flex: 1; padding: 20px 22px; overflow: hidden; position: relative; }
.wcn-deployview {
	display: grid;
	grid-template-columns: 420px 1fr;
	gap: 18px;
	height: 100%;
	animation: wcn-in 0.25s ease both;
}
.wcn-panel {
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 12px;
	display: flex;
	flex-direction: column;
}
.wcn-panel-head {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding: 13px 18px;
	border-bottom: 1px solid var(--seam);
}
.wcn-projname { color: var(--green-text); }
.wcn-checks { display: flex; flex-direction: column; padding: 6px 0; flex: 1; }
.wcn-check {
	display: grid;
	grid-template-columns: 22px 100px 1fr;
	gap: 12px;
	align-items: center;
	text-align: left;
	background: none;
	border: none;
	padding: 11px 18px;
	cursor: pointer;
	font-family: inherit;
	color: var(--paper);
	position: relative;
}
/* #20: the ghost click — an amber ring rippling out from the checkbox */
.wcn-clickring {
	position: absolute;
	left: 28px;
	top: 50%;
	width: 36px;
	height: 36px;
	margin: -18px 0 0 -18px;
	border: 2px solid var(--amber);
	border-radius: 50%;
	pointer-events: none;
	animation: wcn-ring 0.5s ease-out both;
}
@keyframes wcn-ring {
	from { transform: scale(0.3); opacity: 0.95; }
	to { transform: scale(1.5); opacity: 0; }
}
.wcn-check:hover { background: rgba(236, 231, 218, 0.03); }
.wcn-check:disabled { cursor: default; }
.wcn-box {
	width: 20px;
	height: 20px;
	border-radius: 5px;
	border: 1px solid var(--seam);
	background: var(--display-bg);
	color: var(--green-text);
	font-size: 14px;
	line-height: 18px;
	text-align: center;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6);
	text-shadow: 0 0 6px rgba(88, 232, 92, 0.5);
}
.wcn-check[aria-pressed="false"] .wcn-check-name,
.wcn-check[aria-pressed="false"] .wcn-check-spec { opacity: 0.45; }
.wcn-check-name { font-weight: 700; font-size: 15px; letter-spacing: -0.01em; }
.wcn-check-spec {
	font-family: "IBM Plex Mono", monospace;
	font-size: 11px;
	color: var(--paper-soft);
}
.wcn-panel-foot {
	display: flex;
	padding: 13px 18px;
	border-top: 1px solid var(--seam);
}
.wcn-panel-foot .wcn-btn { width: 100%; }
.wcn-term {
	background: var(--display-bg);
	border: 1px solid var(--seam);
	border-radius: 10px;
	padding: 16px 20px;
	font-family: "VT323", monospace;
	font-size: 18px;
	line-height: 1.55;
	color: var(--display-text);
	box-shadow: inset 0 3px 12px rgba(0, 0, 0, 0.8);
	overflow: hidden;
}
.wcn-term-line {
	opacity: 0;
	animation: wcn-on 0.05s linear forwards;
	text-shadow: 0 0 7px rgba(88, 232, 92, 0.45);
	white-space: pre;
}
.wcn-term-line:last-of-type { color: var(--amber); text-shadow: 0 0 7px rgba(255, 210, 60, 0.4); }
.wcn-term-line:first-of-type { color: var(--display-text); }
.wcn-dash { display: flex; flex-direction: column; gap: 14px; height: 100%; animation: wcn-in 0.25s ease both; }
.wcn-tiles {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 10px;
	flex-shrink: 0;
}
.wcn-tile {
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 10px;
	padding: 12px 16px;
	display: flex;
	flex-direction: column;
	gap: 4px;
}
.wcn-tile-num {
	font-size: 24px;
	font-weight: 700;
	letter-spacing: -0.02em;
	font-variant-numeric: tabular-nums;
}
.wcn-tile-note {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	color: var(--paper-soft);
}
.wcn-cards {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 10px;
	flex: 1;
}
.wcn-card {
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 10px;
	padding: 14px 16px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 10px;
}
/* #22: the newborn project pops into whichever structure is on screen */
.wcn-new { animation: wcn-in 0.35s ease both; }

/* #22 ledger mode — tiles double as column headers, projects as rows */
.wcn-lgrid,
.wcn-lrow {
	display: grid;
	grid-template-columns: 150px repeat(4, 1fr);
	gap: 10px;
}
.wcn-lgrid { flex-shrink: 0; }
.wcn-lspacer { display: flex; align-items: flex-end; padding: 0 4px 12px; }
.wcn-lrows {
	display: flex;
	flex-direction: column;
	gap: 10px;
	flex: 1;
	overflow: hidden;
}
.wcn-lcell {
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 10px;
	padding: 10px 14px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 4px;
}
.wcn-lname { justify-content: center; }
.wcn-cell-sub {
	font-family: "IBM Plex Mono", monospace;
	font-size: 9px;
	letter-spacing: 0.08em;
	color: var(--paper-soft);
}

/* #22 columns mode — each intent tile heads its own per-project column */
.wcn-cols {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 10px;
	flex: 1;
}
.wcn-col {
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.wcn-col-head {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 12px 14px;
	border-bottom: 1px solid var(--seam);
}
.wcn-col-prov { font-size: 8px; opacity: 0.7; }
.wcn-colrows { display: flex; flex-direction: column; padding: 6px 0; }
.wcn-colrow {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
	padding: 8px 14px;
}
.wcn-colrow-name {
	display: inline-flex;
	align-items: center;
	gap: 7px;
	font-size: 12px;
	font-weight: 500;
	letter-spacing: -0.01em;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.wcn-colrow-num { font-size: 12px; }
.wcn-card-head {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 8px;
}
.wcn-card-name {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	font-weight: 700;
	font-size: 15px;
	letter-spacing: -0.01em;
}
.wcn-led {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 7px var(--led-glow);
	flex-shrink: 0;
}
.wcn-led-off { background: var(--led-off); box-shadow: none; }
.wcn-loadbar { display: flex; gap: 3px; }
.wcn-seg {
	flex: 1;
	height: 5px;
	border-radius: 2px;
	background: var(--led-off);
	transition: background 0.3s ease;
}
.wcn-seg-lit { background: var(--led); box-shadow: 0 0 4px rgba(59, 210, 59, 0.4); }
.wcn-card-stats { display: flex; justify-content: space-between; gap: 8px; }
.wcn-stat { display: flex; flex-direction: column; gap: 2px; }
.wcn-dash-term {
	display: flex;
	align-items: center;
	gap: 8px;
	background: var(--display-bg);
	border: 1px solid var(--seam);
	border-radius: 10px;
	padding: 10px 16px;
	box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.7);
	flex-shrink: 0;
}
.wcn-term-mini {
	font-family: "VT323", monospace;
	font-size: 16px;
	color: var(--display-text);
	text-shadow: 0 0 6px rgba(88, 232, 92, 0.4);
	white-space: pre;
}
.wcn-cursor {
	display: inline-block;
	width: 0.5em;
	height: 1em;
	background: var(--display-text);
	animation: wcn-blink 1s steps(1) infinite;
	vertical-align: text-bottom;
}

/* ---------- Buttons ---------- */
.wcn-btn {
	border: none;
	border-radius: 10px;
	padding: 9px 24px;
	font-family: inherit;
	font-size: 14px;
	font-weight: 700;
	letter-spacing: 0.02em;
	cursor: pointer;
	transition: transform 0.06s ease, box-shadow 0.06s ease, background 0.15s ease, padding 0.15s ease;
}
.wcn-btn:disabled { opacity: 0.4; cursor: not-allowed; animation: none !important; }
.wcn-action { padding: 8px 20px; }

/* calm keycap — every button that is not the next step (identity v2 spec) */
.wcn-btn-keycap {
	background: linear-gradient(180deg, #f6f3ea 0%, #e4dfd3 100%);
	color: #1c1913;
	box-shadow: 0 3px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85);
}
.wcn-btn-keycap:hover:not(:disabled) { background: linear-gradient(180deg, #fffdf6 0%, #ece7da 100%); }
.wcn-btn-keycap:active:not(:disabled) {
	transform: translateY(2px);
	box-shadow: 0 1px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

/* the ONE next-step button: amber keycap, amber breathing pulse, live LED dot */
.wcn-btn-next {
	background: linear-gradient(180deg, #ffd23c 0%, #eab821 100%);
	color: #1c1913;
	box-shadow: 0 3px 0 #9a7a10, inset 0 1px 0 rgba(255, 255, 255, 0.6);
	animation: wcn-amberbreath 2.2s ease-in-out infinite;
	position: relative;
	padding-left: 34px;
}
.wcn-btn-next:hover:not(:disabled) { background: linear-gradient(180deg, #ffe071 0%, #ffd23c 100%); }
.wcn-btn-next:active:not(:disabled) {
	transform: translateY(2px);
	box-shadow: 0 1px 0 #9a7a10, inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.wcn-btn-next::before {
	content: "";
	position: absolute;
	left: 14px;
	top: 50%;
	margin-top: -4px;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: #fff8e6;
	box-shadow: 0 0 8px rgba(255, 246, 220, 0.95), 0 0 0 2px rgba(28, 25, 19, 0.25);
	animation: wcn-dotblink 1.6s ease-in-out infinite;
}
@keyframes wcn-amberbreath {
	0%, 100% { box-shadow: 0 3px 0 #9a7a10, inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 0 0px rgba(255, 210, 60, 0); }
	50% { box-shadow: 0 3px 0 #9a7a10, inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 0 22px rgba(255, 210, 60, 0.5); }
}
@keyframes wcn-dotblink {
	0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(255, 246, 220, 0.95), 0 0 0 2px rgba(28, 25, 19, 0.25); }
	50% { opacity: 0.55; box-shadow: 0 0 3px rgba(255, 246, 220, 0.4), 0 0 0 2px rgba(28, 25, 19, 0.25); }
}

/* ---------- CTA + shell ---------- */
.wcn-ctawrap { display: flex; justify-content: center; padding: 48px 24px 0; }
.wcn-cta { display: flex; gap: 14px; align-items: stretch; flex-wrap: wrap; justify-content: center; }
.wcn-slot {
	display: flex;
	flex-direction: column;
	gap: 5px;
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 12px;
	padding: 10px 16px 12px;
	box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.55);
}
.wcn-slot-label { font-size: 9px; }
.wcn-input {
	border: none;
	background: transparent;
	font-family: "IBM Plex Mono", monospace;
	font-size: 15px;
	color: var(--green-text);
	min-width: 250px;
	padding: 0;
}
.wcn-input::placeholder { color: #56604a; }
.wcn-input:focus { outline: none; }
.wcn-slot:focus-within { outline: 2px solid var(--green-text); outline-offset: 2px; }
.wcn-key { padding: 10px 28px; font-size: 15px; border-radius: 12px; }
.wcn-joined {
	font-family: "IBM Plex Mono", monospace;
	font-size: 16px;
	letter-spacing: 0.1em;
	color: var(--green-text);
	align-self: center;
}
.wcn-foot { padding: 64px 24px 40px; text-align: center; }
.wcn-microprint { font-size: 9px; opacity: 0.8; }

@keyframes wcn-on { to { opacity: 1; } }
@keyframes wcn-in {
	from { opacity: 0; transform: translateY(6px); }
	to { opacity: 1; transform: translateY(0); }
}
@keyframes wcn-blink {
	0%, 49% { opacity: 1; }
	50%, 100% { opacity: 0; }
}
@media (max-width: 860px) {
	.wcn-deployview { grid-template-columns: 1fr; }
	.wcn-term { display: none; }
	.wcn-app { height: auto; min-height: 560px; }
	.wcn-cards { grid-template-columns: repeat(2, 1fr); }
	.wcn-lgrid, .wcn-lrow { grid-template-columns: 90px repeat(4, 1fr); gap: 6px; }
	.wcn-lcell { padding: 8px 8px; }
	.wcn-cols { grid-template-columns: repeat(2, 1fr); }
}
.wcn *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.wcn * { animation-duration: 0.01ms !important; animation-delay: 0s !important; transition: none !important; }
}
`;
