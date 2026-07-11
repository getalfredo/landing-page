// PROTOTYPE variant L — "Ops Deck" (wayfinder #11, round 5, throwaway).
// Iteration on J (Dark Ops), which won the material direction. Adds the
// two missing stories from the round-4 reaction:
// 1. Module clarity — a physical toggle row above the glass: checkbox
//    AUTH/EMAIL/DATABASE/ANALYTICS/SECRETS, press DEPLOY, and the boot
//    readout re-runs wiring exactly what you picked.
// 2. Multi-project insights — after the fleet table, a `> insights`
//    digest computed across all projects (totals, busiest, top earner).
import { useEffect, useState } from "react";

const ALL_SERVICES = [
	{ id: "auth", label: "AUTH" },
	{ id: "email", label: "EMAIL" },
	{ id: "db", label: "DATABASE" },
	{ id: "analytics", label: "ANALYTICS" },
	{ id: "secrets", label: "SECRETS" },
];

type Project = {
	name: string;
	up: string;
	upDays: number;
	req: number;
	mail: number;
	pay: number;
	eur: number;
};

const FLEET_START: Project[] = [
	{ name: "my-saas", up: "0d", upDays: 0, req: 0, mail: 0, pay: 0, eur: 0 },
	{
		name: "invoicer",
		up: "148d",
		upDays: 148,
		req: 48210,
		mail: 291,
		pay: 57,
		eur: 2840,
	},
	{
		name: "shiplog",
		up: "63d",
		upDays: 63,
		req: 9184,
		mail: 44,
		pay: 12,
		eur: 348,
	},
	{
		name: "pantry-api",
		up: "212d",
		upDays: 212,
		req: 130552,
		mail: 812,
		pay: 0,
		eur: 0,
	},
];

function pad(s: string, n: number) {
	return s.length >= n ? s.slice(0, n) : s + " ".repeat(n - s.length);
}

function fmt(n: number) {
	return n.toLocaleString("en-US");
}

export function VariantLOpsDeck() {
	const [joined, setJoined] = useState(false);
	const [fleet, setFleet] = useState(FLEET_START);
	const [on, setOn] = useState<Record<string, boolean>>(
		Object.fromEntries(ALL_SERVICES.map((s) => [s.id, true])),
	);
	const [run, setRun] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setFleet((prev) =>
				prev.map((p) => ({
					...p,
					req: p.req + Math.floor(Math.random() * 9),
					mail: Math.random() < 0.06 ? p.mail + 1 : p.mail,
					pay: Math.random() < 0.025 ? p.pay + 1 : p.pay,
					eur: Math.random() < 0.025 ? p.eur + 49 : p.eur,
				})),
			);
		}, 900);
		return () => clearInterval(id);
	}, []);

	const chosen = ALL_SERVICES.filter((s) => on[s.id]);

	// Boot script derived from the toggles — redeploying replays it.
	const bootCmd = `> alfredo up my-saas --with ${chosen.map((s) => s.id).join(",")}`;
	const bootLines = [
		{ id: "cmd", text: bootCmd, delay: 0.5 },
		...chosen.map((s, i) => ({
			id: s.id,
			text: `${s.id} ${".".repeat(16 - s.id.length)} ok`,
			delay: 1.1 + i * 0.35,
		})),
		{
			id: "ready",
			text: `READY  00:0${Math.min(9, chosen.length)}`,
			delay: 1.5 + chosen.length * 0.35,
		},
	];
	const fleetDelay = 2.1 + chosen.length * 0.35;

	// Cross-project insights, computed live from the fleet.
	const totReq = fleet.reduce((a, p) => a + p.req, 0);
	const totMail = fleet.reduce((a, p) => a + p.mail, 0);
	const totPay = fleet.reduce((a, p) => a + p.pay, 0);
	const totEur = fleet.reduce((a, p) => a + p.eur, 0);
	const busiest = fleet.reduce((a, p) => (p.req > a.req ? p : a));
	const earner = fleet.reduce((a, p) => (p.eur > a.eur ? p : a));
	const oldest = fleet.reduce((a, p) => (p.upDays > a.upDays ? p : a));
	const insights = [
		`traffic   ${pad(`${fmt(totReq)} req`, 14)} busiest: ${busiest.name}`,
		`mail      ${pad(`${fmt(totMail)} new`, 14)} across ${fleet.length} inboxes`,
		`pay       ${pad(`${fmt(totPay)} events`, 14)} € ${fmt(totEur)} · top: ${earner.name}`,
		`uptime    ${pad(`${fleet.length}/${fleet.length} live`, 14)} oldest: ${oldest.name} ${oldest.up}`,
	];

	return (
		<div className="odk">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{stylesL}</style>

			<header className="odk-head">
				<span className="odk-wordmark">
					Alfredo
					<span className="odk-wordmark-led" aria-hidden="true" />
				</span>
				<span className="odk-etch">SELF-HOSTED</span>
			</header>

			<main>
				<section className="odk-hero">
					<h1 className="odk-h1">
						Ship your next SaaS in minutes.
						<br />
						Watch them all from <span className="odk-green">one console.</span>
					</h1>
					<p className="odk-sub">
						Auth, email, database, analytics — wired once, on your own server.
						And because Alfredo wired them, it watches them all.
					</p>
				</section>

				<section className="odk-bezel" aria-label="Alfredo console">
					<div className="odk-bezel-top">
						<span className="odk-etch">ALFREDO OS 0.1</span>
						<span className="odk-etch">UNIT 000-001</span>
					</div>

					<div className="odk-config">
						<span className="odk-etch odk-config-label">MODULES</span>
						<div className="odk-toggles">
							{ALL_SERVICES.map((s) => (
								<button
									type="button"
									className="odk-toggle"
									key={s.id}
									aria-pressed={on[s.id]}
									onClick={() =>
										setOn((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
									}
								>
									<span
										className={`odk-toggle-led${on[s.id] ? " odk-toggle-led-on" : ""}`}
										aria-hidden="true"
									/>
									<span className="odk-etch odk-toggle-name">{s.label}</span>
								</button>
							))}
						</div>
						<button
							type="button"
							className="odk-deploy"
							disabled={chosen.length === 0}
							onClick={() => setRun((r) => r + 1)}
						>
							Deploy
						</button>
					</div>

					<div className="odk-glass">
						<div className="odk-glare" aria-hidden="true" />
						<div key={run}>
							{bootLines.map((l) => (
								<div
									className="odk-line"
									key={l.id}
									style={{ animationDelay: `${l.delay}s` }}
								>
									{l.text}
								</div>
							))}
							<div
								className="odk-line odk-line-gap"
								style={{ animationDelay: `${fleetDelay}s` }}
							>
								{"> fleet"}
							</div>
							<div
								className="odk-line odk-line-dim"
								style={{ animationDelay: `${fleetDelay + 0.15}s` }}
							>
								{pad("NAME", 12) +
									pad("STATUS", 8) +
									pad("UPTIME", 8) +
									pad("HTTP", 9) +
									pad("MAIL", 6) +
									"PAY"}
							</div>
							{fleet.map((p, i) => (
								<div
									className="odk-line"
									key={p.name}
									style={{
										animationDelay: `${fleetDelay + 0.3 + i * 0.15}s`,
									}}
								>
									{pad(p.name, 12)}
									<span className="odk-live">{pad("● LIVE", 8)}</span>
									{pad(p.up, 8) +
										pad(fmt(p.req), 9) +
										pad(String(p.mail), 6) +
										p.pay}
								</div>
							))}
							<div
								className="odk-line odk-line-gap"
								style={{ animationDelay: `${fleetDelay + 1.1}s` }}
							>
								{"> insights"}
							</div>
							{insights.map((line, i) => (
								<div
									className="odk-line"
									key={line.slice(0, 7)}
									style={{
										animationDelay: `${fleetDelay + 1.25 + i * 0.15}s`,
									}}
								>
									{line}
								</div>
							))}
							<div
								className="odk-line odk-line-amber"
								style={{ animationDelay: `${fleetDelay + 2.1}s` }}
							>
								{fleet.length} PROJECTS · 1 BOX · 0 EXTRA TABS
							</div>
							<span className="odk-cursor" aria-hidden="true" />
						</div>
					</div>

					<div className="odk-bezel-bottom">
						<span className="odk-etch odk-microprint">
							ONE BOX · ONE CONSOLE · N PROJECTS
						</span>
					</div>
				</section>

				<section className="odk-ctawrap">
					<form
						className="odk-cta"
						onSubmit={(e) => {
							e.preventDefault();
							setJoined(true);
						}}
					>
						{joined ? (
							<p className="odk-joined">WAITLIST ● CONFIRMED</p>
						) : (
							<>
								<label className="odk-slot">
									<span className="odk-etch odk-slot-label">OPERATOR</span>
									<input
										className="odk-input"
										type="email"
										required
										placeholder="you@yourdomain.dev"
										aria-label="Email address"
									/>
								</label>
								<button className="odk-key" type="submit">
									Join waitlist
								</button>
							</>
						)}
					</form>
				</section>
			</main>

			<footer className="odk-foot">
				<span className="odk-etch odk-microprint">
					ALFREDO · THE HOME FOR YOUR PROJECTS · SELF-HOSTED, YOURS FOREVER
				</span>
			</footer>
		</div>
	);
}

const stylesL = `
.odk {
	--bg: #14150e;
	--panel: #1e1f16;
	--panel-2: #24251b;
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
.odk-etch {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	font-weight: 400;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--paper-soft);
}
.odk-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.odk-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.odk-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 9px var(--led-glow);
}
.odk-hero { text-align: center; padding: 64px 24px 0; }
.odk-h1 {
	margin: 0;
	font-size: clamp(36px, 5.4vw, 64px);
	font-weight: 700;
	line-height: 1.06;
	letter-spacing: -0.04em;
}
.odk-green { color: var(--green-text); text-shadow: 0 0 22px rgba(88, 232, 92, 0.35); }
.odk-sub {
	margin: 24px auto 0;
	max-width: 56ch;
	font-size: 18px;
	line-height: 1.6;
	color: #b3ad9b;
}
.odk-bezel {
	max-width: 940px;
	margin: 56px auto 0;
	padding: 0 24px;
}
.odk-bezel-top,
.odk-bezel-bottom {
	background: var(--panel);
	border: 1px solid var(--seam);
	display: flex;
	justify-content: space-between;
	padding: 10px 24px;
}
.odk-bezel-top { border-radius: 14px 14px 0 0; border-bottom: none; }
.odk-bezel-bottom {
	border-radius: 0 0 14px 14px;
	border-top: none;
	justify-content: center;
	box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.odk-config {
	display: flex;
	align-items: center;
	gap: 18px;
	flex-wrap: wrap;
	background: var(--panel-2);
	border: 1px solid var(--seam);
	border-bottom: none;
	padding: 12px 24px;
}
.odk-config-label { flex-shrink: 0; }
.odk-toggles { display: flex; gap: 8px; flex-wrap: wrap; flex: 1; }
.odk-toggle {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 8px;
	padding: 7px 12px;
	cursor: pointer;
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
	transition: border-color 0.1s ease;
}
.odk-toggle:hover { border-color: rgba(236, 231, 218, 0.3); }
.odk-toggle[aria-pressed="true"] { border-color: rgba(88, 232, 92, 0.4); }
.odk-toggle-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led-off);
	box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6);
	transition: background 0.15s ease, box-shadow 0.15s ease;
}
.odk-toggle-led-on {
	background: var(--led);
	box-shadow: 0 0 7px var(--led-glow);
}
.odk-toggle-name { color: var(--paper); font-size: 10px; }
.odk-toggle[aria-pressed="false"] .odk-toggle-name { color: var(--paper-soft); }
.odk-deploy {
	background: linear-gradient(180deg, #f6f3ea 0%, #e4dfd3 100%);
	color: #1c1913;
	border: none;
	border-radius: 10px;
	padding: 9px 22px;
	font-family: inherit;
	font-size: 13px;
	font-weight: 700;
	letter-spacing: 0.02em;
	cursor: pointer;
	box-shadow:
		0 3px 0 #a29a86,
		inset 0 1px 0 rgba(255, 255, 255, 0.85);
	transition: transform 0.06s ease, box-shadow 0.06s ease;
}
.odk-deploy:hover:not(:disabled) { background: linear-gradient(180deg, #fffdf6 0%, #ece7da 100%); }
.odk-deploy:active:not(:disabled) {
	transform: translateY(2px);
	box-shadow: 0 1px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85);
}
.odk-deploy:disabled { opacity: 0.4; cursor: not-allowed; }
.odk-glass {
	position: relative;
	overflow: hidden;
	background:
		linear-gradient(180deg, rgba(88, 232, 92, 0.03), rgba(0,0,0,0) 30%),
		var(--display-bg);
	border: 1px solid var(--seam);
	padding: 28px 34px 34px;
	min-height: 430px;
	font-family: "VT323", monospace;
	font-size: clamp(16px, 2vw, 21px);
	line-height: 1.5;
	color: var(--display-text);
	box-shadow:
		inset 0 4px 18px rgba(0, 0, 0, 0.9),
		inset 0 0 60px rgba(88, 232, 92, 0.04);
}
.odk-glare {
	position: absolute;
	inset: 0;
	pointer-events: none;
	background: linear-gradient(115deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 24%);
}
.odk-line {
	opacity: 0;
	animation: odk-on 0.05s linear forwards;
	text-shadow: 0 0 7px rgba(88, 232, 92, 0.45);
	white-space: pre;
	font-variant-numeric: tabular-nums;
}
.odk-line-dim { color: #3f7a41; text-shadow: none; }
.odk-line-gap { margin-top: 0.8em; }
.odk-line-amber { color: var(--amber); text-shadow: 0 0 7px rgba(255, 210, 60, 0.4); margin-top: 0.8em; }
.odk-live { color: var(--display-text); }
.odk-cursor {
	display: inline-block;
	width: 0.55em;
	height: 1em;
	background: var(--display-text);
	opacity: 0;
	animation: odk-blink 1s steps(1) infinite 6s;
}
.odk-ctawrap { display: flex; justify-content: center; padding: 52px 24px 0; }
.odk-cta { display: flex; gap: 14px; align-items: stretch; flex-wrap: wrap; justify-content: center; }
.odk-slot {
	display: flex;
	flex-direction: column;
	gap: 5px;
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 12px;
	padding: 10px 16px 12px;
	box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.55);
}
.odk-slot-label { font-size: 9px; }
.odk-input {
	border: none;
	background: transparent;
	font-family: "IBM Plex Mono", monospace;
	font-size: 15px;
	color: var(--green-text);
	min-width: 250px;
	padding: 0;
}
.odk-input::placeholder { color: #56604a; }
.odk-input:focus { outline: none; }
.odk-slot:focus-within { outline: 2px solid var(--green-text); outline-offset: 2px; }
.odk-key {
	background: linear-gradient(180deg, #f6f3ea 0%, #e4dfd3 100%);
	color: #1c1913;
	border: none;
	border-radius: 12px;
	padding: 0 28px;
	font-family: inherit;
	font-size: 15px;
	font-weight: 700;
	letter-spacing: 0.02em;
	cursor: pointer;
	box-shadow:
		0 4px 0 #a29a86,
		inset 0 1px 0 rgba(255, 255, 255, 0.85);
	transition: transform 0.06s ease, box-shadow 0.06s ease;
}
.odk-key:hover { background: linear-gradient(180deg, #fffdf6 0%, #ece7da 100%); }
.odk-key:active {
	transform: translateY(3px);
	box-shadow: 0 1px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85);
}
.odk-joined {
	font-family: "IBM Plex Mono", monospace;
	font-size: 16px;
	letter-spacing: 0.1em;
	color: var(--green-text);
	align-self: center;
}
.odk-foot { padding: 72px 24px 40px; text-align: center; }
.odk-microprint { font-size: 9px; opacity: 0.8; }
@keyframes odk-on { to { opacity: 1; } }
@keyframes odk-blink {
	0%, 49% { opacity: 1; }
	50%, 100% { opacity: 0; }
}
@media (max-width: 720px) {
	.odk-glass { padding: 22px 18px 28px; font-size: 13px; }
	.odk-config { padding: 12px 16px; gap: 12px; }
}
.odk *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.odk * { animation-duration: 0.01ms !important; animation-delay: 0s !important; transition: none !important; }
}
`;
