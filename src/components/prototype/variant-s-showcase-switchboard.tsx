// PROTOTYPE variant S — showcase "Switchboard" (wayfinder #13 round 3,
// throwaway). Round-2 winner, reworked per reaction: the left menu is now a
// column of bone keycaps (the hero's button language); the selected keycap
// is amber and depressed with a lit LED — unmistakably distinct; views
// auto-rotate every 5s, an ink progress bar filling along the active
// keycap's bottom edge, and any click selects + restarts the cycle. The
// active view's one-liner lives in a caption strip under the glass stage.
import { useEffect, useState } from "react";
import {
	SHOWCASE_ITEMS,
	SHOWCASE_PANELS,
	type ShowcaseKey,
	showcaseStyles,
} from "#/components/prototype/showcase-panels";

const ROTATE_MS = 5000;

export function VariantSShowcaseSwitchboard() {
	// key = the shown view; n bumps on every selection so the rotate timer
	// and progress bar restart even when the same keycap is re-pressed.
	const [sel, setSel] = useState<{ key: ShowcaseKey; n: number }>({
		key: "traffic",
		n: 0,
	});
	const view = sel.key;
	const active = SHOWCASE_ITEMS.find((i) => i.key === view);
	const Panel = SHOWCASE_PANELS[view];

	useEffect(() => {
		const idx = SHOWCASE_ITEMS.findIndex((i) => i.key === sel.key);
		const t = setTimeout(() => {
			setSel((prev) => ({
				key: SHOWCASE_ITEMS[(idx + 1) % SHOWCASE_ITEMS.length].key,
				n: prev.n + 1,
			}));
		}, ROTATE_MS);
		return () => clearTimeout(t);
	}, [sel]);

	const pick = (key: ShowcaseKey) => {
		setSel((prev) => ({ key, n: prev.n + 1 }));
	};

	return (
		<div className="wss">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{showcaseStyles}</style>
			<style>{stylesS}</style>

			<header className="wss-head">
				<span className="wss-wordmark">
					Alfredo
					<span className="wss-wordmark-led" aria-hidden="true" />
				</span>
				<span className="wss-etch">SELF-HOSTED</span>
			</header>

			<div className="wss-ghost">ACT 2 · ONE CONSOLE — ENDS ABOVE</div>

			<section className="wss-section" aria-label="Inside the console">
				<h2 className="wss-h2">Inside the console.</h2>
				<p className="wss-sub">
					Because Alfredo wired your stack, it can watch it. The views you get
					on day one.
				</p>

				<div className="wss-bezel">
					<div className="wss-bezel-top">
						<span className="wss-etch">ALFREDO OS 0.1</span>
						<span className="wss-etch">CONSOLE / {active?.etch}</span>
						<span className="wss-etch">SIMULATED DATA</span>
					</div>

					<div className="wss-app">
						<div className="wss-menu" role="tablist" aria-label="Console views">
							{SHOWCASE_ITEMS.map((item) => {
								const on = view === item.key;
								return (
									<button
										type="button"
										role="tab"
										aria-selected={on}
										className={`wss-key${on ? " wss-key-on" : ""}`}
										key={item.key}
										onClick={() => pick(item.key)}
									>
										<span
											className={`wss-key-led${on ? " wss-key-led-on" : ""}`}
											aria-hidden="true"
										/>
										<span className="wss-key-name">{item.name}</span>
										{item.provider && (
											<span className="wss-key-provider">{item.provider}</span>
										)}
										{on && (
											<span className="wss-key-track" aria-hidden="true">
												<span
													className="wss-key-fill"
													key={`${sel.key}-${sel.n}`}
												/>
											</span>
										)}
									</button>
								);
							})}
						</div>

						<div className="wss-main">
							<div className="wss-stage">
								<div className="wss-view" key={view}>
									<Panel />
								</div>
							</div>
							<div className="wss-captionbar">
								<p className="wss-caption">{active?.line}</p>
							</div>
						</div>
					</div>

					<div className="wss-bezel-bottom">
						<span className="wss-etch wss-microprint">
							ONE BOX · ONE CONSOLE · N PROJECTS
						</span>
					</div>
				</div>
			</section>

			<div className="wss-ghost">FOUNDER NOTE — FOLLOWS BELOW</div>
		</div>
	);
}

const stylesS = `
.wss {
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
.wss-etch {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--paper-soft);
}
.wss-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.wss-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.wss-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 9px var(--led-glow);
}
.wss-ghost {
	max-width: 1020px;
	margin: 44px auto;
	padding: 34px 24px;
	border: 1px dashed var(--seam);
	border-radius: 14px;
	text-align: center;
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	letter-spacing: 0.22em;
	color: var(--paper-soft);
	opacity: 0.4;
}
.wss-section {
	max-width: 1020px;
	margin: 0 auto;
	padding: 24px 24px 0;
	text-align: center;
}
.wss-h2 {
	margin: 0;
	font-size: clamp(28px, 3.6vw, 40px);
	font-weight: 700;
	letter-spacing: -0.03em;
	line-height: 1.1;
}
.wss-sub {
	margin: 14px auto 0;
	max-width: 52ch;
	font-size: 16px;
	line-height: 1.6;
	color: #b3ad9b;
}
.wss-bezel { margin-top: 36px; text-align: left; }
.wss-bezel-top,
.wss-bezel-bottom {
	background: var(--panel);
	border: 1px solid var(--seam);
	display: flex;
	justify-content: space-between;
	padding: 10px 24px;
}
.wss-bezel-top { border-radius: 14px 14px 0 0; border-bottom: none; }
.wss-bezel-bottom {
	border-radius: 0 0 14px 14px;
	border-top: none;
	justify-content: center;
	box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.wss-microprint { font-size: 9px; opacity: 0.8; }
/* Fixed-height glass: keycap rail left, active view right, nothing reflows. */
.wss-app {
	background: var(--surface);
	border: 1px solid var(--seam);
	height: 560px;
	display: grid;
	grid-template-columns: 250px 1fr;
	box-shadow: inset 0 4px 18px rgba(0, 0, 0, 0.6);
}
.wss-menu {
	border-right: 1px solid var(--seam);
	display: flex;
	flex-direction: column;
	gap: 11px;
	padding: 16px;
}
/* bone keycap — the hero's calm button, stacked as a rail */
.wss-key {
	flex: 1;
	display: flex;
	align-items: center;
	gap: 10px;
	text-align: left;
	border: none;
	border-radius: 10px;
	padding: 0 15px;
	font-family: inherit;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	background: linear-gradient(180deg, #f6f3ea 0%, #e4dfd3 100%);
	color: #1c1913;
	box-shadow: 0 3px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85);
	transition: transform 0.06s ease, box-shadow 0.06s ease, background 0.15s ease;
}
.wss-key:hover:not(.wss-key-on) { background: linear-gradient(180deg, #fffdf6 0%, #ece7da 100%); }
.wss-key:active { transform: translateY(2px); box-shadow: 0 1px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85); }
/* the selected keycap: amber, depressed, LED lit — unmistakable */
.wss-key-on {
	background: linear-gradient(180deg, #ffd23c 0%, #eab821 100%);
	transform: translateY(2px);
	box-shadow: 0 1px 0 #9a7a10, inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.wss-key-name { font-weight: 700; font-size: 14.5px; letter-spacing: -0.01em; }
.wss-key-provider {
	margin-left: auto;
	font-family: "IBM Plex Mono", monospace;
	font-size: 8.5px;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: rgba(28, 25, 19, 0.55);
}
.wss-key-led {
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background: rgba(28, 25, 19, 0.18);
	box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.2);
	flex-shrink: 0;
}
.wss-key-led-on {
	background: #fff8e6;
	box-shadow: 0 0 8px rgba(255, 246, 220, 0.95), 0 0 0 2px rgba(28, 25, 19, 0.25);
}
/* per-interval progress bar along the active keycap's bottom edge */
.wss-key-track {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 4px;
	background: rgba(28, 25, 19, 0.16);
}
.wss-key-fill {
	display: block;
	height: 100%;
	width: 0;
	background: #1c1913;
	animation: wss-fill ${ROTATE_MS}ms linear forwards;
}
@keyframes wss-fill { to { width: 100%; } }
.wss-main { display: flex; flex-direction: column; min-width: 0; }
.wss-stage { flex: 1; min-height: 0; padding: 18px 22px 10px; }
.wss-view { height: 100%; animation: wss-in 0.25s ease both; }
.wss-captionbar {
	border-top: 1px solid var(--seam);
	padding: 13px 22px;
	flex-shrink: 0;
}
.wss-caption { margin: 0; font-size: 15px; line-height: 1.5; color: #b3ad9b; }
@keyframes wss-in {
	from { opacity: 0; transform: translateY(6px); }
	to { opacity: 1; transform: translateY(0); }
}
@media (max-width: 860px) {
	.wss-app { grid-template-columns: 1fr; height: auto; }
	.wss-menu { border-right: none; border-bottom: 1px solid var(--seam); }
	.wss-key { min-height: 46px; }
	.wss-stage { min-height: 400px; }
}
.wss *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.wss * { animation-duration: 0.01ms !important; transition: none !important; }
}
`;
