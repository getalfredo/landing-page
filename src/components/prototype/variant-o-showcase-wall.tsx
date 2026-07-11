// PROTOTYPE variant O — showcase "Panel Wall" (wayfinder #13, throwaway).
// The four integration panels as a 2×2 wall of framed console windows, each
// captioned with its one-liner. All the breadth visible at once — the
// skimmer's inventory. Dimmed placeholders above/below stand in for the
// neighboring page sections so the section is judged in flow.
import {
	SHOWCASE_ITEMS,
	SHOWCASE_PANELS,
	showcaseStyles,
} from "#/components/prototype/showcase-panels";

export function VariantOShowcaseWall() {
	return (
		<div className="wso">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{showcaseStyles}</style>
			<style>{stylesO}</style>

			<header className="wso-head">
				<span className="wso-wordmark">
					Alfredo
					<span className="wso-wordmark-led" aria-hidden="true" />
				</span>
				<span className="wso-etch">SELF-HOSTED</span>
			</header>

			<div className="wso-ghost">ACT 2 · ONE CONSOLE — ENDS ABOVE</div>

			<section className="wso-section" aria-label="Inside the console">
				<h2 className="wso-h2">Inside the console.</h2>
				<p className="wso-sub">
					Because Alfredo wired your stack, it can watch it. Four of the views
					you get on day one.
				</p>

				<div className="wso-grid">
					{SHOWCASE_ITEMS.map((item) => {
						const Panel = SHOWCASE_PANELS[item.key];
						return (
							<figure className="wso-cell" key={item.key}>
								<div className="wso-cell-panel">
									<Panel />
								</div>
								<figcaption className="wso-caption">
									<span className="wso-caption-name">{item.name}</span>
									<span className="wso-caption-line">{item.line}</span>
								</figcaption>
							</figure>
						);
					})}
				</div>
			</section>

			<div className="wso-ghost">FOUNDER NOTE — FOLLOWS BELOW</div>
		</div>
	);
}

const stylesO = `
.wso {
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
.wso-etch {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--paper-soft);
}
.wso-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.wso-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.wso-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 9px var(--led-glow);
}
.wso-ghost {
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
.wso-section {
	max-width: 980px;
	margin: 0 auto;
	padding: 24px 24px 0;
}
.wso-h2 {
	margin: 0;
	font-size: clamp(28px, 3.6vw, 40px);
	font-weight: 700;
	letter-spacing: -0.03em;
	line-height: 1.1;
}
.wso-sub {
	margin: 14px 0 0;
	max-width: 52ch;
	font-size: 16px;
	line-height: 1.6;
	color: #b3ad9b;
}
.wso-grid {
	margin-top: 36px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 26px 22px;
}
.wso-cell { margin: 0; display: flex; flex-direction: column; gap: 12px; }
.wso-cell-panel { min-height: 218px; display: flex; flex-direction: column; }
.wso-cell-panel > * { flex: 1; }
.wso-caption { display: flex; flex-direction: column; gap: 3px; padding: 0 4px; }
.wso-caption-name { font-weight: 700; font-size: 15px; letter-spacing: -0.01em; }
.wso-caption-line { font-size: 14px; line-height: 1.5; color: var(--paper-soft); }
@media (max-width: 780px) {
	.wso-grid { grid-template-columns: 1fr; }
}
.wso *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.wso * { animation-duration: 0.01ms !important; transition: none !important; }
}
`;
