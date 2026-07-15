// PROTOTYPE — throwaway (wayfinder #30, CTA impact pass). Three treatments
// of the header button, hero waitlist CTA and final CTA, switchable via
// ?cta=a|b|c on the real page (dev builds only, floating switcher included):
//   a "Next step"   — CTAs adopt the demo's armed amber keycap grammar; the
//                     header goes sticky and its button arms once the hero
//                     form scrolls past.
//   b "Intake slot" — the form fuses into one etched glass instrument with a
//                     backlit panel key; final CTA sits in a full-bleed band.
//   c "Launch key"  — email slot full width, an oversized amber launch key
//                     with deep travel beneath it, guard etches around the
//                     final CTA.
// New etch strings here are directional placeholders and go through copy
// discipline (#14) before any build. Remove with cta-pass.css.
import { createContext, useContext, useEffect, useState } from "react";
import "#/components/prototype/cta-pass.css";

export type CtaVariant = "a" | "b" | "c";

const ORDER: (CtaVariant | null)[] = [null, "a", "b", "c"];
const NAMES: Record<CtaVariant, string> = {
	a: "Next step",
	b: "Intake slot",
	c: "Launch key",
};

const CtaPassContext = createContext<CtaVariant | null>(null);

export function CtaPassProvider({
	value,
	children,
}: {
	value: CtaVariant | null;
	children: React.ReactNode;
}) {
	return (
		<CtaPassContext.Provider value={value}>{children}</CtaPassContext.Provider>
	);
}

export const useCtaVariant = () => useContext(CtaPassContext);

/** Reads ?cta= on mount (dev only) and mirrors changes back into the URL. */
export function useCtaPass(): [
	CtaVariant | null,
	(v: CtaVariant | null) => void,
] {
	const [variant, setVariant] = useState<CtaVariant | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("cta");
		if (v === "a" || v === "b" || v === "c") setVariant(v);
	}, []);

	const update = (v: CtaVariant | null) => {
		setVariant(v);
		const q = new URLSearchParams(window.location.search);
		if (v === null) q.delete("cta");
		else q.set("cta", v);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [variant, update];
}

/** Variant A: true once the hero waitlist form has scrolled past the top. */
export function useCtaArmed(variant: CtaVariant | null): boolean {
	const [armed, setArmed] = useState(false);

	useEffect(() => {
		if (variant !== "a") {
			setArmed(false);
			return;
		}
		const el = document.getElementById("waitlist");
		if (!el) return;
		const io = new IntersectionObserver(([entry]) => {
			setArmed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
		});
		io.observe(el);
		return () => io.disconnect();
	}, [variant]);

	return armed;
}

/** Extra staging etches inside the final CTA section, per variant. */
export function CtaFinalStage({ slot }: { slot: "above" | "below" }) {
	const v = useCtaVariant();
	if (v === "a" && slot === "above") {
		return (
			<p className="ctap-status">
				<span className="ctap-status-led" />
				<span className="lp-etch">WAITLIST · OPEN</span>
			</p>
		);
	}
	if (v === "c" && slot === "below") {
		return (
			<p className="ctap-guard">
				<span className="ctap-guard-line" />
				<span className="lp-etch">ONE PRESS · ONE EMAIL · NOTHING ELSE</span>
				<span className="ctap-guard-line" />
			</p>
		);
	}
	return null;
}

/** Floating variant switcher: ← label →, arrow keys, dev only. */
export function CtaSwitcher({
	current,
	onChange,
}: {
	current: CtaVariant | null;
	onChange: (v: CtaVariant | null) => void;
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
			if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
			const i = ORDER.indexOf(current);
			const next =
				e.key === "ArrowRight"
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
		<div className="ctap-switcher">
			<button type="button" onClick={() => cycle(-1)} aria-label="Previous">
				←
			</button>
			<span>
				{current === null
					? "LIVE — current page"
					: `${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button type="button" onClick={() => cycle(1)} aria-label="Next">
				→
			</button>
		</div>
	);
}
