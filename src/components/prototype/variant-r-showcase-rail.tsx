// PROTOTYPE variant R — showcase "Guided Rail" (wayfinder #13 round 2,
// throwaway). The P×Q combine: Q's generously-spaced copy blocks scroll on
// the left while P's single console glass sticks on the right and switches
// channel as each block passes center. Scrolling naturally walks every
// view (fixes P's discoverability), yet everything renders inside one
// product glass (keeps P's "views of one console" frame). Under 860px the
// sticky glass hides and each block shows its own panel inline (Q-style).
import { useEffect, useRef, useState } from "react";
import {
	SHOWCASE_ITEMS,
	SHOWCASE_PANELS,
	type ShowcaseKey,
	showcaseStyles,
} from "#/components/prototype/showcase-panels";

export function VariantRShowcaseRail() {
	const [active, setActive] = useState<ShowcaseKey>("traffic");
	const blockRefs = useRef<Partial<Record<ShowcaseKey, HTMLDivElement>>>({});
	const activeItem = SHOWCASE_ITEMS.find((i) => i.key === active);
	const ActivePanel = SHOWCASE_PANELS[active];

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActive(entry.target.getAttribute("data-key") as ShowcaseKey);
					}
				}
			},
			// A thin band around the viewport's vertical center decides the
			// active view — exactly one block can own it at a time.
			{ rootMargin: "-45% 0px -45% 0px" },
		);
		for (const el of Object.values(blockRefs.current)) {
			if (el) observer.observe(el);
		}
		return () => observer.disconnect();
	}, []);

	return (
		<div className="wsr">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{showcaseStyles}</style>
			<style>{stylesR}</style>

			<header className="wsr-head">
				<span className="wsr-wordmark">
					Alfredo
					<span className="wsr-wordmark-led" aria-hidden="true" />
				</span>
				<span className="wsr-etch">SELF-HOSTED</span>
			</header>

			<div className="wsr-ghost">ACT 2 · ONE CONSOLE — ENDS ABOVE</div>

			<section className="wsr-section" aria-label="Inside the console">
				<h2 className="wsr-h2">Inside the console.</h2>
				<p className="wsr-sub">
					Because Alfredo wired your stack, it can watch it. The views you get
					on day one.
				</p>

				<div className="wsr-cols">
					<div className="wsr-blocks">
						{SHOWCASE_ITEMS.map((item) => {
							const Panel = SHOWCASE_PANELS[item.key];
							return (
								<div
									className={`wsr-block${active === item.key ? " wsr-block-active" : ""}`}
									key={item.key}
									data-key={item.key}
									ref={(el) => {
										if (el) blockRefs.current[item.key] = el;
									}}
								>
									<span className="wsr-etch">
										CONSOLE / {item.etch}
										{item.provider ? ` — VIA ${item.provider}` : ""}
									</span>
									<h3 className="wsr-line">{item.line}</h3>
									<div className="wsr-inline-panel">
										<Panel />
									</div>
								</div>
							);
						})}
					</div>

					<div className="wsr-stickycol">
						<div className="wsr-sticky">
							<div className="wsr-bezel-top">
								<span className="wsr-etch">ALFREDO OS 0.1</span>
								<span className="wsr-etch">CONSOLE / {activeItem?.etch}</span>
								<span className="wsr-etch">SIMULATED DATA</span>
							</div>
							<div className="wsr-app">
								<div className="wsr-stage">
									<div className="wsr-view" key={active}>
										<ActivePanel />
									</div>
								</div>
								<div className="wsr-dots" aria-hidden="true">
									{SHOWCASE_ITEMS.map((item) => (
										<span
											className={`wsr-dot${active === item.key ? " wsr-dot-on" : ""}`}
											key={item.key}
										/>
									))}
								</div>
							</div>
							<div className="wsr-bezel-bottom">
								<span className="wsr-etch wsr-microprint">
									ONE BOX · ONE CONSOLE · N PROJECTS
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="wsr-ghost">FOUNDER NOTE — FOLLOWS BELOW</div>
		</div>
	);
}

const stylesR = `
.wsr {
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
.wsr-etch {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--paper-soft);
}
.wsr-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.wsr-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.wsr-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 9px var(--led-glow);
}
.wsr-ghost {
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
.wsr-section {
	max-width: 1060px;
	margin: 0 auto;
	padding: 24px 32px 0;
}
.wsr-h2 {
	margin: 0;
	font-size: clamp(28px, 3.6vw, 40px);
	font-weight: 700;
	letter-spacing: -0.03em;
	line-height: 1.1;
}
.wsr-sub {
	margin: 14px 0 0;
	max-width: 52ch;
	font-size: 16px;
	line-height: 1.6;
	color: #b3ad9b;
}
.wsr-cols {
	margin-top: 24px;
	display: grid;
	grid-template-columns: 5fr 7fr;
	gap: 48px;
}
.wsr-blocks { display: flex; flex-direction: column; }
.wsr-block {
	min-height: 46vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 14px;
	opacity: 0.3;
	transition: opacity 0.3s ease;
}
.wsr-block-active { opacity: 1; }
.wsr-line {
	margin: 0;
	font-size: clamp(20px, 2.6vw, 27px);
	font-weight: 700;
	letter-spacing: -0.02em;
	line-height: 1.25;
}
.wsr-inline-panel { display: none; }
.wsr-stickycol { min-width: 0; }
.wsr-sticky {
	position: sticky;
	top: calc(50vh - 265px);
}
.wsr-bezel-top,
.wsr-bezel-bottom {
	background: var(--panel);
	border: 1px solid var(--seam);
	display: flex;
	justify-content: space-between;
	padding: 10px 24px;
}
.wsr-bezel-top { border-radius: 14px 14px 0 0; border-bottom: none; }
.wsr-bezel-bottom {
	border-radius: 0 0 14px 14px;
	border-top: none;
	justify-content: center;
	box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.wsr-microprint { font-size: 9px; opacity: 0.8; }
/* Fixed-height glass, same discipline as the hero: views swap, nothing reflows. */
.wsr-app {
	background: var(--surface);
	border: 1px solid var(--seam);
	height: 420px;
	display: flex;
	flex-direction: column;
	box-shadow: inset 0 4px 18px rgba(0, 0, 0, 0.6);
}
.wsr-stage { flex: 1; min-height: 0; padding: 18px 22px 10px; }
.wsr-view { height: 100%; animation: wsr-in 0.25s ease both; }
.wsr-dots {
	display: flex;
	justify-content: center;
	gap: 8px;
	padding: 0 0 12px;
	flex-shrink: 0;
}
.wsr-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--led-off);
	transition: background 0.3s ease, box-shadow 0.3s ease;
}
.wsr-dot-on { background: var(--led); box-shadow: 0 0 6px var(--led-glow); }
@keyframes wsr-in {
	from { opacity: 0; transform: translateY(6px); }
	to { opacity: 1; transform: translateY(0); }
}
@media (max-width: 860px) {
	.wsr-cols { grid-template-columns: 1fr; gap: 0; }
	.wsr-stickycol { display: none; }
	.wsr-block { min-height: 0; padding: 34px 0; opacity: 1; }
	.wsr-inline-panel { display: block; margin-top: 8px; }
}
.wsr *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.wsr * { animation-duration: 0.01ms !important; transition: none !important; }
}
`;
