// PROTOTYPE variant J — "Dark Ops" (wayfinder #11, throwaway).
// Identity v2 axis test: the material counter-proposal — darker, glassier.
// Anodized charcoal panels instead of bone plastic; one oversized phosphor
// glass display IS the hero, and the operations story plays inside it:
// the boot readout runs, then the fleet renders as a live departure-board
// readout. Hardware chrome reduced; microlabels minimal, etched not
// silkscreened. Bone plastic survives only as the keycap.
import { useEffect, useState } from "react";

const BOOT = [
	{ id: "up", text: "> alfredo up my-saas", delay: 0.6 },
	{
		id: "svc",
		text: "auth · email · db · analytics · secrets .... ok",
		delay: 1.6,
	},
	{ id: "ready", text: "READY  00:04", delay: 2.4 },
	{ id: "gap", text: "", delay: 2.9 },
	{ id: "fleet", text: "> fleet", delay: 3.2 },
];

type Project = {
	name: string;
	status: string;
	up: string;
	req: number;
	mail: number;
	pay: number;
};

const FLEET_START: Project[] = [
	{ name: "my-saas", status: "LIVE", up: "0d", req: 0, mail: 0, pay: 0 },
	{
		name: "invoicer",
		status: "LIVE",
		up: "148d",
		req: 48210,
		mail: 291,
		pay: 57,
	},
	{ name: "shiplog", status: "LIVE", up: "63d", req: 9184, mail: 44, pay: 12 },
	{
		name: "pantry-api",
		status: "LIVE",
		up: "212d",
		req: 130552,
		mail: 812,
		pay: 0,
	},
];

const FLEET_ON_DELAY = 3.7;

function pad(s: string, n: number) {
	return s.length >= n ? s.slice(0, n) : s + " ".repeat(n - s.length);
}

export function VariantJDarkOps() {
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
		<div className="dko">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{stylesJ}</style>

			<header className="dko-head">
				<span className="dko-wordmark">
					Alfredo
					<span className="dko-wordmark-led" aria-hidden="true" />
				</span>
				<span className="dko-etch">SELF-HOSTED</span>
			</header>

			<main>
				<section className="dko-hero">
					<h1 className="dko-h1">
						Ship your next SaaS in minutes.
						<br />
						Watch them all from <span className="dko-green">one console.</span>
					</h1>
					<p className="dko-sub">
						Auth, email, database, analytics — wired once, on your own server.
						And because Alfredo wired them, it watches them all.
					</p>
				</section>

				<section className="dko-bezel" aria-label="Alfredo console display">
					<div className="dko-bezel-top">
						<span className="dko-etch">ALFREDO OS 0.1</span>
						<span className="dko-etch">UNIT 000-001</span>
					</div>
					<div className="dko-glass">
						<div className="dko-glare" aria-hidden="true" />
						{BOOT.map((l) => (
							<div
								className="dko-line"
								key={l.id}
								style={{ animationDelay: `${l.delay}s` }}
							>
								{l.text || " "}
							</div>
						))}
						<div
							className="dko-line dko-line-dim"
							style={{ animationDelay: `${FLEET_ON_DELAY}s` }}
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
								className="dko-line"
								key={p.name}
								style={{
									animationDelay: `${FLEET_ON_DELAY + 0.15 + i * 0.15}s`,
								}}
							>
								{pad(p.name, 12)}
								<span className="dko-live">{pad(`● ${p.status}`, 8)}</span>
								{pad(p.up, 8) +
									pad(p.req.toLocaleString("en-US"), 9) +
									pad(String(p.mail), 6) +
									p.pay}
							</div>
						))}
						<div
							className="dko-line dko-line-amber"
							style={{ animationDelay: `${FLEET_ON_DELAY + 1}s` }}
						>
							4 PROJECTS · 1 BOX · 0 EXTRA TABS
						</div>
						<span className="dko-cursor" aria-hidden="true" />
					</div>
					<div className="dko-bezel-bottom">
						<span className="dko-etch dko-microprint">
							ONE BOX · ONE CONSOLE · N PROJECTS
						</span>
					</div>
				</section>

				<section className="dko-ctawrap">
					<form
						className="dko-cta"
						onSubmit={(e) => {
							e.preventDefault();
							setJoined(true);
						}}
					>
						{joined ? (
							<p className="dko-joined">WAITLIST ● CONFIRMED</p>
						) : (
							<>
								<label className="dko-slot">
									<span className="dko-etch dko-slot-label">OPERATOR</span>
									<input
										className="dko-input"
										type="email"
										required
										placeholder="you@yourdomain.dev"
										aria-label="Email address"
									/>
								</label>
								<button className="dko-key" type="submit">
									Join waitlist
								</button>
							</>
						)}
					</form>
				</section>
			</main>

			<footer className="dko-foot">
				<span className="dko-etch dko-microprint">
					ALFREDO · THE HOME FOR YOUR PROJECTS · SELF-HOSTED, YOURS FOREVER
				</span>
			</footer>
		</div>
	);
}

const stylesJ = `
.dko {
	--bg: #14150e;
	--panel: #1e1f16;
	--panel-2: #24251b;
	--paper: #ece7da;
	--paper-soft: #97927f;
	--seam: rgba(236, 231, 218, 0.1);
	--led: #3bd23b;
	--led-glow: rgba(59, 210, 59, 0.75);
	--green-text: #58e85c;
	--amber: #ffd23c;
	--display-bg: #0d0e08;
	--display-text: #58e85c;

	min-height: 100vh;
	background: var(--bg);
	color: var(--paper);
	font-family: "Space Grotesk", sans-serif;
}
.dko-etch {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	font-weight: 400;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--paper-soft);
}
.dko-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.dko-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.dko-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 9px var(--led-glow);
}
.dko-hero { text-align: center; padding: 64px 24px 0; }
.dko-h1 {
	margin: 0;
	font-size: clamp(36px, 5.4vw, 64px);
	font-weight: 700;
	line-height: 1.06;
	letter-spacing: -0.04em;
}
.dko-green { color: var(--green-text); text-shadow: 0 0 22px rgba(88, 232, 92, 0.35); }
.dko-sub {
	margin: 24px auto 0;
	max-width: 56ch;
	font-size: 18px;
	line-height: 1.6;
	color: #b3ad9b;
}
.dko-bezel {
	max-width: 940px;
	margin: 56px auto 0;
	padding: 0 24px;
}
.dko-bezel-top,
.dko-bezel-bottom {
	background: var(--panel);
	border: 1px solid var(--seam);
	display: flex;
	justify-content: space-between;
	padding: 10px 24px;
}
.dko-bezel-top { border-radius: 14px 14px 0 0; border-bottom: none; }
.dko-bezel-bottom {
	border-radius: 0 0 14px 14px;
	border-top: none;
	justify-content: center;
	box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.dko-glass {
	position: relative;
	overflow: hidden;
	background:
		linear-gradient(180deg, rgba(88, 232, 92, 0.03), rgba(0,0,0,0) 30%),
		var(--display-bg);
	border: 1px solid var(--seam);
	padding: 30px 34px 36px;
	min-height: 330px;
	font-family: "VT323", monospace;
	font-size: clamp(16px, 2vw, 22px);
	line-height: 1.5;
	color: var(--display-text);
	box-shadow:
		inset 0 4px 18px rgba(0, 0, 0, 0.9),
		inset 0 0 60px rgba(88, 232, 92, 0.04);
}
.dko-glare {
	position: absolute;
	inset: 0;
	pointer-events: none;
	background: linear-gradient(115deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 24%);
}
.dko-line {
	opacity: 0;
	animation: dko-on 0.05s linear forwards;
	text-shadow: 0 0 7px rgba(88, 232, 92, 0.45);
	white-space: pre;
	font-variant-numeric: tabular-nums;
}
.dko-line-dim { color: #3f7a41; text-shadow: none; }
.dko-line-amber { color: var(--amber); text-shadow: 0 0 7px rgba(255, 210, 60, 0.4); margin-top: 0.8em; }
.dko-live { color: var(--display-text); }
.dko-cursor {
	display: inline-block;
	width: 0.55em;
	height: 1em;
	background: var(--display-text);
	opacity: 0;
	animation: dko-blink 1s steps(1) infinite 5s;
}
.dko-ctawrap { display: flex; justify-content: center; padding: 52px 24px 0; }
.dko-cta { display: flex; gap: 14px; align-items: stretch; flex-wrap: wrap; justify-content: center; }
.dko-slot {
	display: flex;
	flex-direction: column;
	gap: 5px;
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 12px;
	padding: 10px 16px 12px;
	box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.55);
}
.dko-slot-label { font-size: 9px; }
.dko-input {
	border: none;
	background: transparent;
	font-family: "IBM Plex Mono", monospace;
	font-size: 15px;
	color: var(--green-text);
	min-width: 250px;
	padding: 0;
}
.dko-input::placeholder { color: #56604a; }
.dko-input:focus { outline: none; }
.dko-slot:focus-within { outline: 2px solid var(--green-text); outline-offset: 2px; }
.dko-key {
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
.dko-key:hover { background: linear-gradient(180deg, #fffdf6 0%, #ece7da 100%); }
.dko-key:active {
	transform: translateY(3px);
	box-shadow: 0 1px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85);
}
.dko-joined {
	font-family: "IBM Plex Mono", monospace;
	font-size: 16px;
	letter-spacing: 0.1em;
	color: var(--green-text);
	align-self: center;
}
.dko-foot { padding: 72px 24px 40px; text-align: center; }
.dko-microprint { font-size: 9px; opacity: 0.8; }
@keyframes dko-on { to { opacity: 1; } }
@keyframes dko-blink {
	0%, 49% { opacity: 1; }
	50%, 100% { opacity: 0; }
}
@media (max-width: 720px) {
	.dko-glass { padding: 22px 18px 28px; font-size: 13px; }
}
.dko *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.dko * { animation-duration: 0.01ms !important; animation-delay: 0s !important; transition: none !important; }
}
`;
