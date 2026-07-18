// PROTOTYPE — throwaway (wayfinder #55, chrome-dimming pass). Linear's
// refresh principle ("structure should be felt, not seen") applied as a
// refinement lens over the existing console tokens: bezel chrome, panel
// fills, hairline seams, off LEDs and the etch family all step down so
// phosphor green and amber are the only things that ever compete for the
// eye. No new elements — the same page, dimmer chrome. Switchable via
// ?dim=a|b on the real page (dev builds only); param absent = the current
// page, the side-by-side control the ticket asks for.
//
//   a "One step"  — the ticket's ask: seams 0.1 → 0.065 alpha, etch ink
//        #97927f → #7c7868, panels ~40% toward the bg, off-LEDs down a
//        step. Readable copy (hero sub, bodies, FAQ answers, consent
//        lines, showcase captions) is pinned at the original value.
//   b "Two steps" — deliberate overshoot to calibrate a: seams 0.045,
//        etch ink #646054, panels ~70% toward the bg. Same prose pins.
//
// Green, amber, paper-white headings, bone/amber keycaps and the red
// incident accent are untouched in both. Remove with dim-pass.css.
import { useEffect, useState } from "react";
import "#/components/prototype/dim-pass.css";

export type DimVariant = "a" | "b";

const ORDER: (DimVariant | null)[] = [null, "a", "b"];
const NAMES: Record<DimVariant, string> = {
	a: "One step",
	b: "Two steps",
};

/** Class list for the landing root: base + shared prose-pin + strength. */
export function dimRootClass(variant: DimVariant | null): string {
	return variant === null ? "lp" : `lp dimx dimx-${variant}`;
}

/** Reads ?dim= on mount (dev only) and mirrors changes back into the URL. */
export function useDimPass(): [
	DimVariant | null,
	(v: DimVariant | null) => void,
] {
	const [variant, setVariant] = useState<DimVariant | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("dim");
		if (v === "a" || v === "b") setVariant(v);
	}, []);

	const update = (v: DimVariant | null) => {
		setVariant(v);
		const q = new URLSearchParams(window.location.search);
		if (v === null) q.delete("dim");
		else q.set("dim", v);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [variant, update];
}

/* ---------------------- switcher bar ------------------------- */

export function DimSwitcher({
	current,
	onChange,
}: {
	current: DimVariant | null;
	onChange: (v: DimVariant | null) => void;
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
		<div className="dimx-switcher">
			<button
				type="button"
				onClick={() => cycle(-1)}
				aria-label="Previous dim variant"
			>
				←
			</button>
			<span>
				{current === null
					? "DIM: OFF (CURRENT PAGE) — [ ] to flip"
					: `DIM ${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button
				type="button"
				onClick={() => cycle(1)}
				aria-label="Next dim variant"
			>
				→
			</button>
		</div>
	);
}
