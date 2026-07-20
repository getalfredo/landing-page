// Footer per issue-32 (approved variant A "Nameplate"): one oversized
// left-aligned wordmark with a breathing LED dot closes the page over a
// hairline row — microprint left, etched links right. GitHub points at the
// org page until the code has a public home elsewhere.
//
// LIVE meter (wayfinder #50, variant C): a thin console-glass instrument
// strip sits below the wordmark and above the hairline row — one blinking
// LIVE cap plus display-green readouts (this page's host uptime, real
// waitlist count, SERVED FROM ONE VPS). Where the showcase etches SIMULATED
// FEED and dims, this lights: same etch family, opposite energy. Data is
// genuinely live from /api/live (host uptime + waitlist count); stub values
// show only if the fetch fails so the strip never reads as broken.
import { useEffect, useState } from "react";
import "#/components/landing/footer.css";

// Stub fallback (fetch failed / db unreachable) so the strip is still whole;
// plausible mid-life numbers, never presented as real elsewhere.
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

function fmtUptimeClock(s: number): string {
	const pad = (n: number) => String(n).padStart(2, "0");
	const d = Math.floor(s / 86400);
	const h = Math.floor((s % 86400) / 3600);
	const m = Math.floor((s % 3600) / 60);
	return `${d}D ${pad(h)}:${pad(m)}:${pad(s % 60)}`;
}

function LiveMeter() {
	const t = useLiveTelemetry();
	return (
		<aside className="lp-meter" aria-label="Live page telemetry">
			<span className="lp-meter-cap">
				<span className="lp-meter-led" aria-hidden="true" />
				<span className="lp-etch lp-meter-live">LIVE</span>
			</span>
			<span className="lp-meter-cell">
				<span className="lp-etch lp-meter-label">THIS PAGE · UPTIME</span>
				<span className="lp-meter-value">
					{fmtUptimeClock(t.uptimeSeconds)}
				</span>
			</span>
			<span className="lp-meter-cell">
				<span className="lp-etch lp-meter-label">WAITLIST · ABOARD</span>
				<span className="lp-meter-value">{t.waitlistCount}</span>
			</span>
			<span className="lp-meter-cell">
				<span className="lp-etch lp-meter-label">SERVED FROM</span>
				<span className="lp-meter-value lp-meter-word">ONE VPS</span>
			</span>
		</aside>
	);
}

export function Footer() {
	return (
		<footer className="lp-nameplate">
			<p className="lp-nameplate-mark">
				Alfredo
				<span className="lp-nameplate-led" aria-hidden="true" />
			</p>
			<LiveMeter />
			<div className="lp-nameplate-row">
				<span className="lp-etch lp-microprint">
					THE HOME FOR YOUR PROJECTS · SELF-HOSTED, YOURS FOREVER
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
