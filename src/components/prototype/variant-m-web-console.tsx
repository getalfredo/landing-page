// PROTOTYPE variant M — "Web Console" (wayfinder #11, round 6, throwaway).
// Reframe from the round-5 reaction: Alfredo is used via webapp — click
// deploy, get a dashboard — so the glass now shows a GUI, not a terminal.
// Auto-playing product moment: deploy view (module checkboxes + Deploy)
// → boot log types (the terminal survives as an inset strip, it was too
// cute to lose) → dashboard view (insight tiles + project cards, live).
// Material stays J/L: dark anodize, etched labels, bone keycaps only.
import { useEffect, useState } from "react";

const ALL_SERVICES = [
	{ id: "auth", label: "Auth", spec: "sessions, oauth, magic links" },
	{ id: "email", label: "Email", spec: "transactional, your smtp" },
	{ id: "db", label: "Database", spec: "sqlite, migrations included" },
	{ id: "analytics", label: "Analytics", spec: "posthog, on your box" },
	{ id: "secrets", label: "Secrets", spec: "encrypted, per project" },
];

type Project = {
	name: string;
	up: string;
	req: number;
	mail: number;
	pay: number;
	eur: number;
	load: number;
};

const FLEET_START: Project[] = [
	{ name: "my-saas", up: "0d", req: 0, mail: 0, pay: 0, eur: 0, load: 2 },
	{
		name: "invoicer",
		up: "148d",
		req: 48210,
		mail: 291,
		pay: 57,
		eur: 2840,
		load: 5,
	},
	{
		name: "shiplog",
		up: "63d",
		req: 9184,
		mail: 44,
		pay: 12,
		eur: 348,
		load: 3,
	},
	{
		name: "pantry-api",
		up: "212d",
		req: 130552,
		mail: 812,
		pay: 0,
		eur: 0,
		load: 8,
	},
];

const SEGMENTS = Array.from({ length: 10 }, (_, i) => `seg-${i}`);

function fmt(n: number) {
	return n.toLocaleString("en-US");
}

export function VariantMWebConsole() {
	const [joined, setJoined] = useState(false);
	const [fleet, setFleet] = useState(FLEET_START);
	const [on, setOn] = useState<Record<string, boolean>>(
		Object.fromEntries(ALL_SERVICES.map((s) => [s.id, true])),
	);
	const [phase, setPhase] = useState<"deploy" | "boot" | "dash">("deploy");
	const [run, setRun] = useState(0);

	const chosen = ALL_SERVICES.filter((s) => on[s.id]);
	const bootLines = [
		`> alfredo up my-saas --with ${chosen.map((s) => s.id).join(",")}`,
		...chosen.map((s) => `${s.id} ${".".repeat(16 - s.id.length)} ok`),
		`READY  00:0${Math.min(9, chosen.length)}`,
	];

	// Auto-play once on load; Deploy replays with the current selection.
	useEffect(() => {
		if (run === 0) {
			const t = setTimeout(() => setPhase("boot"), 2200);
			return () => clearTimeout(t);
		}
	}, [run]);

	useEffect(() => {
		if (phase === "boot") {
			const t = setTimeout(
				() => setPhase("dash"),
				900 + bootLines.length * 380,
			);
			return () => clearTimeout(t);
		}
	}, [phase, bootLines.length]);

	useEffect(() => {
		const id = setInterval(() => {
			setFleet((prev) =>
				prev.map((p) => ({
					...p,
					req: p.req + Math.floor(Math.random() * 9),
					mail: Math.random() < 0.06 ? p.mail + 1 : p.mail,
					pay: Math.random() < 0.025 ? p.pay + 1 : p.pay,
					eur: Math.random() < 0.025 ? p.eur + 49 : p.eur,
					load: Math.max(
						1,
						Math.min(10, p.load + Math.floor(Math.random() * 3) - 1),
					),
				})),
			);
		}, 900);
		return () => clearInterval(id);
	}, []);

	const totReq = fleet.reduce((a, p) => a + p.req, 0);
	const totMail = fleet.reduce((a, p) => a + p.mail, 0);
	const totEur = fleet.reduce((a, p) => a + p.eur, 0);
	const busiest = fleet.reduce((a, p) => (p.req > a.req ? p : a));
	const earner = fleet.reduce((a, p) => (p.eur > a.eur ? p : a));

	const deploy = () => {
		setRun((r) => r + 1);
		setPhase("boot");
	};

	return (
		<div className="wcs">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{stylesM}</style>

			<header className="wcs-head">
				<span className="wcs-wordmark">
					Alfredo
					<span className="wcs-wordmark-led" aria-hidden="true" />
				</span>
				<span className="wcs-etch">SELF-HOSTED</span>
			</header>

			<main>
				<section className="wcs-hero">
					<h1 className="wcs-h1">
						Ship your next SaaS in minutes.
						<br />
						Watch them all from <span className="wcs-green">one console.</span>
					</h1>
					<p className="wcs-sub">
						Auth, email, database, analytics — wired once, on your own server.
						And because Alfredo wired them, it watches them all.
					</p>
				</section>

				<section className="wcs-bezel" aria-label="Alfredo console">
					<div className="wcs-bezel-top">
						<span className="wcs-etch">ALFREDO OS 0.1</span>
						<span className="wcs-etch">
							CONSOLE / {phase === "dash" ? "DASHBOARD" : "DEPLOY"}
						</span>
						<span className="wcs-etch">UNIT 000-001</span>
					</div>

					<div className="wcs-app">
						{phase !== "dash" && (
							<div className="wcs-deployview">
								<div className="wcs-panel">
									<div className="wcs-panel-head">
										<span className="wcs-etch">NEW PROJECT</span>
										<span className="wcs-mono wcs-projname">my-saas</span>
									</div>
									<div className="wcs-checks">
										{ALL_SERVICES.map((s) => (
											<button
												type="button"
												className="wcs-check"
												key={s.id}
												aria-pressed={on[s.id]}
												disabled={phase === "boot"}
												onClick={() =>
													setOn((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
												}
											>
												<span className="wcs-box" aria-hidden="true">
													{on[s.id] ? "✓" : ""}
												</span>
												<span className="wcs-check-name">{s.label}</span>
												<span className="wcs-check-spec">{s.spec}</span>
											</button>
										))}
									</div>
									<div className="wcs-panel-foot">
										<span className="wcs-etch">
											{chosen.length} MODULES · WIRED ONCE
										</span>
										<button
											type="button"
											className="wcs-deploy"
											disabled={chosen.length === 0 || phase === "boot"}
											onClick={deploy}
										>
											Deploy
										</button>
									</div>
								</div>

								{phase === "boot" && (
									<div className="wcs-term" key={run}>
										{bootLines.map((t, i) => (
											<div
												className="wcs-term-line"
												key={t}
												style={{ animationDelay: `${0.3 + i * 0.38}s` }}
											>
												{t}
											</div>
										))}
									</div>
								)}
							</div>
						)}

						{phase === "dash" && (
							<div className="wcs-dash">
								<div className="wcs-tiles">
									<div className="wcs-tile">
										<span className="wcs-etch">TRAFFIC</span>
										<span className="wcs-tile-num">{fmt(totReq)}</span>
										<span className="wcs-tile-note">
											busiest: {busiest.name}
										</span>
									</div>
									<div className="wcs-tile">
										<span className="wcs-etch">MAIL</span>
										<span className="wcs-tile-num">{fmt(totMail)}</span>
										<span className="wcs-tile-note">
											across {fleet.length} inboxes
										</span>
									</div>
									<div className="wcs-tile">
										<span className="wcs-etch">REVENUE</span>
										<span className="wcs-tile-num">€ {fmt(totEur)}</span>
										<span className="wcs-tile-note">top: {earner.name}</span>
									</div>
									<div className="wcs-tile">
										<span className="wcs-etch">FLEET</span>
										<span className="wcs-tile-num">
											{fleet.length}/{fleet.length}
										</span>
										<span className="wcs-tile-note">live · 0 incidents</span>
									</div>
								</div>

								<div className="wcs-cards">
									{fleet.map((p, i) => (
										<article
											className="wcs-card"
											key={p.name}
											style={{ animationDelay: `${0.15 + i * 0.1}s` }}
										>
											<div className="wcs-card-head">
												<span className="wcs-card-name">
													<span className="wcs-led" aria-hidden="true" />
													{p.name}
												</span>
												<span className="wcs-etch">UP {p.up}</span>
											</div>
											<div className="wcs-loadbar" aria-hidden="true">
												{SEGMENTS.map((segId, s) => (
													<span
														className={`wcs-seg${s < p.load ? " wcs-seg-lit" : ""}`}
														key={segId}
													/>
												))}
											</div>
											<div className="wcs-card-stats">
												<span className="wcs-stat">
													<span className="wcs-etch">HTTP</span>
													<span className="wcs-mono">{fmt(p.req)}</span>
												</span>
												<span className="wcs-stat">
													<span className="wcs-etch">MAIL</span>
													<span className="wcs-mono">{p.mail}</span>
												</span>
												<span className="wcs-stat">
													<span className="wcs-etch">PAY</span>
													<span className="wcs-mono">{p.pay}</span>
												</span>
											</div>
										</article>
									))}
								</div>

								<div className="wcs-dash-term">
									<span className="wcs-term-mini">
										{"> fleet — "}
										{fleet.length}
										{" projects · 1 box · 0 extra tabs"}
									</span>
									<span className="wcs-cursor" aria-hidden="true" />
									<button
										type="button"
										className="wcs-again wcs-etch"
										onClick={() => setPhase("deploy")}
									>
										+ NEW PROJECT
									</button>
								</div>
							</div>
						)}
					</div>

					<div className="wcs-bezel-bottom">
						<span className="wcs-etch wcs-microprint">
							ONE BOX · ONE CONSOLE · N PROJECTS
						</span>
					</div>
				</section>

				<section className="wcs-ctawrap">
					<form
						className="wcs-cta"
						onSubmit={(e) => {
							e.preventDefault();
							setJoined(true);
						}}
					>
						{joined ? (
							<p className="wcs-joined">WAITLIST ● CONFIRMED</p>
						) : (
							<>
								<label className="wcs-slot">
									<span className="wcs-etch wcs-slot-label">OPERATOR</span>
									<input
										className="wcs-input"
										type="email"
										required
										placeholder="you@yourdomain.dev"
										aria-label="Email address"
									/>
								</label>
								<button className="wcs-key" type="submit">
									Join waitlist
								</button>
							</>
						)}
					</form>
				</section>
			</main>

			<footer className="wcs-foot">
				<span className="wcs-etch wcs-microprint">
					ALFREDO · THE HOME FOR YOUR PROJECTS · SELF-HOSTED, YOURS FOREVER
				</span>
			</footer>
		</div>
	);
}

const stylesM = `
.wcs {
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
.wcs-etch {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	font-weight: 400;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--paper-soft);
}
.wcs-mono {
	font-family: "IBM Plex Mono", monospace;
	font-size: 14px;
	font-variant-numeric: tabular-nums;
}
.wcs-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.wcs-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.wcs-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 9px var(--led-glow);
}
.wcs-hero { text-align: center; padding: 64px 24px 0; }
.wcs-h1 {
	margin: 0;
	font-size: clamp(36px, 5.4vw, 64px);
	font-weight: 700;
	line-height: 1.06;
	letter-spacing: -0.04em;
}
.wcs-green { color: var(--green-text); text-shadow: 0 0 22px rgba(88, 232, 92, 0.35); }
.wcs-sub {
	margin: 24px auto 0;
	max-width: 56ch;
	font-size: 18px;
	line-height: 1.6;
	color: #b3ad9b;
}
.wcs-bezel {
	max-width: 940px;
	margin: 56px auto 0;
	padding: 0 24px;
}
.wcs-bezel-top,
.wcs-bezel-bottom {
	background: var(--panel);
	border: 1px solid var(--seam);
	display: flex;
	justify-content: space-between;
	padding: 10px 24px;
}
.wcs-bezel-top { border-radius: 14px 14px 0 0; border-bottom: none; }
.wcs-bezel-bottom {
	border-radius: 0 0 14px 14px;
	border-top: none;
	justify-content: center;
	box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.wcs-app {
	background: var(--surface);
	border: 1px solid var(--seam);
	min-height: 460px;
	padding: 26px 28px;
	box-shadow: inset 0 4px 18px rgba(0, 0, 0, 0.6);
}
.wcs-deployview { display: flex; flex-direction: column; gap: 18px; }
.wcs-panel {
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 12px;
	max-width: 560px;
	margin: 0 auto;
	width: 100%;
	animation: wcs-in 0.3s ease both;
}
.wcs-panel-head {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding: 14px 20px;
	border-bottom: 1px solid var(--seam);
}
.wcs-projname { color: var(--green-text); }
.wcs-checks { display: flex; flex-direction: column; padding: 8px 0; }
.wcs-check {
	display: grid;
	grid-template-columns: 22px 110px 1fr;
	gap: 14px;
	align-items: center;
	text-align: left;
	background: none;
	border: none;
	padding: 11px 20px;
	cursor: pointer;
	font-family: inherit;
	color: var(--paper);
}
.wcs-check:hover { background: rgba(236, 231, 218, 0.03); }
.wcs-check:disabled { cursor: default; }
.wcs-box {
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
.wcs-check[aria-pressed="false"] .wcs-check-name,
.wcs-check[aria-pressed="false"] .wcs-check-spec { opacity: 0.45; }
.wcs-check-name { font-weight: 700; font-size: 15px; letter-spacing: -0.01em; }
.wcs-check-spec {
	font-family: "IBM Plex Mono", monospace;
	font-size: 11px;
	color: var(--paper-soft);
}
.wcs-panel-foot {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 14px 20px;
	border-top: 1px solid var(--seam);
}
.wcs-deploy,
.wcs-key {
	background: linear-gradient(180deg, #f6f3ea 0%, #e4dfd3 100%);
	color: #1c1913;
	border: none;
	border-radius: 10px;
	padding: 9px 24px;
	font-family: inherit;
	font-size: 14px;
	font-weight: 700;
	letter-spacing: 0.02em;
	cursor: pointer;
	box-shadow:
		0 3px 0 #a29a86,
		inset 0 1px 0 rgba(255, 255, 255, 0.85);
	transition: transform 0.06s ease, box-shadow 0.06s ease;
}
.wcs-deploy:hover:not(:disabled),
.wcs-key:hover { background: linear-gradient(180deg, #fffdf6 0%, #ece7da 100%); }
.wcs-deploy:active:not(:disabled),
.wcs-key:active {
	transform: translateY(2px);
	box-shadow: 0 1px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85);
}
.wcs-deploy:disabled { opacity: 0.4; cursor: not-allowed; }
.wcs-term {
	background: var(--display-bg);
	border: 1px solid var(--seam);
	border-radius: 10px;
	max-width: 560px;
	margin: 0 auto;
	width: 100%;
	padding: 16px 20px;
	font-family: "VT323", monospace;
	font-size: 17px;
	line-height: 1.5;
	color: var(--display-text);
	box-shadow: inset 0 3px 12px rgba(0, 0, 0, 0.8);
	animation: wcs-in 0.25s ease both;
}
.wcs-term-line {
	opacity: 0;
	animation: wcs-on 0.05s linear forwards;
	text-shadow: 0 0 7px rgba(88, 232, 92, 0.45);
	white-space: pre;
}
.wcs-term-line:last-of-type { color: var(--amber); text-shadow: 0 0 7px rgba(255, 210, 60, 0.4); }
.wcs-dash { display: flex; flex-direction: column; gap: 16px; }
.wcs-tiles {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
	gap: 10px;
}
.wcs-tile {
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 10px;
	padding: 12px 16px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	animation: wcs-in 0.3s ease both;
}
.wcs-tile-num {
	font-size: 24px;
	font-weight: 700;
	letter-spacing: -0.02em;
	font-variant-numeric: tabular-nums;
}
.wcs-tile-note {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	color: var(--paper-soft);
}
.wcs-cards {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
	gap: 10px;
}
.wcs-card {
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 10px;
	padding: 14px 16px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	opacity: 0;
	animation: wcs-in 0.35s ease forwards;
}
.wcs-card-head {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 8px;
}
.wcs-card-name {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	font-weight: 700;
	font-size: 15px;
	letter-spacing: -0.01em;
}
.wcs-led {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 7px var(--led-glow);
	flex-shrink: 0;
}
.wcs-loadbar { display: flex; gap: 3px; }
.wcs-seg {
	flex: 1;
	height: 5px;
	border-radius: 2px;
	background: var(--led-off);
	transition: background 0.3s ease;
}
.wcs-seg-lit { background: var(--led); box-shadow: 0 0 4px rgba(59, 210, 59, 0.4); }
.wcs-card-stats { display: flex; justify-content: space-between; gap: 8px; }
.wcs-stat { display: flex; flex-direction: column; gap: 2px; }
.wcs-dash-term {
	display: flex;
	align-items: center;
	gap: 8px;
	background: var(--display-bg);
	border: 1px solid var(--seam);
	border-radius: 10px;
	padding: 10px 16px;
	box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.7);
}
.wcs-term-mini {
	font-family: "VT323", monospace;
	font-size: 16px;
	color: var(--display-text);
	text-shadow: 0 0 6px rgba(88, 232, 92, 0.4);
	white-space: pre;
}
.wcs-cursor {
	display: inline-block;
	width: 0.5em;
	height: 1em;
	background: var(--display-text);
	animation: wcs-blink 1s steps(1) infinite;
}
.wcs-again {
	margin-left: auto;
	background: none;
	border: 1px solid var(--seam);
	border-radius: 7px;
	padding: 5px 10px;
	cursor: pointer;
	color: var(--paper-soft);
}
.wcs-again:hover { color: var(--paper); border-color: rgba(236, 231, 218, 0.3); }
.wcs-ctawrap { display: flex; justify-content: center; padding: 52px 24px 0; }
.wcs-cta { display: flex; gap: 14px; align-items: stretch; flex-wrap: wrap; justify-content: center; }
.wcs-slot {
	display: flex;
	flex-direction: column;
	gap: 5px;
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 12px;
	padding: 10px 16px 12px;
	box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.55);
}
.wcs-slot-label { font-size: 9px; }
.wcs-input {
	border: none;
	background: transparent;
	font-family: "IBM Plex Mono", monospace;
	font-size: 15px;
	color: var(--green-text);
	min-width: 250px;
	padding: 0;
}
.wcs-input::placeholder { color: #56604a; }
.wcs-input:focus { outline: none; }
.wcs-slot:focus-within { outline: 2px solid var(--green-text); outline-offset: 2px; }
.wcs-key { padding: 0 28px; font-size: 15px; border-radius: 12px; box-shadow: 0 4px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85); }
.wcs-key:active { transform: translateY(3px); box-shadow: 0 1px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85); }
.wcs-joined {
	font-family: "IBM Plex Mono", monospace;
	font-size: 16px;
	letter-spacing: 0.1em;
	color: var(--green-text);
	align-self: center;
}
.wcs-foot { padding: 72px 24px 40px; text-align: center; }
.wcs-microprint { font-size: 9px; opacity: 0.8; }
@keyframes wcs-on { to { opacity: 1; } }
@keyframes wcs-in {
	from { opacity: 0; transform: translateY(8px); }
	to { opacity: 1; transform: translateY(0); }
}
@keyframes wcs-blink {
	0%, 49% { opacity: 1; }
	50%, 100% { opacity: 0; }
}
@media (max-width: 720px) {
	.wcs-app { padding: 16px; }
	.wcs-check { grid-template-columns: 22px 1fr; }
	.wcs-check-spec { grid-column: 2; }
}
.wcs *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.wcs * { animation-duration: 0.01ms !important; animation-delay: 0s !important; transition: none !important; }
}
`;
