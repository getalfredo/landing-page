// Keycap coupling (wayfinder #52, variant c "Hold"): the waitlist submit
// keycap mirrors the physical Enter key. While Enter is held inside either
// waitlist form's email input the cap depresses, and the submit fires on
// release — the way a real key bottoms out and actuates on the way up. Both
// waitlist forms (hero + final CTA) share the .wf-key button, so a single
// window listener covers both.
//
// The hero demo's Deploy key is deliberately NOT coupled: it became
// simulated theater in the v2 hero fold-in (#71), so there is no real hot
// key to press — the ticket's optional demo half has no target anymore.
//
// Guards: key repeats and keydowns while a press is in flight are swallowed;
// tabbing or blurring away mid-hold drops the press without firing; the
// form's own submitting-phase guard backstops the network layer. Reduced
// motion skips the visual and just fires on release. Renders nothing.
import { useEffect } from "react";

// One press in flight per button; keydowns during it are swallowed.
const inFlight = new WeakSet<HTMLButtonElement>();

export function KeycapCoupling() {
	useEffect(() => {
		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		// The held cap and what its release should fire.
		let held: { btn: HTMLButtonElement; fire: () => void } | null = null;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "Enter" || e.repeat) return;
			const el = e.target as HTMLElement | null;
			// Only Enter inside a waitlist form's email input; never hijack Enter
			// on links, other buttons, or inputs elsewhere on the page.
			const form = el?.closest("form.wf") as HTMLFormElement | null;
			if (!form || el?.tagName !== "INPUT") return;
			const btn = form.querySelector<HTMLButtonElement>(".wf-key");
			if (!btn || btn.disabled || inFlight.has(btn)) return;
			e.preventDefault(); // the keycap owns the submit; fires on release
			inFlight.add(btn);
			if (!reduced) btn.classList.add("kp-down");
			held = { btn, fire: () => form.requestSubmit(btn) };
		};

		const release = () => {
			if (!held) return;
			const { btn, fire } = held;
			held = null;
			btn.classList.remove("kp-down");
			inFlight.delete(btn);
			fire();
		};

		const onKeyUp = (e: KeyboardEvent) => {
			if (e.key === "Enter") release();
		};
		// Tab-away mid-hold: drop the press without firing.
		const onBlur = () => {
			if (!held) return;
			held.btn.classList.remove("kp-down");
			inFlight.delete(held.btn);
			held = null;
		};

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		window.addEventListener("blur", onBlur);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("blur", onBlur);
			for (const btn of document.querySelectorAll<HTMLButtonElement>(
				".kp-down",
			)) {
				btn.classList.remove("kp-down");
				inFlight.delete(btn);
			}
		};
	}, []);

	return null;
}
