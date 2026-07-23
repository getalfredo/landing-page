// Day one (issue-27, formerly Act 1): setup tax → wired-once payoff (copy
// verbatim from issue-14), anchored by the WiringPatchBay loop (issue-15/18).
//
// Setup-tax ledger strip (wayfinder #54, variant c "Flip strip"): between the
// pain paragraph and the payoff, a two-cap toggle re-lights five slots and a
// SETUPS DUE counter (5 → 0), auto-switching every 3s with a progress bar.
// The five slots mirror the hero deploy checklist (Auth/Email/Database/
// Analytics/Payments); at this fold-in the pain paragraph's Secrets sentence
// was swapped for Payments so the prose five match the strip five (#14
// amendment). No SIMULATED etch — this is a diagram, not a product-looking
// screenshot (honesty rule scoped per #15).
import { useEffect, useState } from "react";
import { LoopAnchor } from "#/components/landing/loop-anchor";
import { usePrefersReducedMotion } from "#/components/landing/use-prefers-reduced-motion";
import { Waypoint } from "#/components/landing/waypoint";
import "#/components/landing/day-one.css";

// Mirrors the hero deploy checklist (hero-demo.tsx ALL_SERVICES).
const ROWS = ["AUTH", "EMAIL", "DATABASE", "ANALYTICS", "PAYMENTS"];

const FLIP_MS = 3000;

function SetupTaxStrip() {
	const reduced = usePrefersReducedMotion();
	// Reduced motion starts (and stays, absent clicks) on the payoff state.
	const [wired, setWired] = useState(false);
	// Counts every flip (auto or manual): keys the progress bar so its fill
	// animation restarts in sync with each switch.
	const [cycle, setCycle] = useState(0);
	// Bumped on manual picks so the interval restarts from that moment.
	const [resetKey, setResetKey] = useState(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies(resetKey): resetKey restarts the interval so a manual pick gets a full cycle before the next auto-switch.
	useEffect(() => {
		if (reduced) {
			setWired(true);
			return;
		}
		const id = setInterval(() => {
			setWired((w) => !w);
			setCycle((c) => c + 1);
		}, FLIP_MS);
		return () => clearInterval(id);
	}, [reduced, resetKey]);

	const pick = (w: boolean) => {
		setWired(w);
		setCycle((c) => c + 1);
		setResetKey((k) => k + 1);
	};

	return (
		<div className="ldg-flip">
			<div className="ldg-flip-head">
				<fieldset
					className="ldg-flip-toggle"
					aria-label="Setup cost, before and after Alfredo"
				>
					<button
						type="button"
						className="lp-etch ldg-flip-cap"
						aria-pressed={!wired}
						onClick={() => pick(false)}
					>
						EVERY NEW PROJECT
					</button>
					<button
						type="button"
						className="lp-etch ldg-flip-cap"
						aria-pressed={wired}
						onClick={() => pick(true)}
					>
						WITH ALFREDO
					</button>
				</fieldset>
				{!reduced && (
					<span className="ldg-flip-progress" aria-hidden="true">
						<span
							key={cycle}
							className="ldg-flip-progress-fill"
							style={{ animationDuration: `${FLIP_MS}ms` }}
						/>
					</span>
				)}
			</div>
			<div className="ldg-flip-row">
				<ul className="ldg-flip-slots">
					{ROWS.map((r) => (
						<li
							key={r}
							className={`ldg-flip-slot${wired ? " ldg-flip-slot-wired" : ""}`}
						>
							<span
								className={`ldg-flip-dot${wired ? " ldg-flip-dot-on" : ""}`}
								aria-hidden="true"
							/>
							<span className="lp-etch ldg-flip-name">{r}</span>
							<span
								className={`lp-etch ${wired ? "ldg-etch-green" : "ldg-again"}`}
							>
								{wired ? "WIRED" : "AGAIN"}
							</span>
						</li>
					))}
				</ul>
				<div className="ldg-flip-counter">
					<span className="lp-etch ldg-flip-counter-label">SETUPS DUE</span>
					<span
						className={`ldg-flip-counter-value${wired ? " ldg-flip-counter-zero" : ""}`}
					>
						{wired ? "0" : "5"}
					</span>
				</div>
			</div>
		</div>
	);
}

export function DayOne() {
	return (
		<section className="lp-section" id="wp-deploy">
			<Waypoint index="01" label="DEPLOY" />
			<h2 className="lp-h2">
				Every new project makes you set up the same boilerplate again.
			</h2>
			<p className="lp-body">You have an idea. Then the setup starts.</p>
			<ul className="lp-body-list">
				<li>Email, because the waitlist needs it</li>
				<li>Auth for sign-ups</li>
				<li>A database, because auth needs one</li>
				<li>Analytics - you need visitor stats</li>
				<li>Payments, because eventually you want to get paid</li>
			</ul>
			<p className="lp-body">
				You have built all of this before, and you will build it again. Or you
				rent it: five managed services, five bills, none of it yours.
			</p>
			<SetupTaxStrip />
			<p className="lp-payoff">
				<strong>
					<span className="lp-accent">Alfredo</span> wires all of it once, on
					your own server.
				</strong>{" "}
				Your next project is live in minutes.
			</p>
			<LoopAnchor
				src="/generated/wiring-patchbay.mp4"
				poster="/generated/wiring-patchbay-poster.jpg"
				reducedSrc="/generated/wiring-patchbay-reduced-motion.jpg"
				label="Alfredo wiring loop: services are wired at deploy, reused across projects"
			/>
		</section>
	);
}
