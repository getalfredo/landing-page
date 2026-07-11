// PROTOTYPE — H1 cycling product word (wayfinder #16, throwaway).
// The locked H1 word cycles website → app → project → SaaS (list and
// casing locked in copy polish #14; reduced-motion fallback is static
// "SaaS"). This file demos the swap MECHANISM on variant N: type-over
// caret / phosphor flicker / split-flap flip, plus loop-vs-settle run
// mode. Switch via `?h1=` and `?h1run=` — picker pill bottom-left.
// DECIDED (#16): split-flap flip, looping — now the default; the other
// modes stay here as reference until the page build folds the winner in.
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const H1_MODES = {
	type: "Type-over caret",
	flicker: "Phosphor flicker",
	flip: "Split-flap",
	static: "Static (reduced-motion fallback)",
} as const;
export type H1Mode = keyof typeof H1_MODES;
export type H1Run = "loop" | "settle";

const WORDS = ["website", "app", "project", "SaaS"];
const FINAL = WORDS.length - 1;
const HOLD = 2400;
const HOLD_FINAL = 5600;
const DEL_MS = 45;
const TYPE_MS = 70;
const RETYPE_PAUSE = 320;
const LETTER_STAGGER = 45;

function usePrefersReduced() {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mq.matches);
		const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);
	return reduced;
}

export function CyclingWord({ mode, run }: { mode: H1Mode; run: H1Run }) {
	const reduced = usePrefersReduced();
	const boxRef = useRef<HTMLSpanElement>(null);
	const rulerRef = useRef<HTMLSpanElement>(null);

	// type-over state
	const [typed, setTyped] = useState(WORDS[FINAL]);
	const [typeDone, setTypeDone] = useState(false);
	// flicker/flip state
	const [ph, setPh] = useState<{ idx: number; phase: "hold" | "out" | "in" }>({
		idx: FINAL,
		phase: "hold",
	});

	// re-measure once webfonts arrive
	const [, setFontTick] = useState(0);
	useEffect(() => {
		document.fonts?.ready.then(() => setFontTick(1));
	}, []);

	useEffect(() => {
		if (mode !== "type" || reduced) return;
		let stop = false;
		let t: ReturnType<typeof setTimeout>;
		const wait = (ms: number) =>
			new Promise<void>((r) => {
				t = setTimeout(r, ms);
			});
		(async () => {
			let idx = FINAL;
			await wait(HOLD);
			while (!stop) {
				const next = (idx + 1) % WORDS.length;
				const cur = WORDS[idx];
				for (let i = cur.length - 1; i >= 0 && !stop; i--) {
					setTyped(cur.slice(0, i));
					await wait(DEL_MS);
				}
				if (stop) return;
				await wait(RETYPE_PAUSE);
				const nw = WORDS[next];
				for (let i = 1; i <= nw.length && !stop; i++) {
					setTyped(nw.slice(0, i));
					await wait(TYPE_MS);
				}
				if (stop) return;
				idx = next;
				if (idx === FINAL) {
					if (run === "settle") {
						setTypeDone(true);
						return;
					}
					await wait(HOLD_FINAL);
				} else {
					await wait(HOLD);
				}
			}
		})();
		return () => {
			stop = true;
			clearTimeout(t);
		};
	}, [mode, run, reduced]);

	useEffect(() => {
		if (!(mode === "flicker" || mode === "flip") || reduced) return;
		let stop = false;
		let t: ReturnType<typeof setTimeout>;
		const wait = (ms: number) =>
			new Promise<void>((r) => {
				t = setTimeout(r, ms);
			});
		(async () => {
			let idx = FINAL;
			await wait(HOLD);
			while (!stop) {
				const next = (idx + 1) % WORDS.length;
				const outMs =
					mode === "flip" ? 200 + WORDS[idx].length * LETTER_STAGGER : 200;
				const inMs =
					mode === "flip" ? 280 + WORDS[next].length * LETTER_STAGGER : 340;
				setPh({ idx, phase: "out" });
				await wait(outMs);
				if (stop) return;
				idx = next;
				setPh({ idx, phase: "in" });
				await wait(inMs);
				if (stop) return;
				setPh({ idx, phase: "hold" });
				if (idx === FINAL) {
					if (run === "settle") return;
					await wait(HOLD_FINAL);
				} else {
					await wait(HOLD);
				}
			}
		})();
		return () => {
			stop = true;
			clearTimeout(t);
		};
	}, [mode, run, reduced]);

	const isStatic = mode === "static" || reduced;
	const word = isStatic ? "SaaS" : mode === "type" ? typed : WORDS[ph.idx];
	const showCaret = mode === "type" && !typeDone && !isStatic;

	// the box hugs the current text; width animates so the sentence
	// around it glides instead of jumping
	useLayoutEffect(() => {
		const box = boxRef.current;
		const ruler = rulerRef.current;
		if (!box || !ruler) return;
		const w = ruler.offsetWidth;
		box.style.width = showCaret ? `calc(${w}px + 0.62ch)` : `${w}px`;
	});

	return (
		<span className="h1c">
			<style>{stylesH1C}</style>
			<span className="h1c-sr">SaaS</span>
			<span className="h1c-ruler" ref={rulerRef} aria-hidden="true">
				{word}
			</span>
			<span className="h1c-box" ref={boxRef} aria-hidden="true">
				{isStatic ? (
					"SaaS"
				) : mode === "flip" ? (
					word.split("").map((c, i) => (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: letters re-key per swap on purpose
							key={`${ph.idx}-${ph.phase}-${i}`}
							className={`h1c-letter${ph.phase !== "hold" ? ` h1c-flip-${ph.phase}` : ""}`}
							style={
								ph.phase !== "hold"
									? { animationDelay: `${i * LETTER_STAGGER}ms` }
									: undefined
							}
						>
							{c}
						</span>
					))
				) : mode === "flicker" ? (
					<span
						key={`${ph.idx}-${ph.phase}`}
						className={
							ph.phase !== "hold" ? `h1c-flick-${ph.phase}` : undefined
						}
					>
						{word}
					</span>
				) : (
					word
				)}
				{showCaret && <span className="h1c-caret" />}
			</span>
		</span>
	);
}

export function H1CyclePicker({ mode, run }: { mode: H1Mode; run: H1Run }) {
	const navigate = useNavigate();

	if (import.meta.env.PROD) return null;

	const set = (patch: { h1?: H1Mode; h1run?: H1Run }) =>
		navigate({
			to: "/",
			search: (prev) => ({
				variant: prev.variant ?? "n",
				h1: patch.h1 ?? prev.h1 ?? "flip",
				h1run: patch.h1run ?? prev.h1run ?? "loop",
				fill: prev.fill ?? "attract",
			}),
			replace: true,
		});

	return (
		<div style={pickerStyle}>
			<span style={{ opacity: 0.55, marginRight: 2 }}>H1</span>
			{(Object.keys(H1_MODES) as H1Mode[]).map((m) => (
				<button
					type="button"
					key={m}
					onClick={() => set({ h1: m })}
					style={pickerBtn(m === mode)}
					title={H1_MODES[m]}
				>
					{m}
				</button>
			))}
			<span style={{ opacity: 0.3 }}>|</span>
			{(["loop", "settle"] as H1Run[]).map((r) => (
				<button
					type="button"
					key={r}
					onClick={() => set({ h1run: r })}
					style={pickerBtn(r === run)}
				>
					{r}
				</button>
			))}
		</div>
	);
}

const pickerStyle: React.CSSProperties = {
	position: "fixed",
	bottom: 16,
	left: 16,
	zIndex: 9999,
	display: "flex",
	alignItems: "center",
	gap: 6,
	background: "#111",
	color: "#fff",
	borderRadius: 999,
	padding: "8px 12px",
	boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
	fontFamily: "ui-monospace, monospace",
	fontSize: 12,
};

const pickerBtn = (active: boolean): React.CSSProperties => ({
	background: active ? "#ffd23c" : "#333",
	color: active ? "#111" : "#fff",
	border: "none",
	borderRadius: 999,
	padding: "4px 10px",
	cursor: "pointer",
	fontFamily: "inherit",
	fontSize: 12,
});

const stylesH1C = `
.h1c { position: relative; }
.h1c-sr {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip-path: inset(50%);
	white-space: nowrap;
}
.h1c-ruler {
	position: absolute;
	visibility: hidden;
	white-space: pre;
	pointer-events: none;
}
.h1c-box {
	display: inline-block;
	white-space: pre;
	text-align: left;
	vertical-align: baseline;
	transition: width 140ms ease;
}
.h1c-caret {
	display: inline-block;
	width: 0.45ch;
	height: 0.78em;
	margin-left: 0.05em;
	vertical-align: baseline;
	transform: translateY(0.06em);
	background: #58e85c;
	box-shadow: 0 0 14px rgba(88, 232, 92, 0.6);
	animation: h1c-blink 1s steps(1) infinite;
}
.h1c-letter {
	display: inline-block;
	backface-visibility: hidden;
}
.h1c-flip-out {
	animation: h1c-flip-out 0.2s ease-in both;
}
.h1c-flip-in {
	animation: h1c-flip-in 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.15) both;
}
.h1c-flick-out {
	display: inline-block;
	animation: h1c-flick-out 0.2s steps(3, jump-none) both;
}
.h1c-flick-in {
	display: inline-block;
	animation: h1c-flick-in 0.34s linear both;
}
@keyframes h1c-blink {
	0%, 49% { opacity: 1; }
	50%, 100% { opacity: 0; }
}
@keyframes h1c-flip-out {
	from { transform: perspective(700px) rotateX(0deg); opacity: 1; }
	to { transform: perspective(700px) rotateX(88deg); opacity: 0; }
}
@keyframes h1c-flip-in {
	from { transform: perspective(700px) rotateX(-88deg); opacity: 0; }
	to { transform: perspective(700px) rotateX(0deg); opacity: 1; }
}
@keyframes h1c-flick-out {
	0% { opacity: 1; }
	30% { opacity: 0.15; }
	55% { opacity: 0.8; filter: blur(1px); }
	100% { opacity: 0; filter: blur(3px); }
}
@keyframes h1c-flick-in {
	0% { opacity: 0; filter: blur(4px); text-shadow: 0 0 22px rgba(88, 232, 92, 0.9); }
	25% { opacity: 0.9; text-shadow: 0 0 14px rgba(88, 232, 92, 0.55); }
	40% { opacity: 0.2; }
	60% { opacity: 1; text-shadow: 0 0 8px rgba(88, 232, 92, 0.3); }
	75% { opacity: 0.55; }
	100% { opacity: 1; filter: none; text-shadow: none; }
}
@media (prefers-reduced-motion: reduce) {
	.h1c-caret, .h1c-letter, .h1c-flick-out, .h1c-flick-in {
		animation: none !important;
	}
	.h1c-box { transition: none !important; }
}
`;
