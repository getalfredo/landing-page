// PROTOTYPE variant P — showcase "One Glass" (wayfinder #13, throwaway).
// A single console chassis — same bezel language as the hero — with four
// keycap channel buttons. Clicking a keycap swaps the view inside the one
// glass; the one-liner renders in a caption strip under the view. This
// literalizes the framing decision: views of ONE product, not a feature
// list. User-driven like the hero — nothing auto-advances.
import { useState } from "react";
import {
	SHOWCASE_ITEMS,
	SHOWCASE_PANELS,
	type ShowcaseKey,
	showcaseStyles,
} from "#/components/prototype/showcase-panels";

export function VariantPShowcaseGlass() {
	const [view, setView] = useState<ShowcaseKey>("traffic");
	const active = SHOWCASE_ITEMS.find((i) => i.key === view);
	const Panel = SHOWCASE_PANELS[view];

	return (
		<div className="wsp">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{showcaseStyles}</style>
			<style>{stylesP}</style>

			<header className="wsp-head">
				<span className="wsp-wordmark">
					Alfredo
					<span className="wsp-wordmark-led" aria-hidden="true" />
				</span>
				<span className="wsp-etch">SELF-HOSTED</span>
			</header>

			<div className="wsp-ghost">ACT 2 · ONE CONSOLE — ENDS ABOVE</div>

			<section className="wsp-section" aria-label="Inside the console">
				<h2 className="wsp-h2">Inside the console.</h2>
				<p className="wsp-sub">
					Because Alfredo wired your stack, it can watch it. Flip through the
					views you get on day one.
				</p>

				<div className="wsp-bezel">
					<div className="wsp-bezel-top">
						<span className="wsp-etch">ALFREDO OS 0.1</span>
						<span className="wsp-etch">CONSOLE / {active?.etch}</span>
						<span className="wsp-etch">SIMULATED DATA</span>
					</div>

					<div className="wsp-app">
						<div className="wsp-appbar">
							<span className="wsp-etch">INSIDE THE CONSOLE</span>
							<div
								className="wsp-keys"
								role="tablist"
								aria-label="Console views"
							>
								{SHOWCASE_ITEMS.map((item) => (
									<button
										type="button"
										role="tab"
										aria-selected={view === item.key}
										className={`wsp-key${view === item.key ? " wsp-key-down" : ""}`}
										key={item.key}
										onClick={() => setView(item.key)}
									>
										<span
											className={`wsp-key-led${view === item.key ? " wsp-key-led-on" : ""}`}
											aria-hidden="true"
										/>
										{item.name}
									</button>
								))}
							</div>
						</div>

						<div className="wsp-stage">
							<div className="wsp-view" key={view}>
								<Panel />
							</div>
						</div>

						<div className="wsp-captionbar">
							<p className="wsp-caption">{active?.line}</p>
						</div>
					</div>

					<div className="wsp-bezel-bottom">
						<span className="wsp-etch wsp-microprint">
							ONE BOX · ONE CONSOLE · N PROJECTS
						</span>
					</div>
				</div>
			</section>

			<div className="wsp-ghost">FOUNDER NOTE — FOLLOWS BELOW</div>
		</div>
	);
}

const stylesP = `
.wsp {
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
.wsp-etch {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--paper-soft);
}
.wsp-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.wsp-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.wsp-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 9px var(--led-glow);
}
.wsp-ghost {
	max-width: 980px;
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
.wsp-section {
	max-width: 980px;
	margin: 0 auto;
	padding: 24px 24px 0;
	text-align: center;
}
.wsp-h2 {
	margin: 0;
	font-size: clamp(28px, 3.6vw, 40px);
	font-weight: 700;
	letter-spacing: -0.03em;
	line-height: 1.1;
}
.wsp-sub {
	margin: 14px auto 0;
	max-width: 52ch;
	font-size: 16px;
	line-height: 1.6;
	color: #b3ad9b;
}
.wsp-bezel { margin-top: 36px; text-align: left; }
.wsp-bezel-top,
.wsp-bezel-bottom {
	background: var(--panel);
	border: 1px solid var(--seam);
	display: flex;
	justify-content: space-between;
	padding: 10px 24px;
}
.wsp-bezel-top { border-radius: 14px 14px 0 0; border-bottom: none; }
.wsp-bezel-bottom {
	border-radius: 0 0 14px 14px;
	border-top: none;
	justify-content: center;
	box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.wsp-microprint { font-size: 9px; opacity: 0.8; }
/* Fixed-height glass, same discipline as the hero: views swap, nothing reflows. */
.wsp-app {
	background: var(--surface);
	border: 1px solid var(--seam);
	height: 430px;
	display: flex;
	flex-direction: column;
	box-shadow: inset 0 4px 18px rgba(0, 0, 0, 0.6);
}
.wsp-appbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 14px;
	padding: 12px 22px;
	border-bottom: 1px solid var(--seam);
	flex-shrink: 0;
	min-height: 58px;
	flex-wrap: wrap;
}
.wsp-keys { display: flex; gap: 10px; flex-wrap: wrap; }
.wsp-key {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	border: none;
	border-radius: 9px;
	padding: 7px 15px;
	font-family: inherit;
	font-size: 13px;
	font-weight: 700;
	letter-spacing: 0.02em;
	cursor: pointer;
	background: linear-gradient(180deg, #f6f3ea 0%, #e4dfd3 100%);
	color: #1c1913;
	box-shadow: 0 3px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85);
	transition: transform 0.06s ease, box-shadow 0.06s ease;
}
.wsp-key:hover { background: linear-gradient(180deg, #fffdf6 0%, #ece7da 100%); }
.wsp-key-down {
	transform: translateY(2px);
	box-shadow: 0 1px 0 #a29a86, inset 0 1px 0 rgba(255, 255, 255, 0.85);
}
.wsp-key-led {
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background: #b9b2a0;
	box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.25);
}
.wsp-key-led-on { background: var(--led); box-shadow: 0 0 7px var(--led-glow); }
.wsp-stage { flex: 1; min-height: 0; padding: 18px 22px; }
.wsp-view { height: 100%; animation: wsp-in 0.25s ease both; }
.wsp-captionbar {
	border-top: 1px solid var(--seam);
	padding: 14px 22px;
	flex-shrink: 0;
}
.wsp-caption { margin: 0; font-size: 15.5px; line-height: 1.5; color: #b3ad9b; }
@keyframes wsp-in {
	from { opacity: 0; transform: translateY(6px); }
	to { opacity: 1; transform: translateY(0); }
}
@media (max-width: 780px) {
	.wsp-app { height: auto; min-height: 430px; }
	.wsp-appbar { justify-content: center; }
}
.wsp *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.wsp * { animation-duration: 0.01ms !important; transition: none !important; }
}
`;
