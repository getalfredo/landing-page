// PROTOTYPE variant K — "The Rack" (wayfinder #11, throwaway).
// Identity v2 axis test: maximum hardware literalism — the fleet is
// physical. Each project is a 1U rack unit in a rail-mounted frame:
// silkscreened part numbers, a segmented traffic meter, MAIL/PAY lamps,
// crosshead screws, grip dots, a barcode strip. Microlabels lean into
// borrowed Teenage-Engineering clothing (heavier decoration than H/I).
// The newest unit slides in at the top with its boot readout playing.
import { useEffect, useState } from "react";

const BOOT = [
	{ id: "up", text: "> alfredo up my-saas", delay: 0.8 },
	{ id: "svc", text: "5 services ....... ok", delay: 1.8 },
	{ id: "ready", text: "READY  00:04", delay: 2.6 },
];

type Unit = {
	no: string;
	name: string;
	up: string;
	mail: number;
	pay: number;
	load: number; // 0..12 segments lit
};

const RACK_START: Unit[] = [
	{ no: "ALF-U02", name: "invoicer", up: "148d", mail: 291, pay: 57, load: 5 },
	{ no: "ALF-U03", name: "shiplog", up: "63d", mail: 44, pay: 12, load: 3 },
	{ no: "ALF-U04", name: "pantry-api", up: "212d", mail: 812, pay: 0, load: 8 },
];

const SEGMENTS = Array.from({ length: 12 }, (_, i) => `seg-${i}`);

export function VariantKRack() {
	const [joined, setJoined] = useState(false);
	const [rack, setRack] = useState(RACK_START);

	useEffect(() => {
		const id = setInterval(() => {
			setRack((prev) =>
				prev.map((u) => ({
					...u,
					load: Math.max(
						1,
						Math.min(12, u.load + Math.floor(Math.random() * 5) - 2),
					),
					mail: Math.random() < 0.06 ? u.mail + 1 : u.mail,
					pay: Math.random() < 0.025 ? u.pay + 1 : u.pay,
				})),
			);
		}, 1100);
		return () => clearInterval(id);
	}, []);

	return (
		<div className="rck">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{stylesK}</style>

			<header className="rck-head">
				<span className="rck-wordmark">
					Alfredo
					<span className="rck-wordmark-led" aria-hidden="true" />
				</span>
				<span className="rck-silk">RACK SYSTEM · UNIT NO. 000-001</span>
			</header>

			<main>
				<section className="rck-hero">
					<h1 className="rck-h1">
						Ship your next SaaS in minutes.
						<br />
						Watch them all from <span className="rck-green">one console.</span>
					</h1>
					<p className="rck-sub">
						Auth, email, database, analytics — wired once, on your own server.
						Every project you ship slots into the rack. Alfredo watches the
						whole thing.
					</p>
				</section>

				<section className="rck-rackwrap" aria-label="Project rack">
					<div className="rck-rack">
						<div className="rck-rail rck-rail-l" aria-hidden="true">
							<span className="rck-screw" />
							<span className="rck-screw" />
							<span className="rck-screw" />
							<span className="rck-screw" />
						</div>
						<div className="rck-rail rck-rail-r" aria-hidden="true">
							<span className="rck-screw" />
							<span className="rck-screw" />
							<span className="rck-screw" />
							<span className="rck-screw" />
						</div>

						<div className="rck-units">
							<div className="rck-rackhead">
								<span className="rck-silk">ALFREDO OS 0.1</span>
								<span className="rck-silk rck-grip" aria-hidden="true">
									·································
								</span>
								<span className="rck-silk">FLEET / 04 UNITS</span>
							</div>

							<article className="rck-unit rck-unit-new">
								<div className="rck-unit-id">
									<span className="rck-silk">ALF-U01</span>
									<h2 className="rck-unit-name">my-saas</h2>
									<span className="rck-silk rck-dim">PROVISIONING</span>
								</div>
								<div className="rck-unit-display">
									{BOOT.map((l) => (
										<div
											className="rck-boot-line"
											key={l.id}
											style={{ animationDelay: `${l.delay}s` }}
										>
											{l.text}
										</div>
									))}
								</div>
								<div className="rck-unit-lamps">
									<span className="rck-lamp-group">
										<span className="rck-silk">PWR</span>
										<span className="rck-led rck-led-boot" />
									</span>
									<span className="rck-silk rck-push">
										PUSH <span aria-hidden="true">⏷</span>
									</span>
								</div>
							</article>

							{rack.map((u) => (
								<article className="rck-unit" key={u.no}>
									<div className="rck-unit-id">
										<span className="rck-silk">{u.no}</span>
										<h2 className="rck-unit-name">{u.name}</h2>
										<span className="rck-silk rck-dim">UP {u.up}</span>
									</div>
									<div className="rck-meter">
										<span className="rck-silk rck-meter-label">TRAFFIC</span>
										<span className="rck-meter-track">
											{SEGMENTS.map((segId, s) => (
												<span
													className={`rck-seg${s < u.load ? " rck-seg-lit" : ""}${s >= 9 && s < u.load ? " rck-seg-hot" : ""}`}
													key={segId}
												/>
											))}
										</span>
									</div>
									<div className="rck-unit-lamps">
										<span
											className="rck-lamp-group"
											key={`m-${u.no}-${u.mail}`}
										>
											<span className="rck-silk">MAIL</span>
											<span className="rck-led rck-led-blip" />
											<span className="rck-count">{u.mail}</span>
										</span>
										<span className="rck-lamp-group" key={`p-${u.no}-${u.pay}`}>
											<span className="rck-silk">PAY</span>
											<span className="rck-led rck-led-amber rck-led-blip" />
											<span className="rck-count">{u.pay}</span>
										</span>
										<span className="rck-lamp-group">
											<span className="rck-silk">PWR</span>
											<span className="rck-led rck-led-on" />
										</span>
									</div>
								</article>
							))}

							<div className="rck-rackfoot">
								<span className="rck-barcode" aria-hidden="true" />
								<span className="rck-silk rck-microprint">
									ONE BOX · ONE CONSOLE · N PROJECTS · MADE FOR YOUR OWN MACHINE
								</span>
							</div>
						</div>
					</div>
				</section>

				<section className="rck-ctawrap">
					<form
						className="rck-cta"
						onSubmit={(e) => {
							e.preventDefault();
							setJoined(true);
						}}
					>
						<span className="rck-silk rck-cta-label">EXPANSION SLOT</span>
						{joined ? (
							<p className="rck-joined">WAITLIST ● CONFIRMED</p>
						) : (
							<div className="rck-cta-controls">
								<label className="rck-slot">
									<span className="rck-silk rck-slot-label">OPERATOR</span>
									<input
										className="rck-input"
										type="email"
										required
										placeholder="you@yourdomain.dev"
										aria-label="Email address"
									/>
								</label>
								<button className="rck-key" type="submit">
									Join waitlist
								</button>
							</div>
						)}
					</form>
				</section>
			</main>

			<footer className="rck-foot">
				<span className="rck-silk rck-microprint">
					ALFREDO · THE HOME FOR YOUR PROJECTS · SELF-HOSTED, YOURS FOREVER
				</span>
			</footer>
		</div>
	);
}

const stylesK = `
.rck {
	--bg: #e4dfd3;
	--panel: #efebe0;
	--panel-2: #f6f3ea;
	--rail: #d8d2c2;
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
.rck-silk {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	font-weight: 500;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--ink-soft);
}
.rck-dim { opacity: 0.7; }
.rck-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.rck-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.rck-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 7px var(--led-glow), inset 0 -1px 1px rgba(0,0,0,0.2);
}
.rck-hero { text-align: center; padding: 64px 24px 0; }
.rck-h1 {
	margin: 0;
	font-size: clamp(36px, 5.4vw, 64px);
	font-weight: 700;
	line-height: 1.06;
	letter-spacing: -0.04em;
}
.rck-green { color: var(--green-text); }
.rck-sub {
	margin: 24px auto 0;
	max-width: 56ch;
	font-size: 18px;
	line-height: 1.6;
	color: #4f4a3b;
}
.rck-rackwrap { max-width: 880px; margin: 56px auto 0; padding: 0 24px; }
.rck-rack {
	position: relative;
	padding: 0 34px;
}
.rck-rail {
	position: absolute;
	top: 0;
	bottom: 0;
	width: 26px;
	background: linear-gradient(90deg, var(--rail), #cfc8b6);
	border: 1px solid var(--seam);
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 18px 0;
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
}
.rck-rail-l { left: 0; }
.rck-rail-r { right: 0; }
.rck-screw {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: radial-gradient(circle at 35% 30%, #f2eee2, #b9b19d 70%);
	border: 1px solid rgba(28,25,19,0.3);
	box-shadow: inset 0 -1px 2px rgba(28,25,19,0.35);
	position: relative;
}
.rck-screw::before,
.rck-screw::after {
	content: "";
	position: absolute;
	top: 50%;
	left: 50%;
	width: 8px;
	height: 1.5px;
	background: rgba(28,25,19,0.45);
	transform: translate(-50%, -50%) rotate(45deg);
}
.rck-screw::after { transform: translate(-50%, -50%) rotate(-45deg); }
.rck-units {
	display: flex;
	flex-direction: column;
	gap: 7px;
}
.rck-rackhead,
.rck-rackfoot {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	background: var(--panel-2);
	border: 1px solid var(--seam);
	border-radius: 10px;
	padding: 10px 22px;
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
}
.rck-grip { letter-spacing: 0.3em; overflow: hidden; flex: 1; text-align: center; white-space: nowrap; }
.rck-unit {
	display: grid;
	grid-template-columns: 200px 1fr auto;
	gap: 24px;
	align-items: center;
	background: var(--panel);
	border: 1px solid var(--seam);
	border-radius: 10px;
	padding: 14px 22px;
	box-shadow:
		inset 0 1px 0 rgba(255,255,255,0.65),
		0 6px 16px rgba(28, 25, 19, 0.08);
}
.rck-unit-new { animation: rck-slidein 0.6s cubic-bezier(0.2, 0.9, 0.3, 1) both 0.2s; }
.rck-unit-id { display: flex; flex-direction: column; gap: 3px; }
.rck-unit-name { margin: 0; font-size: 19px; font-weight: 700; letter-spacing: -0.02em; }
.rck-unit-display {
	background: var(--display-bg);
	border-radius: 7px;
	padding: 10px 16px;
	font-family: "VT323", monospace;
	font-size: 16px;
	line-height: 1.4;
	color: var(--display-text);
	box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.75);
	min-height: 66px;
}
.rck-boot-line {
	opacity: 0;
	animation: rck-on 0.05s linear forwards;
	text-shadow: 0 0 6px rgba(88, 232, 92, 0.4);
	white-space: pre;
}
.rck-boot-line:last-of-type { color: var(--amber); text-shadow: 0 0 6px rgba(255, 210, 60, 0.4); }
.rck-meter { display: flex; align-items: center; gap: 14px; }
.rck-meter-label { flex-shrink: 0; }
.rck-meter-track { display: flex; gap: 4px; }
.rck-seg {
	width: 9px;
	height: 20px;
	border-radius: 2px;
	background: var(--led-off);
	box-shadow: inset 0 1px 2px rgba(0,0,0,0.25);
	transition: background 0.3s ease, box-shadow 0.3s ease;
}
.rck-seg-lit { background: var(--led); box-shadow: 0 0 6px var(--led-glow); }
.rck-seg-hot { background: var(--amber); box-shadow: 0 0 6px rgba(255, 210, 60, 0.6); }
.rck-unit-lamps { display: flex; align-items: center; gap: 20px; }
.rck-lamp-group { display: flex; align-items: center; gap: 7px; }
.rck-count {
	font-family: "IBM Plex Mono", monospace;
	font-size: 12px;
	font-variant-numeric: tabular-nums;
	min-width: 3ch;
}
.rck-led {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: var(--led-off);
	box-shadow: inset 0 1px 2px rgba(0,0,0,0.35);
	flex-shrink: 0;
}
.rck-led-on {
	background: var(--led);
	box-shadow: 0 0 8px var(--led-glow), inset 0 -1px 1px rgba(0,0,0,0.15);
}
.rck-led-boot { animation: rck-led-boot 0.3s linear forwards 2.6s; }
.rck-led-blip {
	background: var(--led);
	box-shadow: 0 0 8px var(--led-glow), inset 0 -1px 1px rgba(0,0,0,0.15);
	animation: rck-blip 0.6s ease-out;
}
.rck-led-amber {
	background: var(--amber);
	box-shadow: 0 0 8px rgba(255, 210, 60, 0.6), inset 0 -1px 1px rgba(0,0,0,0.15);
}
.rck-push { display: flex; align-items: center; gap: 4px; }
.rck-barcode {
	display: inline-block;
	width: 90px;
	height: 16px;
	background: repeating-linear-gradient(
		90deg,
		var(--ink) 0 2px,
		transparent 2px 4px,
		var(--ink) 4px 5px,
		transparent 5px 9px
	);
	opacity: 0.55;
	flex-shrink: 0;
}
.rck-microprint { font-size: 9px; opacity: 0.85; }
.rck-ctawrap { display: flex; justify-content: center; padding: 52px 24px 0; }
.rck-cta {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	background: var(--panel);
	border: 1px dashed rgba(28, 25, 19, 0.3);
	border-radius: 14px;
	padding: 16px 26px 22px;
}
.rck-cta-label { font-size: 9px; }
.rck-cta-controls { display: flex; gap: 14px; align-items: stretch; flex-wrap: wrap; justify-content: center; }
.rck-slot {
	display: flex;
	flex-direction: column;
	gap: 5px;
	background: var(--panel-2);
	border: 1px solid var(--seam);
	border-radius: 12px;
	padding: 10px 16px 12px;
	box-shadow:
		inset 0 2px 5px rgba(28, 25, 19, 0.12),
		0 1px 0 rgba(255,255,255,0.7);
}
.rck-slot-label { font-size: 9px; }
.rck-input {
	border: none;
	background: transparent;
	font-family: "IBM Plex Mono", monospace;
	font-size: 15px;
	color: var(--ink);
	min-width: 250px;
	padding: 0;
}
.rck-input:focus { outline: none; }
.rck-slot:focus-within { outline: 2px solid var(--green-text); outline-offset: 2px; }
.rck-key {
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
.rck-key:hover { color: #7dff81; }
.rck-key:active {
	transform: translateY(3px);
	box-shadow: 0 1px 0 #0d0b07, inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
.rck-joined {
	font-family: "IBM Plex Mono", monospace;
	font-size: 16px;
	letter-spacing: 0.1em;
	color: var(--green-text);
	margin: 8px 0 0;
}
.rck-foot { padding: 72px 24px 40px; text-align: center; }
@keyframes rck-on { to { opacity: 1; } }
@keyframes rck-slidein {
	from { transform: translateY(-18px); opacity: 0; }
	to { transform: translateY(0); opacity: 1; }
}
@keyframes rck-led-boot {
	to { background: var(--led); box-shadow: 0 0 8px var(--led-glow), inset 0 -1px 1px rgba(0,0,0,0.15); }
}
@keyframes rck-blip {
	0% { transform: scale(1.5); }
	100% { transform: scale(1); }
}
@media (max-width: 760px) {
	.rck-rack { padding: 0; }
	.rck-rail { display: none; }
	.rck-unit { grid-template-columns: 1fr; gap: 12px; }
	.rck-grip { display: none; }
}
.rck *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.rck * { animation-duration: 0.01ms !important; animation-delay: 0s !important; transition: none !important; }
}
`;
