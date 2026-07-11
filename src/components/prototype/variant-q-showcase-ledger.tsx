// PROTOTYPE variant Q — showcase "Ledger" (wayfinder #13, throwaway).
// Each integration is a full-width row: the one-liner set large beside a
// wide console window, sides alternating. Editorial scroll rhythm — reads
// as four caught moments in sequence rather than an inventory wall.
import {
	SHOWCASE_ITEMS,
	SHOWCASE_PANELS,
	showcaseStyles,
} from "#/components/prototype/showcase-panels";

export function VariantQShowcaseLedger() {
	return (
		<div className="wsq">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=VT323&display=swap"
			/>
			<style>{showcaseStyles}</style>
			<style>{stylesQ}</style>

			<header className="wsq-head">
				<span className="wsq-wordmark">
					Alfredo
					<span className="wsq-wordmark-led" aria-hidden="true" />
				</span>
				<span className="wsq-etch">SELF-HOSTED</span>
			</header>

			<div className="wsq-ghost">ACT 2 · ONE CONSOLE — ENDS ABOVE</div>

			<section className="wsq-section" aria-label="Inside the console">
				<h2 className="wsq-h2">Inside the console.</h2>
				<p className="wsq-sub">
					Because Alfredo wired your stack, it can watch it. Four of the views
					you get on day one.
				</p>

				<div className="wsq-rows">
					{SHOWCASE_ITEMS.map((item) => {
						const Panel = SHOWCASE_PANELS[item.key];
						return (
							<article className="wsq-row" key={item.key}>
								<div className="wsq-copy">
									<span className="wsq-etch">CONSOLE / {item.etch}</span>
									<h3 className="wsq-line">{item.line}</h3>
								</div>
								<div className="wsq-panel">
									<Panel />
								</div>
							</article>
						);
					})}
				</div>
			</section>

			<div className="wsq-ghost">FOUNDER NOTE — FOLLOWS BELOW</div>
		</div>
	);
}

const stylesQ = `
.wsq {
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
.wsq-etch {
	font-family: "IBM Plex Mono", monospace;
	font-size: 10px;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: var(--paper-soft);
}
.wsq-head {
	max-width: 1060px;
	margin: 0 auto;
	padding: 30px 32px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.wsq-wordmark {
	font-weight: 700;
	font-size: 23px;
	letter-spacing: -0.02em;
	display: inline-flex;
	align-items: baseline;
	gap: 9px;
}
.wsq-wordmark-led {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--led);
	box-shadow: 0 0 9px var(--led-glow);
}
.wsq-ghost {
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
.wsq-section {
	max-width: 980px;
	margin: 0 auto;
	padding: 24px 24px 0;
}
.wsq-h2 {
	margin: 0;
	font-size: clamp(28px, 3.6vw, 40px);
	font-weight: 700;
	letter-spacing: -0.03em;
	line-height: 1.1;
}
.wsq-sub {
	margin: 14px 0 0;
	max-width: 52ch;
	font-size: 16px;
	line-height: 1.6;
	color: #b3ad9b;
}
.wsq-rows { margin-top: 20px; }
.wsq-row {
	display: grid;
	grid-template-columns: 5fr 7fr;
	gap: 48px;
	align-items: center;
	padding: 64px 0;
	border-bottom: 1px solid var(--seam);
}
.wsq-row:last-child { border-bottom: none; }
.wsq-row:nth-child(even) .wsq-copy { order: 2; }
.wsq-row:nth-child(even) .wsq-panel { order: 1; }
.wsq-copy { display: flex; flex-direction: column; gap: 12px; }
.wsq-line {
	margin: 0;
	font-size: clamp(19px, 2.4vw, 24px);
	font-weight: 700;
	letter-spacing: -0.02em;
	line-height: 1.3;
}
.wsq-panel { min-height: 208px; display: flex; flex-direction: column; }
.wsq-panel > * { flex: 1; }
@media (max-width: 780px) {
	.wsq-row { grid-template-columns: 1fr; gap: 16px; }
	.wsq-row:nth-child(even) .wsq-copy { order: 1; }
	.wsq-row:nth-child(even) .wsq-panel { order: 2; }
}
.wsq *:focus-visible { outline: 2px solid var(--green-text); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.wsq * { animation-duration: 0.01ms !important; transition: none !important; }
}
`;
