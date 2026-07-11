// PROTOTYPE variant I — "Fleet Panel" (wayfinder #11, throwaway).
// Identity v2 axis test: KEEP the bone-greige material of H, surface the
// operations story as a second act INSIDE the same console chassis — a
// fleet board with one row per project and live incoming-signal counters
// (HTTP / MAIL / PAY). Microlabels stay Alfredo's own system, restrained.
// Literalism level ≈ H.
import { useEffect, useState } from "react";

const BOOT = [
	{ text: "> alfredo up my-saas", delay: 0.6 },
	{ text: "auth ............. ok", delay: 1.2 },
	{ text: "email ............ ok", delay: 1.6 },
	{ text: "database ......... ok", delay: 2.0 },
	{ text: "analytics ........ ok", delay: 2.4 },
	{ text: "secrets .......... ok", delay: 2.8 },
	{ text: "READY  00:04", delay: 3.4 },
];

const SERVICES = [
	{ name: "AUTH", delay: 1.2 },
	{ name: "EMAIL", delay: 1.6 },
	{ name: "DATABASE", delay: 2.0 },
	{ name: "ANALYTICS", delay: 2.4 },
	{ name: "SECRETS", delay: 2.8 },
];

type Project = {
	no: string;
	name: string;
	up: string;
	req: number;
	mail: number;
	pay: number;
};

const FLEET_START: Project[] = [
	{ no: "P-01", name: "my-saas", up: "0d 00:04", req: 0, mail: 0, pay: 0 },
	{ no: "P-02", name: "invoicer", up: "148d", req: 48210, mail: 291, pay: 57 },
	{ no: "P-03", name: "shiplog", up: "63d", req: 9184, mail: 44, pay: 12 },
	{
		no: "P-04",
		name: "pantry-api",
		up: "212d",
		req: 130552,
		mail: 812,
		pay: 0,
	},
];

// Rows power on after the boot readout finishes — deploy first, watch after.
const FLEET_ON_DELAY = 3.8;

export function VariantIFleetPanel() {
	const [joined, setJoined] = useState(false);
	const [fleet, setFleet] = useState(FLEET_START);

	useEffect(() => {
		const id = setInterval(() => {
			setFleet((prev) =>
				prev.map((p) => ({
					...p,
					req: p.req + Math.floor(Math.random() * 9),
					mail: Math.random() < 0.06 ? p.mail + 1 : p.mail,
					pay: Math.random() < 0.025 ? p.pay + 1 : p.pay,
				})),
			);
		}, 900);
		return () => clearInterval(id);
	}, []);

	return (
		<div className="flt">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{stylesI}</style>

			<header className="flt-head">
				<span className="flt-wordmark">
					Alfredo
					<span className="flt-wordmark-led" aria-hidden="true" />
				</span>
				<span className="flt-silk">SELF-HOSTED · UNIT NO. 000-001</span>
			</header>

			<main>
				<section className="flt-hero">
					<h1 className="flt-h1">
						Ship your next SaaS in minutes.
						<br />
						Watch them all from <span className="flt-green">one console.</span>
					</h1>
					<p className="flt-sub">
						Auth, email, database, analytics — wired once, on your own server.
						And because Alfredo wired them, it watches them all.
					</p>
				</section>

				<section className="flt-console" aria-label="Alfredo console">
					<div className="flt-console-top">
						<span className="flt-silk">ALFREDO OS 0.1</span>
						<span className="flt-silk">SYS / LOG</span>
						<span className="flt-silk">UNIT NO. 000-001</span>
					</div>

					<div className="flt-console-body">
						<div className="flt-display">
							{BOOT.map((l) => (
								<div
									className="flt-display-line"
									key={l.text}
									style={{ animationDelay: `${l.delay}s` }}
								>
									{l.text}
								</div>
							))}
							<span className="flt-cursor" aria-hidden="true" />
						</div>

						<div className="flt-controls">
							<p className="flt-silk flt-controls-title">SERVICES</p>
							{SERVICES.map((s) => (
								<div className="flt-control-row" key={s.name}>
									<span
										className="flt-led"
										style={{ animationDelay: `${s.delay}s` }}
									/>
									<span className="flt-control-name">{s.name}</span>
								</div>
							))}
						</div>
					</div>

					<div className="flt-fleet-divider">
						<span className="flt-silk">FLEET / 04 PROJECTS</span>
						<span className="flt-silk">SIG: HTTP · MAIL · PAY</span>
					</div>

					<div className="flt-fleet">
						<div className="flt-fleet-row flt-fleet-header">
							<span className="flt-silk">PROJECT</span>
							<span className="flt-silk flt-col-up">UPTIME</span>
							<span className="flt-silk flt-col-num">HTTP</span>
							<span className="flt-silk flt-col-num">MAIL</span>
							<span className="flt-silk flt-col-num">PAY</span>
						</div>
						{fleet.map((p, i) => (
							<div
								className="flt-fleet-row flt-fleet-on"
								key={p.no}
								style={{ animationDelay: `${FLEET_ON_DELAY + i * 0.18}s` }}
							>
								<span className="flt-fleet-name">
									<span
										className="flt-led"
										style={{ animationDelay: `${FLEET_ON_DELAY + i * 0.18}s` }}
									/>
									<span className="flt-silk flt-fleet-no">{p.no}</span>
									{p.name}
								</span>
								<span className="flt-mono flt-col-up">{p.up}</span>
								<span className="flt-mono flt-col-num">
									{p.req.toLocaleString("en-US")}
								</span>
								<span
									className="flt-mono flt-col-num flt-blip"
									key={`m-${p.no}-${p.mail}`}
								>
									{p.mail}
								</span>
								<span
									className="flt-mono flt-col-num flt-blip-amber"
									key={`y-${p.no}-${p.pay}`}
								>
									{p.pay}
								</span>
							</div>
						))}
					</div>

					<div className="flt-console-seam">
						<span className="flt-silk flt-microprint">
							ONE BOX · ONE CONSOLE · N PROJECTS
						</span>
					</div>
				</section>

				<section className="flt-ctawrap">
					<form
						className="flt-cta"
						onSubmit={(e) => {
							e.preventDefault();
							setJoined(true);
						}}
					>
						{joined ? (
							<p className="flt-joined">WAITLIST ● CONFIRMED</p>
						) : (
							<>
								<label className="flt-slot">
									<span className="flt-silk flt-slot-label">OPERATOR</span>
									<input
										className="flt-input"
										type="email"
										required
										placeholder="you@yourdomain.dev"
										aria-label="Email address"
									/>
								</label>
								<button className="flt-key" type="submit">
									Join waitlist
								</button>
							</>
						)}
					</form>
				</section>
			</main>

			<footer className="flt-foot">
				<span className="flt-silk flt-microprint">
					ALFREDO · THE HOME FOR YOUR PROJECTS · SELF-HOSTED, YOURS FOREVER
				</span>
			</footer>
		</div>
	);
}

const stylesI = `
.flt {
	--bg: #e4dfd3;
	--panel: #efebe0;
	--panel-2: #f6f3ea;
	--ink: #1c1913;
	--ink-soft: #6b6553;
	--seam: rgba(28, 25, 19, 0.16);
	--led: #3bd23b;
	--led-glow: rgba(59, 210, 59, 0.75);
	--led-off: #b6af9d;
	--green-text: #2c8f30;
	--amber: #ffd23c;
	--display-bg: #15160f;
	--display-text: #58e85c;

	min-height: 100vh;
	background: var(--bg);
	color: var(--ink);
	font-family: "Space Grotesk", sans-serif;
}
.flt-silk {
	font-family: "IBM Plex Mono", monospace;
	font-size: 11px;
	font-weight: 500;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--ink-soft);
}
.flt-mono {
	font-family: "IBM Plex Mono", monospace;
	font-size: 13px;
	font-variant-numeric: tabular-nums;
}
.flt-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.flt-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.flt-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 7px var(--led-glow), inset 0 -1px 1px rgba(0,0,0,0.2);
}
.flt-hero { text-align: center; padding: 64px 24px 0; }
.flt-h1 {
	margin: 0;
	font-size: clamp(36px, 5.4vw, 64px);
	font-weight: 700;
	line-height: 1.06;
	letter-spacing: -0.04em;
}
.flt-green { color: var(--green-text); }
.flt-sub {
	margin: 24px auto 0;
	max-width: 56ch;
	font-size: 18px;
	line-height: 1.6;
	color: #4f4a3b;
}
.flt-console {
	max-width: 940px;
	margin: 56px auto 0;
	padding: 0 24px;
}
.flt-console-top,
.flt-console-body,
.flt-fleet-divider,
.flt-fleet,
.flt-console-seam {
	background: var(--panel);
	border: 1px solid var(--seam);
	border-bottom: none;
}
.flt-console-top {
	display: flex;
	justify-content: space-between;
	padding: 12px 26px;
	border-radius: 16px 16px 0 0;
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.75);
}
.flt-console-body {
	display: grid;
	grid-template-columns: 1.5fr 1fr;
	gap: 28px;
	padding: 26px;
	border-top: 1px solid var(--seam);
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
}
.flt-display {
	background: var(--display-bg);
	border-radius: 10px;
	padding: 24px 26px;
	min-height: 226px;
	font-family: "VT323", monospace;
	font-size: clamp(18px, 2vw, 23px);
	line-height: 1.45;
	color: var(--display-text);
	box-shadow:
		inset 0 3px 10px rgba(0, 0, 0, 0.75),
		inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}
.flt-display-line {
	opacity: 0;
	animation: flt-on 0.05s linear forwards;
	text-shadow: 0 0 6px rgba(88, 232, 92, 0.4);
	white-space: pre;
}
.flt-display-line:last-of-type { color: var(--amber); text-shadow: 0 0 6px rgba(255, 210, 60, 0.4); }
.flt-cursor {
	display: inline-block;
	width: 0.55em;
	height: 1em;
	background: var(--display-text);
	opacity: 0;
	animation: flt-blink 1s steps(1) infinite 3.9s;
}
.flt-controls {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 12px;
	padding: 6px 4px;
}
.flt-controls-title { margin: 0 0 2px; }
.flt-control-row { display: flex; align-items: center; gap: 13px; }
.flt-led {
	width: 11px;
	height: 11px;
	border-radius: 50%;
	background: var(--led-off);
	box-shadow: inset 0 1px 2px rgba(0,0,0,0.35);
	animation: flt-led 0.2s linear forwards;
	flex-shrink: 0;
}
.flt-control-name { font-size: 14px; font-weight: 500; letter-spacing: 0.14em; }
.flt-fleet-divider {
	display: flex;
	justify-content: space-between;
	padding: 10px 26px;
	border-top: 1px solid var(--seam);
	background: var(--panel-2);
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
}
.flt-fleet { border-top: 1px solid var(--seam); padding: 8px 26px 16px; }
.flt-fleet-row {
	display: grid;
	grid-template-columns: 1.6fr 0.8fr 1fr 0.6fr 0.6fr;
	gap: 12px;
	align-items: center;
	padding: 9px 0;
	border-bottom: 1px solid rgba(28, 25, 19, 0.07);
}
.flt-fleet-row:last-child { border-bottom: none; }
.flt-fleet-header { border-bottom: 1px solid var(--seam); padding: 12px 0 8px; }
.flt-fleet-header .flt-silk { font-size: 9px; }
.flt-fleet-on { opacity: 0; animation: flt-on 0.05s linear forwards; }
.flt-fleet-name {
	display: flex;
	align-items: center;
	gap: 12px;
	font-weight: 700;
	font-size: 16px;
	letter-spacing: -0.01em;
}
.flt-fleet-no { font-size: 9px; }
.flt-col-up, .flt-col-num { text-align: right; }
.flt-col-num { color: var(--ink); }
.flt-blip { animation: flt-blip 0.5s ease-out; }
.flt-blip-amber { animation: flt-blip-amber 0.5s ease-out; }
.flt-console-seam {
	border-radius: 0 0 16px 16px;
	border-top: 1px solid var(--seam);
	border-bottom: 1px solid var(--seam);
	padding: 10px 26px;
	text-align: center;
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 18px 40px rgba(28, 25, 19, 0.14);
}
.flt-microprint { font-size: 10px; opacity: 0.85; }
.flt-ctawrap { display: flex; justify-content: center; padding: 52px 24px 0; }
.flt-cta { display: flex; gap: 14px; align-items: stretch; flex-wrap: wrap; justify-content: center; }
.flt-slot {
	display: flex;
	flex-direction: column;
	gap: 5px;
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 12px;
	padding: 10px 16px 12px;
	box-shadow:
		inset 0 2px 5px rgba(28, 25, 19, 0.12),
		0 1px 0 rgba(255,255,255,0.7);
}
.flt-slot-label { font-size: 9px; }
.flt-input {
	border: none;
	background: transparent;
	font-family: "IBM Plex Mono", monospace;
	font-size: 15px;
	color: var(--ink);
	min-width: 250px;
	padding: 0;
}
.flt-input:focus { outline: none; }
.flt-slot:focus-within { outline: 2px solid var(--green-text); outline-offset: 2px; }
.flt-key {
	background: linear-gradient(180deg, #2a251b 0%, #1c1913 100%);
	color: var(--led);
	border: none;
	border-radius: 12px;
	padding: 0 28px;
	font-family: inherit;
	font-size: 15px;
	font-weight: 700;
	letter-spacing: 0.02em;
	cursor: pointer;
	box-shadow:
		0 4px 0 #0d0b07,
		inset 0 1px 0 rgba(255, 255, 255, 0.12);
	transition: transform 0.06s ease, box-shadow 0.06s ease;
}
.flt-key:hover { color: #7dff81; }
.flt-key:active {
	transform: translateY(3px);
	box-shadow: 0 1px 0 #0d0b07, inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
.flt-joined {
	font-family: "IBM Plex Mono", monospace;
	font-size: 16px;
	letter-spacing: 0.1em;
	color: var(--green-text);
	align-self: center;
}
.flt-foot { padding: 72px 24px 40px; text-align: center; }
@keyframes flt-on { to { opacity: 1; } }
@keyframes flt-led {
	to { background: var(--led); box-shadow: 0 0 8px var(--led-glow), inset 0 -1px 1px rgba(0,0,0,0.15); }
}
@keyframes flt-blink {
	0%, 49% { opacity: 1; }
	50%, 100% { opacity: 0; }
}
@keyframes flt-blip {
	0% { color: var(--green-text); text-shadow: 0 0 8px var(--led-glow); }
	100% { color: var(--ink); text-shadow: none; }
}
@keyframes flt-blip-amber {
	0% { color: #b8860b; text-shadow: 0 0 8px rgba(255, 210, 60, 0.6); }
	100% { color: var(--ink); text-shadow: none; }
}
@media (max-width: 720px) {
	.flt-console-body { grid-template-columns: 1fr; }
	.flt-console-top { flex-wrap: wrap; gap: 8px; }
	.flt-fleet-row { grid-template-columns: 1.4fr 1fr 0.6fr 0.6fr; }
	.flt-col-up { display: none; }
}
.flt *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.flt * { animation-duration: 0.01ms !important; animation-delay: 0s !important; transition: none !important; }
}
`;
