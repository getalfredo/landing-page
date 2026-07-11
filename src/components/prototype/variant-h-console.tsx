// PROTOTYPE variant H — "The Console" (wayfinder #3, round 3, throwaway).
// One committed visual language: a modern precision control surface
// (Teenage Engineering register, not retro kitsch). One material system —
// bone plastic panels, one top light source, hairline seams, silkscreen
// mono labels — carried through hero, console, CTA hardware, and a
// below-the-fold module grid to prove consistency.
import { useState } from "react";

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

const MODULES = [
	{ no: "ALF-01", name: "Auth", spec: "sessions, oauth, magic links" },
	{ no: "ALF-02", name: "Email", spec: "transactional, your smtp" },
	{ no: "ALF-03", name: "Database", spec: "sqlite, migrations included" },
	{ no: "ALF-04", name: "Analytics", spec: "posthog, on your box" },
	{ no: "ALF-05", name: "Secrets", spec: "encrypted, per project" },
];

export function VariantHConsole() {
	const [joined, setJoined] = useState(false);

	return (
		<div className="csl">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{stylesH}</style>

			<header className="csl-head">
				<span className="csl-wordmark">
					Alfredo
					<span className="csl-wordmark-led" aria-hidden="true" />
				</span>
				<span className="csl-silk">ALF-01 · SELF-HOSTED</span>
			</header>

			<main>
				<section className="csl-hero">
					<h1 className="csl-h1">
						Ship your next SaaS
						<br />
						in <span className="csl-green">minutes.</span>
					</h1>
					<p className="csl-sub">
						Self-hosted, with your own stack. The setup week every project
						starts with — Alfredo boots it before your coffee is ready.
					</p>
				</section>

				<section className="csl-console" aria-label="Alfredo console">
					<div className="csl-console-top">
						<span className="csl-silk">ALFREDO OS 0.1</span>
						<span className="csl-silk">SYS / LOG</span>
						<span className="csl-silk">UNIT NO. 000-001</span>
					</div>

					<div className="csl-console-body">
						<div className="csl-display">
							{BOOT.map((l) => (
								<div
									className="csl-display-line"
									key={l.text}
									style={{ animationDelay: `${l.delay}s` }}
								>
									{l.text}
								</div>
							))}
							<span className="csl-cursor" aria-hidden="true" />
						</div>

						<div className="csl-controls">
							<p className="csl-silk csl-controls-title">SERVICES</p>
							{SERVICES.map((s) => (
								<div className="csl-control-row" key={s.name}>
									<span
										className="csl-led"
										style={{ animationDelay: `${s.delay}s` }}
									/>
									<span className="csl-control-name">{s.name}</span>
								</div>
							))}
						</div>
					</div>

					<div className="csl-console-seam">
						<span className="csl-silk csl-microprint">
							MADE FOR YOUR OWN MACHINE · HETZNER-GRADE · NO CLOUD LANDLORD
						</span>
					</div>
				</section>

				<section className="csl-ctawrap">
					<form
						className="csl-cta"
						onSubmit={(e) => {
							e.preventDefault();
							setJoined(true);
						}}
					>
						{joined ? (
							<p className="csl-joined">WAITLIST ● CONFIRMED</p>
						) : (
							<>
								<label className="csl-slot">
									<span className="csl-silk csl-slot-label">OPERATOR</span>
									<input
										className="csl-input"
										type="email"
										required
										placeholder="you@yourdomain.dev"
										aria-label="Email address"
									/>
								</label>
								<button className="csl-key" type="submit">
									Join waitlist
								</button>
							</>
						)}
					</form>
				</section>

				<section className="csl-modules">
					<div className="csl-modules-head">
						<span className="csl-silk">THE DAY-ZERO MODULES</span>
						<span className="csl-rule" aria-hidden="true" />
					</div>
					<div className="csl-modules-grid">
						{MODULES.map((m) => (
							<article className="csl-module" key={m.no}>
								<div className="csl-module-top">
									<span className="csl-led csl-led-on" />
									<span className="csl-silk">{m.no}</span>
								</div>
								<h2 className="csl-module-name">{m.name}</h2>
								<p className="csl-module-spec">{m.spec}</p>
							</article>
						))}
					</div>
				</section>
			</main>

			<footer className="csl-foot">
				<span className="csl-silk csl-microprint">
					ALFREDO · SHIP YOUR NEXT SAAS IN MINUTES · SELF-HOSTED WITH YOUR OWN
					STACK
				</span>
			</footer>
		</div>
	);
}

const stylesH = `
.csl {
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
	--display-bg: #15160f;
	--display-text: #58e85c;

	min-height: 100vh;
	background: var(--bg);
	color: var(--ink);
	font-family: "Space Grotesk", sans-serif;
}
.csl-silk {
	font-family: "IBM Plex Mono", monospace;
	font-size: 11px;
	font-weight: 500;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--ink-soft);
}
.csl-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.csl-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.csl-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 7px var(--led-glow), inset 0 -1px 1px rgba(0,0,0,0.2);
}
.csl-hero { text-align: center; padding: 72px 24px 0; }
.csl-h1 {
	margin: 0;
	font-size: clamp(44px, 7vw, 84px);
	font-weight: 700;
	line-height: 1.0;
	letter-spacing: -0.04em;
}
.csl-green { color: var(--green-text); }
.csl-sub {
	margin: 26px auto 0;
	max-width: 52ch;
	font-size: 18px;
	line-height: 1.6;
	color: #4f4a3b;
}
.csl-console {
	max-width: 940px;
	margin: 64px auto 0;
	padding: 0 24px;
}
.csl-console-top,
.csl-console-body,
.csl-console-seam {
	background: var(--panel);
	border: 1px solid var(--seam);
}
.csl-console-top {
	display: flex;
	justify-content: space-between;
	padding: 12px 26px;
	border-radius: 16px 16px 0 0;
	border-bottom: none;
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.75);
}
.csl-console-body {
	display: grid;
	grid-template-columns: 1.5fr 1fr;
	gap: 28px;
	padding: 26px;
	border-top: 1px solid var(--seam);
	border-bottom: none;
	box-shadow:
		inset 0 1px 0 rgba(255,255,255,0.6),
		0 18px 40px rgba(28, 25, 19, 0.14);
}
.csl-display {
	background: var(--display-bg);
	border-radius: 10px;
	padding: 24px 26px;
	min-height: 236px;
	font-family: "VT323", monospace;
	font-size: clamp(18px, 2vw, 24px);
	line-height: 1.45;
	color: var(--display-text);
	box-shadow:
		inset 0 3px 10px rgba(0, 0, 0, 0.75),
		inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}
.csl-display-line {
	opacity: 0;
	animation: csl-on 0.05s linear forwards;
	text-shadow: 0 0 6px rgba(88, 232, 92, 0.4);
	white-space: pre;
}
.csl-display-line:last-of-type { color: #ffd23c; text-shadow: 0 0 6px rgba(255, 210, 60, 0.4); }
.csl-cursor {
	display: inline-block;
	width: 0.55em;
	height: 1em;
	background: var(--display-text);
	opacity: 0;
	animation: csl-blink 1s steps(1) infinite 3.9s;
}
.csl-controls {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 13px;
	padding: 6px 4px;
}
.csl-controls-title { margin: 0 0 2px; }
.csl-control-row { display: flex; align-items: center; gap: 13px; }
.csl-led {
	width: 11px;
	height: 11px;
	border-radius: 50%;
	background: var(--led-off);
	box-shadow: inset 0 1px 2px rgba(0,0,0,0.35);
	animation: csl-led 0.2s linear forwards;
	flex-shrink: 0;
}
.csl-led-on { animation-delay: 0s; }
.csl-control-name { font-size: 14px; font-weight: 500; letter-spacing: 0.14em; }
.csl-console-seam {
	border-radius: 0 0 16px 16px;
	border-top: 1px solid var(--seam);
	padding: 10px 26px;
	text-align: center;
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 18px 40px rgba(28, 25, 19, 0.14);
}
.csl-microprint { font-size: 10px; opacity: 0.85; }
.csl-ctawrap { display: flex; justify-content: center; padding: 52px 24px 0; }
.csl-cta { display: flex; gap: 14px; align-items: stretch; flex-wrap: wrap; justify-content: center; }
.csl-slot {
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
.csl-slot-label { font-size: 9px; }
.csl-input {
	border: none;
	background: transparent;
	font-family: "IBM Plex Mono", monospace;
	font-size: 15px;
	color: var(--ink);
	min-width: 250px;
	padding: 0;
}
.csl-input:focus { outline: none; }
.csl-slot:focus-within { outline: 2px solid var(--green-text); outline-offset: 2px; }
.csl-key {
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
.csl-key:hover { color: #7dff81; }
.csl-key:active {
	transform: translateY(3px);
	box-shadow: 0 1px 0 #0d0b07, inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
.csl-joined {
	font-family: "IBM Plex Mono", monospace;
	font-size: 16px;
	letter-spacing: 0.1em;
	color: var(--green-text);
	align-self: center;
}
.csl-modules { max-width: 1060px; margin: 88px auto 0; padding: 0 32px; }
.csl-modules-head { display: flex; align-items: center; gap: 18px; }
.csl-rule { flex: 1; height: 1px; background: var(--seam); }
.csl-modules-grid {
	margin-top: 22px;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
	gap: 14px;
}
.csl-module {
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 14px;
	padding: 16px 18px 18px;
	box-shadow:
		inset 0 1px 0 rgba(255,255,255,0.65),
		0 6px 16px rgba(28, 25, 19, 0.08);
}
.csl-module-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 14px;
}
.csl-module-name { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
.csl-module-spec {
	margin: 6px 0 0;
	font-family: "IBM Plex Mono", monospace;
	font-size: 12px;
	line-height: 1.5;
	color: var(--ink-soft);
}
.csl-foot { padding: 72px 24px 40px; text-align: center; }
@keyframes csl-on { to { opacity: 1; } }
@keyframes csl-led {
	to { background: var(--led); box-shadow: 0 0 8px var(--led-glow), inset 0 -1px 1px rgba(0,0,0,0.15); }
}
@keyframes csl-blink {
	0%, 49% { opacity: 1; }
	50%, 100% { opacity: 0; }
}
@media (max-width: 720px) {
	.csl-console-body { grid-template-columns: 1fr; }
	.csl-console-top { flex-wrap: wrap; gap: 8px; }
}
.csl *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.csl * { animation-duration: 0.01ms !important; animation-delay: 0s !important; transition: none !important; }
}
`;
