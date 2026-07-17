// Timeline minimap per issue-29 (desktop ≥1280px): a fixed left-margin rail
// that doubles as a scrollbar. One evenly spaced node per section (hero
// included); states are continuous, never binary — intensity I ramps with
// the section's viewport overlap (ramp = 30% of viewport height, so several
// dots can be active at once), doneness D lerps a dot from live green to
// passed paper-soft as the section exits above. A 2px tick marks the exact
// scroll fraction, a fill runs to it, and the viewport bleed maps the
// screen 1:1 onto the rail. Click the rail to jump, drag to scrub, click a
// node to land at its section; node styling is written imperatively from
// one rAF-throttled scroll handler so scrolling never re-renders React.
import { useEffect, useRef } from "react";
import { ink } from "#/lib/console-tokens";

const SECTIONS = [
	{ id: "wp-hero", index: "00", label: "HQ" },
	{ id: "wp-deploy", index: "01", label: "DEPLOY" },
	{ id: "wp-hq", index: "02", label: "THE HQ" },
	{ id: "wp-operate", index: "03", label: "OPERATE" },
	{ id: "wp-founder", index: "04", label: "FOUNDER" },
	{ id: "wp-payoff", index: "05", label: "THE PAYOFF" },
	{ id: "wp-questions", index: "06", label: "QUESTIONS" },
	{ id: "wp-get-in", index: "07", label: "GET IN" },
];

const ACTIVE = ink.ledRgb.split(",").map(Number);
const PASSED = [
	Number.parseInt(ink.paperSoft.slice(1, 3), 16),
	Number.parseInt(ink.paperSoft.slice(3, 5), 16),
	Number.parseInt(ink.paperSoft.slice(5, 7), 16),
];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number[], b: number[], t: number) =>
	`rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

export function Minimap() {
	const rootRef = useRef<HTMLElement>(null);
	const railRef = useRef<HTMLDivElement>(null);
	const fillRef = useRef<HTMLDivElement>(null);
	const tickRef = useRef<HTMLDivElement>(null);
	const bleedRef = useRef<HTMLDivElement>(null);
	const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);

	useEffect(() => {
		const root = rootRef.current;
		const rail = railRef.current;
		if (!root || !rail) return;

		const wide = window.matchMedia("(min-width: 1280px)");
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
		let raf = 0;

		const update = () => {
			raf = 0;
			if (!wide.matches) return;
			const vh = window.innerHeight;
			const docH = document.documentElement.scrollHeight;
			const maxScroll = Math.max(1, docH - vh);
			const railH = rail.clientHeight;
			const ramp = vh * 0.3;

			const fraction = clamp01(window.scrollY / maxScroll);
			const tickY = fraction * railH;
			if (fillRef.current) fillRef.current.style.height = `${tickY}px`;
			if (tickRef.current)
				tickRef.current.style.transform = `translateY(${tickY}px)`;
			if (bleedRef.current) {
				const top = clamp01(window.scrollY / docH) * railH;
				const h = Math.max(24, (vh / docH) * railH);
				bleedRef.current.style.transform = `translateY(${top}px)`;
				bleedRef.current.style.height = `${h}px`;
			}

			SECTIONS.forEach((s, i) => {
				const node = nodeRefs.current[i];
				const el = document.getElementById(s.id);
				if (!node || !el) return;
				const r = el.getBoundingClientRect();
				// I: edge-ramp overlap — fades in entering, plateaus, fades out
				// leaving. D: 0→1 as the section's bottom exits above the viewport.
				const I = clamp01(Math.min((vh - r.top) / ramp, r.bottom / ramp));
				const D = clamp01(1 - r.bottom / ramp);
				const dot = node.querySelector<HTMLElement>(".lp-mm-dot");
				const label = node.querySelector<HTMLElement>(".lp-mm-label");
				if (dot) {
					const solid = Math.max(I, D);
					dot.style.background =
						solid > 0.02 ? lerp(ACTIVE, PASSED, D) : "transparent";
					dot.style.opacity = String(0.35 + 0.65 * solid);
					dot.style.boxShadow = `0 0 ${12 * I + 5 * D}px rgba(${ink.ledRgb}, ${0.7 * I})`;
					dot.style.transform = `scale(${1 + 0.35 * I})`;
				}
				if (label) label.style.opacity = String(I);
			});
		};
		const schedule = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};

		// Rail scrub: pointer travel ≤3px counts as a click (smooth jump to
		// that fraction); anything longer is a drag with instant scrubbing.
		let downY: number | null = null;
		let dragged = false;
		const railFraction = (clientY: number) => {
			const r = rail.getBoundingClientRect();
			return clamp01((clientY - r.top) / r.height);
		};
		const scrollToFraction = (f: number, smooth: boolean) => {
			const maxScroll =
				document.documentElement.scrollHeight - window.innerHeight;
			window.scrollTo({
				top: f * maxScroll,
				behavior: smooth && !reduced.matches ? "smooth" : "auto",
			});
		};
		const onPointerDown = (e: PointerEvent) => {
			downY = e.clientY;
			dragged = false;
			rail.setPointerCapture(e.pointerId);
		};
		const onPointerMove = (e: PointerEvent) => {
			if (downY === null) return;
			if (Math.abs(e.clientY - downY) > 3) dragged = true;
			if (dragged) scrollToFraction(railFraction(e.clientY), false);
		};
		const onPointerUp = (e: PointerEvent) => {
			if (downY === null) return;
			if (!dragged) scrollToFraction(railFraction(e.clientY), true);
			downY = null;
		};

		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		wide.addEventListener("change", schedule);
		rail.addEventListener("pointerdown", onPointerDown);
		rail.addEventListener("pointermove", onPointerMove);
		rail.addEventListener("pointerup", onPointerUp);
		update();
		return () => {
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
			wide.removeEventListener("change", schedule);
			rail.removeEventListener("pointerdown", onPointerDown);
			rail.removeEventListener("pointermove", onPointerMove);
			rail.removeEventListener("pointerup", onPointerUp);
			if (raf) cancelAnimationFrame(raf);
		};
	}, []);

	const jumpTo = (id: string) => {
		const el = document.getElementById(id);
		if (!el) return;
		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		window.scrollTo({
			top: el.getBoundingClientRect().top + window.scrollY - 40,
			behavior: reduced ? "auto" : "smooth",
		});
	};

	return (
		<nav ref={rootRef} className="lp-mm" aria-label="Page sections">
			<div ref={railRef} className="lp-mm-rail">
				<div ref={fillRef} className="lp-mm-fill" aria-hidden="true" />
				<div ref={bleedRef} className="lp-mm-bleed" aria-hidden="true" />
				<div ref={tickRef} className="lp-mm-tick" aria-hidden="true" />
				{SECTIONS.map((s, i) => (
					<button
						key={s.id}
						ref={(el) => {
							nodeRefs.current[i] = el;
						}}
						type="button"
						className="lp-mm-node"
						style={{ top: `${(i / (SECTIONS.length - 1)) * 100}%` }}
						aria-label={`Jump to section ${s.index} ${s.label}`}
						onClick={(e) => {
							// Node click wins over the rail's scrub handling.
							e.stopPropagation();
							jumpTo(s.id);
						}}
						onPointerDown={(e) => e.stopPropagation()}
						onPointerUp={(e) => e.stopPropagation()}
					>
						<span className="lp-mm-dot" aria-hidden="true" />
						<span className="lp-mm-index" aria-hidden="true">
							{s.index}
						</span>
						<span className="lp-mm-label" aria-hidden="true">
							{s.label}
						</span>
					</button>
				))}
			</div>
		</nav>
	);
}
