// PROTOTYPE — throwaway (wayfinder #54, setup-tax ledger strip). The hero
// checkbox panel's argument stated as a countable ledger inside Day one:
// rows are the five integrations you re-wire (mirroring the hero deploy
// checklist and the copy's "five managed services, five bills"), contrasted
// EVERY NEW PROJECT vs WITH ALFREDO. Switchable via ?ledger=a|b|c on the
// real page (dev builds only); param absent = the current page, the
// "does it earn its place at all" control. The three variants disagree on
// structure, placement, and how the contrast is encoded:
//
//   a "Ledger"     — two-column mono table between the pain paragraph and
//        the payoff: both sides visible at once, LED-green WIRED ticks,
//        a totals row closing the arithmetic (FIVE SETUPS · EVERY TIME
//        vs ZERO · WIRED ONCE).
//   b "Receipt"    — the tax as a bill: narrow single-column receipt with
//        dotted leaders (AUTH ...... AGAIN), a TOTAL DUE line, and a
//        green WIRED ONCE stamp angled across it. Sits AFTER the payoff
//        as its echo; the contrast is temporal (bill, then stamp).
//   c "Flip strip" — WINNER (operator pick): one state at a time, a
//        two-cap toggle re-lights five slots and a SETUPS DUE counter
//        (5 → 0). Auto-switches every 3s with a progress bar under the
//        toggle (ambient motion legal per #16's amendment); clicking a
//        cap jumps there and restarts the cycle; reduced motion gets
//        the WIRED state static, toggle still works, bar hidden.
//
// Copy note: the strip is new page copy and #14 locks copy — headers,
// row labels, AGAIN/WIRED cells and the totals wording here are a copy
// PROPOSAL for the operator, not just pixels. Row set mirrors the hero
// checklist (Auth/Email/Database/Analytics/Payments); the prose's five
// includes Secrets instead of Payments — flagged for the fold-in ruling.
// No SIMULATED etch: this is a diagram, not a product-looking screenshot
// (honesty rule scoped per #15). Remove with ledger-pass.css.
import { useEffect, useState } from "react";
import { LoopAnchor } from "#/components/landing/loop-anchor";
import { usePrefersReducedMotion } from "#/components/landing/use-prefers-reduced-motion";
import { Waypoint } from "#/components/landing/waypoint";
import "#/components/prototype/ledger-pass.css";

export type LedgerVariant = "a" | "b" | "c";

const ORDER: (LedgerVariant | null)[] = [null, "a", "b", "c"];
const NAMES: Record<LedgerVariant, string> = {
	a: "Ledger",
	b: "Receipt",
	c: "Flip strip",
};

// Mirrors the hero deploy checklist (hero-demo.tsx ALL_SERVICES).
const ROWS = ["AUTH", "EMAIL", "DATABASE", "ANALYTICS", "PAYMENTS"];

/* ---------------------- variant state ------------------------ */

/** Reads ?ledger= on mount (dev only) and mirrors changes back into the URL. */
export function useLedgerPass(): [
	LedgerVariant | null,
	(v: LedgerVariant | null) => void,
] {
	const [variant, setVariant] = useState<LedgerVariant | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("ledger");
		if (v === "a" || v === "b" || v === "c") setVariant(v);
	}, []);

	const update = (v: LedgerVariant | null) => {
		setVariant(v);
		const q = new URLSearchParams(window.location.search);
		if (v === null) q.delete("ledger");
		else q.set("ledger", v);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [variant, update];
}

/* ------------- variant a: two-column ledger table ------------ */

function LedgerTable() {
	return (
		<div className="ldg-card">
			<table className="ldg-table">
				<thead>
					<tr>
						<th aria-label="Integration" />
						<th className="lp-etch ldg-head">EVERY NEW PROJECT</th>
						<th className="lp-etch ldg-head">WITH ALFREDO</th>
					</tr>
				</thead>
				<tbody>
					{ROWS.map((r) => (
						<tr key={r}>
							<th className="lp-etch ldg-row-label">{r}</th>
							<td className="lp-etch ldg-again">SET UP AGAIN</td>
							<td className="ldg-wired">
								<span className="ldg-led" aria-hidden="true" />
								<span className="lp-etch ldg-etch-green">WIRED</span>
							</td>
						</tr>
					))}
				</tbody>
				<tfoot>
					<tr>
						<th className="lp-etch ldg-row-label ldg-total-label">TOTAL</th>
						<td className="lp-etch ldg-again ldg-total">
							FIVE SETUPS · EVERY TIME
						</td>
						<td className="lp-etch ldg-etch-green ldg-total">
							ZERO · WIRED ONCE
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}

/* ---------------- variant b: setup-tax receipt --------------- */

function LedgerReceipt() {
	return (
		<div
			className="ldg-receipt"
			role="img"
			aria-label="Setup tax receipt: auth, email, database, analytics, payments due again at every new project. Stamped: wired once, with Alfredo."
		>
			<p className="lp-etch ldg-receipt-head">THE SETUP TAX</p>
			<ul className="ldg-receipt-lines">
				{ROWS.map((r) => (
					<li key={r} className="lp-etch ldg-receipt-line">
						<span>{r}</span>
						<span className="ldg-receipt-dots" aria-hidden="true" />
						<span className="ldg-receipt-due">AGAIN</span>
					</li>
				))}
			</ul>
			<p className="lp-etch ldg-receipt-total">
				<span>TOTAL DUE</span>
				<span className="ldg-receipt-dots" aria-hidden="true" />
				<span className="ldg-receipt-due">EVERY NEW PROJECT</span>
			</p>
			<span className="ldg-stamp" aria-hidden="true">
				<span className="ldg-stamp-big">WIRED ONCE</span>
				<span className="lp-etch ldg-stamp-small">WITH ALFREDO</span>
			</span>
		</div>
	);
}

/* ------------- variant c: one-state flip strip --------------- */

const FLIP_MS = 3000;

function LedgerFlip() {
	const reduced = usePrefersReducedMotion();
	// Reduced motion starts (and stays, absent clicks) on the payoff state.
	const [wired, setWired] = useState(false);
	// Counts every flip (auto or manual): keys the progress bar so its
	// fill animation restarts in sync with each switch.
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

/* ---------- the Day one section with the strip mounted ---------- */
// A prototype copy of landing/day-one.tsx; replaces <DayOne /> while a
// variant is active. Copy verbatim from issue-14 — only the strip is new.

export function LedgerDayOne({ variant }: { variant: LedgerVariant }) {
	return (
		<section className="lp-section" id="wp-deploy">
			<Waypoint index="01" label="DEPLOY" />
			<h2 className="lp-h2">
				Every new project makes you set up the same boilerplate again.
			</h2>
			<p className="lp-body">
				You have an idea. The waitlist needs email, so you set that up. Sign-ups
				need auth, and auth needs a database. Analytics, because you want to
				know if anyone shows up. Secrets, because the keys have to live
				somewhere. You have built all of this before, and you will build it
				again. Or you rent it: five managed services, five bills, none of it
				yours.
			</p>
			{/* a and c state the count BEFORE the payoff resolves it. */}
			{variant === "a" && <LedgerTable />}
			{variant === "c" && <LedgerFlip />}
			<p className="lp-payoff">
				<strong>Alfredo wires all of it once, on your own server.</strong> Your
				next project is live in minutes.
			</p>
			{/* b echoes the payoff just read: the bill arrives stamped. */}
			{variant === "b" && <LedgerReceipt />}
			<LoopAnchor
				src="/generated/wiring-patchbay.mp4"
				poster="/generated/wiring-patchbay-poster.jpg"
				reducedSrc="/generated/wiring-patchbay-reduced-motion.jpg"
				label="Alfredo wiring loop: services are wired at deploy, reused across projects"
			/>
		</section>
	);
}

/* ---------------------- switcher bar ------------------------- */

export function LedgerSwitcher({
	current,
	onChange,
}: {
	current: LedgerVariant | null;
	onChange: (v: LedgerVariant | null) => void;
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
		<div className="ldg-switcher">
			<button
				type="button"
				onClick={() => cycle(-1)}
				aria-label="Previous ledger variant"
			>
				←
			</button>
			<span>
				{current === null
					? "LEDGER: OFF — [ ] to flip"
					: `LEDGER ${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button
				type="button"
				onClick={() => cycle(1)}
				aria-label="Next ledger variant"
			>
				→
			</button>
		</div>
	);
}
