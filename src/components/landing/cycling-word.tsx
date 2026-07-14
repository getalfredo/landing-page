// H1 cycling product word, promoted from the #16 prototype with the winner
// folded in: split-flap flip, looping. Word list locked in #14: website →
// app → project → SaaS; starts and rests on SaaS. Screen readers get a
// static "SaaS"; prefers-reduced-motion renders static "SaaS", no timers.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "#/components/landing/use-prefers-reduced-motion";

const WORDS = ["website", "app", "project", "SaaS"];
const FINAL = WORDS.length - 1;
const HOLD = 2400;
const HOLD_FINAL = 5600;
const LETTER_STAGGER = 45;

export function CyclingWord() {
	const reduced = usePrefersReducedMotion();
	const boxRef = useRef<HTMLSpanElement>(null);
	const rulerRef = useRef<HTMLSpanElement>(null);

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
		if (reduced) return;
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
				setPh({ idx, phase: "out" });
				await wait(200 + WORDS[idx].length * LETTER_STAGGER);
				if (stop) return;
				idx = next;
				setPh({ idx, phase: "in" });
				await wait(280 + WORDS[next].length * LETTER_STAGGER);
				if (stop) return;
				setPh({ idx, phase: "hold" });
				await wait(idx === FINAL ? HOLD_FINAL : HOLD);
			}
		})();
		return () => {
			stop = true;
			clearTimeout(t);
		};
	}, [reduced]);

	const word = reduced ? "SaaS" : WORDS[ph.idx];

	// the box hugs the current text; width animates so the sentence
	// around it glides instead of jumping
	useLayoutEffect(() => {
		const box = boxRef.current;
		const ruler = rulerRef.current;
		if (!box || !ruler) return;
		box.style.width = `${ruler.offsetWidth}px`;
	});

	return (
		<span className="h1c">
			<span className="h1c-sr">SaaS</span>
			<span className="h1c-ruler" ref={rulerRef} aria-hidden="true">
				{word}
			</span>
			<span className="h1c-box" ref={boxRef} aria-hidden="true">
				{reduced
					? "SaaS"
					: word.split("").map((c, i) => (
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
						))}
			</span>
		</span>
	);
}
