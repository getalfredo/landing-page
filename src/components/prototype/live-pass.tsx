// PROTOTYPE — throwaway (wayfinder #50, LIVE etch). One piece of genuinely
// live telemetry on the page, labeled LIVE in the etch vocabulary that
// elsewhere says SIMULATED FEED — the honesty rule flipped from disclaimer
// to proof. Data is real (src/routes/api/live.ts: host uptime + waitlist
// count), stub values only if the fetch fails. Switchable via ?live=a|b|c
// on the real page (dev builds only). The three variants disagree on all
// three ticket axes at once — signal, placement, and treatment weight:
//
//   a "Colophon line"  — footer. The LIVE line joins the nameplate's
//        hairline row under the microprint tagline: LED + one etched
//        sentence, uptime only. Quietest possible proof; the reader who
//        scrolls to the very end finds the receipt.
//   b "Refrain proof"  — crescendo. An etched proof line directly under
//        the payoff couplet, green LED inside the amber band: the refrain
//        claims "runs on your servers", the next line proves this page
//        does exactly that. Uptime + aboard count.
//   c "Live meter"     — a thin standalone console-glass instrument strip
//        between the final CTA and the footer: LIVE cap plus display-green
//        ticking readouts (uptime clock, aboard count, served-from). Full
//        instrument presence — tests whether the signal deserves a panel
//        or just an etch.
//
// Copy note: the etched strings here are placeholders pending #14 copy
// discipline at fold-in; interpunct staccato is legal in etches (#27).
// Remove with live-pass.css and src/routes/api/live.ts.
import { useEffect, useState } from "react";
import { Waypoint } from "#/components/landing/waypoint";
import "#/components/prototype/live-pass.css";

export type LiveVariant = "a" | "b" | "c";

const ORDER: (LiveVariant | null)[] = [null, "a", "b", "c"];
const NAMES: Record<LiveVariant, string> = {
	a: "Colophon line",
	b: "Refrain proof",
	c: "Live meter",
};

/* ---------------------- variant state ------------------------ */

/** Reads ?live= on mount (dev only) and mirrors changes back into the URL. */
export function useLivePass(): [
	LiveVariant | null,
	(v: LiveVariant | null) => void,
] {
	const [variant, setVariant] = useState<LiveVariant | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("live");
		if (v === "a" || v === "b" || v === "c") setVariant(v);
	}, []);

	const update = (v: LiveVariant | null) => {
		setVariant(v);
		const q = new URLSearchParams(window.location.search);
		if (v === null) q.delete("live");
		else q.set("live", v);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [variant, update];
}

/* ---------------------- live telemetry ----------------------- */

// Stub fallback (fetch failed / db unreachable) so the visual is still
// judgeable; plausible mid-life numbers, never shown as real elsewhere.
const STUB_UPTIME = 41 * 86400 + 7 * 3600 + 23 * 60 + 11;
const STUB_COUNT = 12;

function useLiveTelemetry(): { uptimeSeconds: number; waitlistCount: number } {
	const [base, setBase] = useState({
		uptimeSeconds: STUB_UPTIME,
		waitlistCount: STUB_COUNT,
	});
	const [tick, setTick] = useState(0);

	useEffect(() => {
		let alive = true;
		fetch("/api/live")
			.then((r) => (r.ok ? r.json() : null))
			.then((j) => {
				if (!alive || !j) return;
				setBase({
					uptimeSeconds: j.uptimeSeconds ?? STUB_UPTIME,
					waitlistCount: j.waitlistCount ?? STUB_COUNT,
				});
				setTick(0);
			})
			.catch(() => {});
		return () => {
			alive = false;
		};
	}, []);

	useEffect(() => {
		const id = setInterval(() => setTick((t) => t + 1), 1000);
		return () => clearInterval(id);
	}, []);

	return {
		uptimeSeconds: base.uptimeSeconds + tick,
		waitlistCount: base.waitlistCount,
	};
}

function fmtUptimeEtch(s: number): string {
	const d = Math.floor(s / 86400);
	if (d >= 1) return `UP ${d} ${d === 1 ? "DAY" : "DAYS"}`;
	const h = Math.floor(s / 3600);
	if (h >= 1) return `UP ${h} ${h === 1 ? "HOUR" : "HOURS"}`;
	return `UP ${Math.max(1, Math.floor(s / 60))} MIN`;
}

function fmtUptimeClock(s: number): string {
	const pad = (n: number) => String(n).padStart(2, "0");
	const d = Math.floor(s / 86400);
	const h = Math.floor((s % 86400) / 3600);
	const m = Math.floor((s % 3600) / 60);
	return `${d}D ${pad(h)}:${pad(m)}:${pad(s % 60)}`;
}

function LiveLed() {
	return <span className="lvp-led" aria-hidden="true" />;
}

/* ------------- variant a: footer colophon line --------------- */
// A prototype copy of the #32 nameplate footer with the LIVE line stacked
// under the microprint tagline. Replaces <Footer /> while active.

export function LiveFooter() {
	const t = useLiveTelemetry();
	return (
		<footer className="lp-nameplate">
			<p className="lp-nameplate-mark">
				Alfredo
				<span className="lp-nameplate-led" aria-hidden="true" />
			</p>
			<div className="lp-nameplate-row">
				<span className="lvp-colophon">
					<span className="lp-etch lp-microprint">
						THE HOME FOR YOUR PROJECTS · SELF-HOSTED, YOURS FOREVER
					</span>
					<span className="lvp-liveline">
						<LiveLed />
						<span className="lp-etch lvp-etch-live">
							LIVE · THIS PAGE SERVED FROM ONE VPS ·{" "}
							{fmtUptimeEtch(t.uptimeSeconds)}
						</span>
					</span>
				</span>
				<nav className="lp-nameplate-links" aria-label="Footer">
					<a className="lp-etch lp-etch-link" href="https://x.com/alperortac">
						X · @ALPERORTAC
					</a>
					<a
						className="lp-etch lp-etch-link"
						href="https://github.com/getalfredo"
					>
						GITHUB
					</a>
					<a className="lp-etch lp-etch-link" href="/privacy">
						PRIVACY
					</a>
				</nav>
			</div>
		</footer>
	);
}

/* ------------ variant b: crescendo refrain proof ------------- */
// A prototype copy of the #27/#29 crescendo with one proof line under the
// payoff couplet. Replaces <Crescendo /> while active.

export function LiveCrescendo() {
	const t = useLiveTelemetry();
	return (
		<section className="lp-section lp-band lp-band-amber" id="wp-payoff">
			<Waypoint index="05" label="THE PAYOFF" amber />
			<h2 className="lp-h2">
				Every project runs on your servers and reports to one HQ.
			</h2>
			<p className="lp-payoff">
				Every project you'll ever ship already has a home.
			</p>
			<p className="lvp-proof">
				<LiveLed />
				<span className="lp-etch lvp-etch-live">
					LIVE · THIS PAGE RUNS THE SAME WAY · ONE VPS ·{" "}
					{fmtUptimeEtch(t.uptimeSeconds)} · {t.waitlistCount} ABOARD
				</span>
			</p>
		</section>
	);
}

/* ------------- variant c: live meter strip ------------------- */
// A standalone thin instrument between the final CTA and the footer.

export function LiveMeterStrip() {
	const t = useLiveTelemetry();
	return (
		<aside className="lvp-meter" aria-label="Live page telemetry">
			<span className="lvp-meter-cap">
				<LiveLed />
				<span className="lp-etch lvp-etch-live">LIVE</span>
			</span>
			<span className="lvp-meter-cell">
				<span className="lp-etch lvp-meter-label">THIS PAGE · UPTIME</span>
				<span className="lvp-meter-value">
					{fmtUptimeClock(t.uptimeSeconds)}
				</span>
			</span>
			<span className="lvp-meter-cell">
				<span className="lp-etch lvp-meter-label">WAITLIST · ABOARD</span>
				<span className="lvp-meter-value">{t.waitlistCount}</span>
			</span>
			<span className="lvp-meter-cell">
				<span className="lp-etch lvp-meter-label">SERVED FROM</span>
				<span className="lvp-meter-value lvp-meter-word">ONE VPS</span>
			</span>
		</aside>
	);
}

/* ---------------------- switcher bar ------------------------- */

export function LiveSwitcher({
	current,
	onChange,
}: {
	current: LiveVariant | null;
	onChange: (v: LiveVariant | null) => void;
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
		<div className="lvp-switcher">
			<button
				type="button"
				onClick={() => cycle(-1)}
				aria-label="Previous live-etch variant"
			>
				←
			</button>
			<span>
				{current === null
					? "LIVE ETCH: OFF — [ ] to flip"
					: `LIVE ${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button
				type="button"
				onClick={() => cycle(1)}
				aria-label="Next live-etch variant"
			>
				→
			</button>
		</div>
	);
}
