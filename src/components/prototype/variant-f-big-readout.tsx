// PROTOTYPE variant F — "Big Readout" (wayfinder #3, round 2, throwaway).
// The boot readout IS the hero: a giant terminal panel typing at display
// scale, headline and CTA below. No device chrome. Space Grotesk + VT323.
import { useState } from "react";

const BOOT = [
	{ text: "> alfredo up my-saas", delay: 0.5 },
	{ text: "provisioning auth ......... ok", delay: 1.1 },
	{ text: "provisioning email ........ ok", delay: 1.5 },
	{ text: "provisioning database ..... ok", delay: 1.9 },
	{ text: "provisioning analytics .... ok", delay: 2.3 },
	{ text: "provisioning secrets ...... ok", delay: 2.7 },
	{ text: "READY. elapsed 00:04", delay: 3.3 },
];

export function VariantFBigReadout() {
	const [joined, setJoined] = useState(false);

	return (
		<div className="fbr">
			<link
				rel="stylesheet"
				precedence="default"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=VT323&display=swap"
			/>
			<style>{stylesF}</style>

			<main className="fbr-main">
				<div className="fbr-meta">
					<span className="fbr-wordmark">Alfredo</span>
					<span className="fbr-log">BOOT LOG — {"//"} YOUR OWN MACHINE</span>
				</div>

				<div className="fbr-terminal">
					{BOOT.map((l) => (
						<div
							className="fbr-line"
							key={l.text}
							style={{ animationDelay: `${l.delay}s` }}
						>
							{l.text}
						</div>
					))}
					<span className="fbr-cursor" aria-hidden="true" />
				</div>

				<div className="fbr-below">
					<h1 className="fbr-h1">
						That was the setup week.
						<br />
						<span className="fbr-green">All of it.</span>
					</h1>
					<p className="fbr-sub">
						Ship your next SaaS in minutes — self-hosted, on your own stack.
						Auth, email, database, analytics, secrets: pre-wired on a box you
						own.
					</p>

					<form
						className="fbr-cta"
						onSubmit={(e) => {
							e.preventDefault();
							setJoined(true);
						}}
					>
						{joined ? (
							<p className="fbr-joined">&gt; waitlist: confirmed_</p>
						) : (
							<>
								<input
									className="fbr-input"
									type="email"
									required
									placeholder="you@yourdomain.dev"
									aria-label="Email address"
								/>
								<button className="fbr-btn" type="submit">
									Join the waitlist
								</button>
							</>
						)}
					</form>
				</div>
			</main>
		</div>
	);
}

const stylesF = `
.fbr {
	min-height: 100vh;
	background: #e8e3d8;
	color: #1f1a12;
	font-family: "Space Grotesk", sans-serif;
}
.fbr-main { max-width: 1080px; margin: 0 auto; padding: 32px 32px 96px; }
.fbr-meta {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding: 0 4px 14px;
}
.fbr-wordmark { font-weight: 700; font-size: 22px; letter-spacing: -0.02em; }
.fbr-log { font-family: "VT323", monospace; font-size: 17px; opacity: 0.55; }
.fbr-terminal {
	background: #14110c;
	border-radius: 18px;
	padding: clamp(28px, 5vw, 64px);
	min-height: 56vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 0.35em;
	font-family: "VT323", monospace;
	font-size: clamp(26px, 4.4vw, 54px);
	line-height: 1.25;
	color: #46e04a;
	box-shadow: inset 0 0 60px rgba(0,0,0,0.55);
}
.fbr-line {
	opacity: 0;
	animation: fbr-on 0.05s steps(1) forwards;
	text-shadow: 0 0 10px rgba(70, 224, 74, 0.45);
	white-space: pre-wrap;
}
.fbr-line:last-of-type { color: #ffd23c; text-shadow: 0 0 10px rgba(255, 210, 60, 0.45); }
.fbr-cursor {
	width: 0.55em;
	height: 1em;
	background: #46e04a;
	opacity: 0;
	animation: fbr-blink 1s steps(1) infinite 3.8s;
}
.fbr-below { padding: 56px 4px 0; }
.fbr-h1 {
	margin: 0;
	font-size: clamp(40px, 6.5vw, 72px);
	font-weight: 700;
	line-height: 1.02;
	letter-spacing: -0.035em;
}
.fbr-green { color: #2f9e33; }
.fbr-sub {
	margin: 24px 0 0;
	max-width: 54ch;
	font-size: 18px;
	line-height: 1.55;
	color: #4d463a;
}
.fbr-cta { margin-top: 40px; display: flex; gap: 12px; flex-wrap: wrap; }
.fbr-input {
	border: 2px solid #1f1a12;
	border-radius: 12px;
	background: #f7f4ea;
	padding: 15px 18px;
	font-size: 16px;
	font-family: inherit;
	min-width: 280px;
}
.fbr-btn {
	background: #1f1a12;
	color: #46e04a;
	border: none;
	border-radius: 12px;
	padding: 16px 30px;
	font-size: 16px;
	font-weight: 700;
	font-family: inherit;
	cursor: pointer;
	transition: background 0.15s ease;
}
.fbr-btn:hover { background: #000; }
.fbr-joined { font-family: "VT323", monospace; font-size: 26px; color: #2f9e33; }
@keyframes fbr-on { to { opacity: 1; } }
@keyframes fbr-blink {
	0%, 49% { opacity: 1; }
	50%, 100% { opacity: 0; }
}
.fbr *:focus-visible { outline: 3px solid #2f9e33; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
	.fbr * { animation-duration: 0.01ms !important; animation-delay: 0s !important; }
}
`;
