// PROTOTYPE variant D — "The Machine" (wayfinder #3, throwaway).
// The machine you own: a Rams-era beige appliance with service LEDs powering on
// and a dot-matrix readout. Space Grotesk + VT323. Warm greige, LED green.
import { useState } from "react";

const UNITS = [
	{ name: "AUTH", delay: 1.0 },
	{ name: "EMAIL", delay: 1.4 },
	{ name: "DATABASE", delay: 1.8 },
	{ name: "ANALYTICS", delay: 2.2 },
	{ name: "SECRETS", delay: 2.6 },
];

const READOUT = [
	{ text: "> alfredo up my-saas", delay: 0.6 },
	{ text: "provisioning auth ......... ok", delay: 1.0 },
	{ text: "provisioning email ........ ok", delay: 1.4 },
	{ text: "provisioning database ..... ok", delay: 1.8 },
	{ text: "provisioning analytics .... ok", delay: 2.2 },
	{ text: "provisioning secrets ...... ok", delay: 2.6 },
	{ text: "READY. elapsed 00:04", delay: 3.1 },
];

export function VariantDAppliance() {
	const [joined, setJoined] = useState(false);

	return (
		<div className="app">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=VT323&display=swap"
			/>
			<style>{stylesD}</style>

			<main className="app-main">
				<header className="app-head">
					<span className="app-wordmark">Alfredo</span>
					<span className="app-model">MODEL 01 — SELF-HOSTED</span>
				</header>

				<div className="app-device">
					<span className="app-screw app-screw-tl" aria-hidden="true" />
					<span className="app-screw app-screw-tr" aria-hidden="true" />
					<span className="app-screw app-screw-bl" aria-hidden="true" />
					<span className="app-screw app-screw-br" aria-hidden="true" />

					<div className="app-screen" aria-hidden="true">
						{READOUT.map((l) => (
							<div
								className="app-screen-line"
								key={l.text}
								style={{ animationDelay: `${l.delay}s` }}
							>
								{l.text}
							</div>
						))}
					</div>

					<div className="app-panel">
						<p className="app-panel-title">SERVICES</p>
						{UNITS.map((u) => (
							<div className="app-unit" key={u.name}>
								<span
									className="app-led"
									style={{ animationDelay: `${u.delay}s` }}
								/>
								<span className="app-unit-name">{u.name}</span>
							</div>
						))}
					</div>
				</div>

				<h1 className="app-h1">
					Your next SaaS.
					<br />
					Your own machine.
					<br />
					<span className="app-h1-accent">A few minutes away.</span>
				</h1>

				<p className="app-sub">
					The setup week — auth, email, database, analytics, secrets — is
					pre-installed. Plug your idea into a box you own and press on.
				</p>

				<form
					className="app-cta"
					onSubmit={(e) => {
						e.preventDefault();
						setJoined(true);
					}}
				>
					{joined ? (
						<p className="app-joined">WAITLIST: CONFIRMED ●</p>
					) : (
						<>
							<span className="app-power" aria-hidden="true">
								⏻
							</span>
							<input
								className="app-input"
								type="email"
								required
								placeholder="you@yourdomain.dev"
								aria-label="Email address"
							/>
							<button className="app-btn" type="submit">
								Join waitlist
							</button>
						</>
					)}
				</form>
			</main>
		</div>
	);
}

const stylesD = `
.app {
	min-height: 100vh;
	background: #e8e3d8;
	color: #262117;
	font-family: "Space Grotesk", sans-serif;
}
.app-main {
	max-width: 860px;
	margin: 0 auto;
	padding: 56px 24px 80px;
}
.app-head {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	margin-bottom: 40px;
}
.app-wordmark { font-weight: 700; font-size: 22px; letter-spacing: -0.02em; }
.app-model { font-family: "VT323", monospace; font-size: 16px; opacity: 0.55; letter-spacing: 0.08em; }
.app-device {
	position: relative;
	background: linear-gradient(180deg, #f2eee3 0%, #e6e1d3 100%);
	border: 1px solid #b8b09c;
	border-radius: 14px;
	box-shadow: 0 2px 0 #fff inset, 0 10px 24px rgba(38, 33, 23, 0.15);
	padding: 36px 40px;
	display: grid;
	grid-template-columns: 1.4fr 1fr;
	gap: 36px;
}
.app-screw {
	position: absolute;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: radial-gradient(circle at 35% 35%, #d8d2c2, #9a917d);
	box-shadow: 0 1px 1px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.25);
}
.app-screw::after {
	content: "";
	position: absolute;
	inset: 4px 1px;
	background: rgba(0,0,0,0.3);
	transform: rotate(45deg);
}
.app-screw-tl { top: 12px; left: 12px; }
.app-screw-tr { top: 12px; right: 12px; }
.app-screw-bl { bottom: 12px; left: 12px; }
.app-screw-br { bottom: 12px; right: 12px; }
.app-screen {
	background: #1d1a14;
	border-radius: 8px;
	border: 1px solid #3a352a;
	box-shadow: inset 0 0 24px rgba(0,0,0,0.6);
	padding: 20px 22px;
	font-family: "VT323", monospace;
	font-size: 19px;
	line-height: 1.5;
	color: #46e04a;
	min-height: 210px;
}
.app-screen-line {
	opacity: 0;
	animation: app-line 0.05s steps(1) forwards;
	text-shadow: 0 0 6px rgba(70, 224, 74, 0.55);
	white-space: pre;
}
.app-screen-line:last-child { color: #ffd23c; text-shadow: 0 0 6px rgba(255, 210, 60, 0.5); }
.app-panel {
	display: flex;
	flex-direction: column;
	gap: 12px;
	justify-content: center;
}
.app-panel-title {
	margin: 0 0 2px;
	font-size: 11px;
	letter-spacing: 0.25em;
	opacity: 0.5;
}
.app-unit { display: flex; align-items: center; gap: 12px; }
.app-led {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: #b9b2a0;
	box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
	animation: app-led-on 0.2s steps(1) forwards;
}
.app-unit-name { font-size: 14px; font-weight: 500; letter-spacing: 0.12em; }
.app-h1 {
	margin: 56px 0 0;
	font-size: clamp(38px, 6.5vw, 60px);
	font-weight: 700;
	line-height: 1.06;
	letter-spacing: -0.03em;
}
.app-h1-accent { color: #2f9e33; }
.app-sub {
	margin: 24px 0 0;
	max-width: 52ch;
	font-size: 17px;
	line-height: 1.6;
	color: #4d463a;
}
.app-cta {
	margin-top: 40px;
	display: flex;
	align-items: center;
	gap: 12px;
	flex-wrap: wrap;
}
.app-power {
	width: 44px;
	height: 44px;
	border-radius: 50%;
	border: 1px solid #b8b09c;
	background: linear-gradient(180deg, #f2eee3, #ddd7c8);
	box-shadow: 0 1px 0 #fff inset, 0 2px 4px rgba(38,33,23,0.2);
	display: grid;
	place-items: center;
	font-size: 18px;
	color: #2f9e33;
}
.app-input {
	border: 1px solid #b8b09c;
	border-radius: 8px;
	background: #f7f4ea;
	padding: 12px 16px;
	font-size: 15px;
	font-family: inherit;
	min-width: 260px;
	box-shadow: inset 0 2px 3px rgba(38,33,23,0.08);
}
.app-btn {
	background: #262117;
	color: #e8e3d8;
	border: none;
	border-radius: 8px;
	padding: 13px 24px;
	font-size: 15px;
	font-weight: 500;
	font-family: inherit;
	cursor: pointer;
	box-shadow: 0 3px 0 #0f0d09;
	transition: transform 0.08s ease, box-shadow 0.08s ease;
}
.app-btn:hover { transform: translateY(1px); box-shadow: 0 2px 0 #0f0d09; }
.app-joined { font-family: "VT323", monospace; font-size: 22px; color: #2f9e33; }
@keyframes app-line { to { opacity: 1; } }
@keyframes app-led-on {
	to {
		background: #46e04a;
		box-shadow: 0 0 8px rgba(70, 224, 74, 0.8), inset 0 1px 2px rgba(0,0,0,0.15);
	}
}
@media (max-width: 720px) {
	.app-device { grid-template-columns: 1fr; }
}
.app *:focus-visible { outline: 2px solid #2f9e33; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.app * { animation-duration: 0.01ms !important; animation-delay: 0s !important; }
}
`;
