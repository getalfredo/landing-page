// PROTOTYPE — throwaway (wayfinder #52, keyboard-coupled keycaps). Three
// press choreographies for the waitlist submit keycap when the visitor
// presses Enter in the email input, switchable via ?keys=a|b|c on the real
// page (dev builds only). No page component changes: the coupler drives the
// real .wf-key / .lp-btn-next buttons through a kp-down class and
// form.requestSubmit(), so both waitlist forms (hero + final CTA) and the
// hero demo respond. The variants disagree on WHEN the action fires
// relative to the press:
//
//   a "Tap"        — action fires instantly on keydown; the cap plays a
//        quick cosmetic 110ms down/up in parallel. Zero added latency.
//   b "Bottom-out" — the cap goes down on keydown and the action fires as
//        it bottoms out (~90ms in); the cap stays down at least 160ms so
//        the stroke reads. The press CAUSES the submit.
//   c "Hold"       — the cap mirrors the physical key: down while Enter is
//        held, action fires on release. Most literal, but a held Enter
//        delays the visitor's own submit.
//
// Demo coupling (the ticket's optional half) is a separate toggle in the
// switcher (DEMO ⏎ ON/OFF, default ON): pressing Enter with nothing else
// focused — or with focus inside the demo — presses the demo's single hot
// key with the same choreography. Enter on links/inputs is never hijacked.
//
// Double-fire guard: key repeats (e.repeat) and keydowns while a press is
// in flight are ignored; the form's own submitting-phase guard backstops
// the network layer. Reduced motion skips the visuals and just fires.
// Remove with keys-pass.css.
import { useEffect, useState } from "react";
import "#/components/prototype/keys-pass.css";

export type KeysVariant = "a" | "b" | "c";

const ORDER: (KeysVariant | null)[] = [null, "a", "b", "c"];
const NAMES: Record<KeysVariant, string> = {
	a: "Tap",
	b: "Bottom-out",
	c: "Hold",
};

// Choreography timings — the numbers under evaluation.
const TAP_DOWN_MS = 110; // a: cosmetic press length
const BOTTOM_MS = 90; // b: keydown → bottom-out, when the action fires
const MIN_DOWN_MS = 160; // b: minimum visible press so the stroke reads

/* ---------------------- variant state ------------------------ */

/** Reads ?keys= / ?keysdemo= on mount (dev only), mirrors changes back. */
export function useKeysPass(): {
	variant: KeysVariant | null;
	setVariant: (v: KeysVariant | null) => void;
	demo: boolean;
	setDemo: (b: boolean) => void;
} {
	const [variant, setVariantState] = useState<KeysVariant | null>(null);
	const [demo, setDemoState] = useState(true);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("keys");
		if (v === "a" || v === "b" || v === "c") setVariantState(v);
		if (q.get("keysdemo") === "0") setDemoState(false);
	}, []);

	const mirror = (mut: (q: URLSearchParams) => void) => {
		const q = new URLSearchParams(window.location.search);
		mut(q);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return {
		variant,
		setVariant: (v) => {
			setVariantState(v);
			mirror((q) => {
				if (v === null) q.delete("keys");
				else q.set("keys", v);
			});
		},
		demo,
		setDemo: (b) => {
			setDemoState(b);
			mirror((q) => {
				if (b) q.delete("keysdemo");
				else q.set("keysdemo", "0");
			});
		},
	};
}

/* ---------------------- the coupler -------------------------- */

// One press may be in flight per button; keydowns during it are swallowed.
const inFlight = new WeakSet<HTMLButtonElement>();

function down(btn: HTMLButtonElement) {
	btn.classList.add("kp-down");
}
function up(btn: HTMLButtonElement) {
	btn.classList.remove("kp-down");
}

/** Invisible while mounted: installs the Enter → keycap listeners. */
export function KeysCoupler({
	variant,
	demo,
}: {
	variant: KeysVariant | null;
	demo: boolean;
}) {
	useEffect(() => {
		if (import.meta.env.PROD || variant === null) return;
		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		// c/b bookkeeping: what the pending keyup should do.
		let held: {
			btn: HTMLButtonElement;
			onRelease: () => void;
			minUpAt: number; // earliest timestamp the visual may release (b)
		} | null = null;
		const timers: number[] = [];
		const t = (fn: () => void, ms: number) => {
			timers.push(window.setTimeout(fn, ms));
		};

		// Runs the variant's choreography around `fire` on `btn`.
		const play = (btn: HTMLButtonElement, fire: () => void) => {
			if (inFlight.has(btn)) return;
			if (reduced) {
				// No theater: a/b fire now, c fires on release like the rest.
				if (variant === "c") held = { btn, onRelease: fire, minUpAt: 0 };
				else fire();
				return;
			}
			inFlight.add(btn);
			down(btn);
			if (variant === "a") {
				fire();
				t(() => {
					up(btn);
					inFlight.delete(btn);
				}, TAP_DOWN_MS);
			} else if (variant === "b") {
				t(fire, BOTTOM_MS);
				held = {
					btn,
					onRelease: () => {},
					minUpAt: performance.now() + MIN_DOWN_MS,
				};
			} else {
				held = { btn, onRelease: fire, minUpAt: performance.now() };
			}
		};

		const release = () => {
			if (!held) return;
			const { btn, onRelease, minUpAt } = held;
			held = null;
			const finish = () => {
				up(btn);
				inFlight.delete(btn);
			};
			const wait = minUpAt - performance.now();
			if (wait > 0) t(finish, wait);
			else finish();
			onRelease();
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "Enter" || e.repeat) return;
			const el = e.target as HTMLElement | null;

			// Waitlist coupling: Enter inside either form's email input.
			const form = el?.closest("form.wf") as HTMLFormElement | null;
			if (form && el?.tagName === "INPUT") {
				const btn = form.querySelector<HTMLButtonElement>(".wf-key");
				if (!btn || btn.disabled) return;
				e.preventDefault(); // the choreography owns the submit
				play(btn, () => form.requestSubmit(btn));
				return;
			}

			// Demo coupling: Enter with nothing focused (body) or focus inside
			// the demo bezel presses the single hot key — never Enter on links,
			// other buttons, or inputs elsewhere on the page.
			if (!demo) return;
			const inDemo = el?.closest(".wcn-bezel") != null;
			const bare = el == null || el === document.body;
			if (!inDemo && !bare) return;
			const hot = document.querySelector<HTMLButtonElement>(".lp-btn-next");
			if (!hot || hot.disabled) return;
			// Only when the demo is actually on screen.
			const r = hot.getBoundingClientRect();
			if (r.bottom < 0 || r.top > window.innerHeight) return;
			e.preventDefault(); // swallow native Enter-click if hot has focus
			play(hot, () => hot.click());
		};

		const onKeyUp = (e: KeyboardEvent) => {
			if (e.key === "Enter") release();
		};
		// Tab-away mid-hold: drop the press without firing (c) / just tidy (b).
		const onBlur = () => {
			if (!held) return;
			const { btn } = held;
			held = null;
			up(btn);
			inFlight.delete(btn);
		};

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		window.addEventListener("blur", onBlur);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("blur", onBlur);
			for (const id of timers) clearTimeout(id);
			for (const btn of document.querySelectorAll<HTMLButtonElement>(
				".kp-down",
			)) {
				up(btn);
				inFlight.delete(btn);
			}
		};
	}, [variant, demo]);

	return null;
}

/* ---------------------- switcher bar ------------------------- */

export function KeysSwitcher({
	current,
	onChange,
	demo,
	onDemoChange,
}: {
	current: KeysVariant | null;
	onChange: (v: KeysVariant | null) => void;
	demo: boolean;
	onDemoChange: (b: boolean) => void;
}) {
	useEffect(() => {
		if (import.meta.env.PROD) return;
		const onKey = (e: KeyboardEvent) => {
			const t = e.target as HTMLElement | null;
			if (
				t &&
				(t.tagName === "INPUT" ||
					t.tagName === "TEXTAREA" ||
					t.isContentEditable)
			)
				return;
			if (e.key !== "[" && e.key !== "]") return;
			const i = ORDER.indexOf(current);
			const next =
				e.key === "]"
					? ORDER[(i + 1) % ORDER.length]
					: ORDER[(i - 1 + ORDER.length) % ORDER.length];
			onChange(next);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [current, onChange]);

	if (import.meta.env.PROD) return null;

	const cycle = (dir: 1 | -1) => {
		const i = ORDER.indexOf(current);
		onChange(ORDER[(i + dir + ORDER.length) % ORDER.length]);
	};

	return (
		<div className="kp-switcher">
			<button
				type="button"
				onClick={() => cycle(-1)}
				aria-label="Previous keycap-coupling variant"
			>
				←
			</button>
			<span>
				{current === null
					? "KEYS: OFF — [ ] to flip"
					: `KEYS ${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button
				type="button"
				onClick={() => cycle(1)}
				aria-label="Next keycap-coupling variant"
			>
				→
			</button>
			<button
				type="button"
				className={`kp-demo${demo ? " kp-demo-on" : ""}`}
				onClick={() => onDemoChange(!demo)}
				aria-pressed={demo}
			>
				DEMO ⏎ {demo ? "ON" : "OFF"}
			</button>
		</div>
	);
}
