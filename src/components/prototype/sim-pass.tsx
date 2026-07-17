// PROTOTYPE — throwaway (wayfinder #42, gamified sim). One artifact, two
// modes: the ambient collapse loop that anchors Every day after (attract)
// and a fullscreen playable sim behind a dive-in keycap. ?sim=spectacle|pain
// on the real page (dev builds only) picks the open axis from #40 — how the
// "without Alfredo" side behaves over the SAME world state:
//   spectacle — the sprawl is a thing you look at: the guilty pane pulses
//               among the grid, but from out there all you can do is stare;
//               acting means flipping back to the HQ.
//   pain      — the sprawl is the game: hunt the incident by opening panes
//               (every pane is another tab), fix it in place; your own click
//               count is the contrast.
// Section copy duplicated from every-day-after.tsx on purpose — the prototype dies
// whole. New strings are directional and go through copy discipline (#14)
// before any build. Remove with sim-world.ts / sim-pass.css.
import { useEffect, useReducer, useRef, useState } from "react";
import { consoleCssVars } from "#/components/landing/console-vars";
import { usePrefersReducedMotion } from "#/components/landing/use-prefers-reduced-motion";
import {
	type Action,
	ATTRACT_SCRIPT,
	BEATS,
	firingIncident,
	init,
	type Pane,
	PICKABLE,
	panesOf,
	projectStatus,
	reduce,
	totalRate,
	trayLit,
	trayOf,
	trend,
	type World,
} from "#/components/prototype/sim-world";
import "#/components/prototype/sim-pass.css";

/* ---------------------------------------------------------- variants ---- */

export type SimVariant = "spectacle" | "pain";

const ORDER: (SimVariant | null)[] = [null, "spectacle", "pain"];
const NAMES: Record<SimVariant, string> = {
	spectacle: "Spectacle sprawl",
	pain: "Playable pain",
};

export function useSimPass(): [
	SimVariant | null,
	(v: SimVariant | null) => void,
] {
	const [variant, setVariant] = useState<SimVariant | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("sim");
		if (v === "spectacle" || v === "pain") setVariant(v);
	}, []);

	const update = (v: SimVariant | null) => {
		setVariant(v);
		const q = new URLSearchParams(window.location.search);
		if (v === null) q.delete("sim");
		else q.set("sim", v);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [variant, update];
}

/* ------------------------------------------------------------ engine ---- */

function useEngine(mode: World["mode"], running: boolean) {
	const [w, dispatch] = useReducer(reduce, undefined, () => init(mode));
	const stepRef = useRef(0);
	const wRef = useRef(w);
	wRef.current = w;

	useEffect(() => {
		if (!running) return;
		let raf = 0;
		let last = performance.now();
		const tick = (now: number) => {
			const dt = Math.min(0.09, (now - last) / 1000);
			last = now;
			dispatch({ type: "tick", dt });
			// attract: the director plays the same actions a player would
			if (mode === "attract") {
				const world = wRef.current;
				if (stepRef.current > 0 && world.t < 0.1) stepRef.current = 0;
				while (
					stepRef.current < ATTRACT_SCRIPT.length &&
					ATTRACT_SCRIPT[stepRef.current].at <= world.t
				) {
					let a: Action = ATTRACT_SCRIPT[stepRef.current].action;
					if (a.type === "catch")
						a = { type: "catch", id: firingIncident(world)?.id ?? "" };
					dispatch(a);
					stepRef.current += 1;
				}
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [mode, running]);

	return [w, dispatch] as const;
}

const fmt = (n: number) => Math.floor(n).toLocaleString("en-US");

/* ------------------------------------------------- Every day after ------ */

// Replaces EveryDayAfter whole while the prototype runs: same copy, the sim's
// attract loop as the section anchor, dive-in keycap on the glass.
export function SimActTwo({ variant }: { variant: SimVariant }) {
	const [open, setOpen] = useState(false);
	const reduced = usePrefersReducedMotion();

	return (
		<section className="lp-section">
			<h2 className="lp-h2">
				Every project you ship adds five more dashboards to check.
			</h2>
			<p className="lp-body">
				Traffic is in one tab, email delivery in another, payments in a third.
				That is one project. Ship a second and it all doubles. The setup
				eventually ends. The checking never does.
			</p>
			<p className="lp-payoff">
				<strong>Because Alfredo wired your stack, it can watch it.</strong>{" "}
				Traffic spikes, bounced emails, failed payments: every project, one HQ.
			</p>
			<div className="lp-anchor sim-anchor">
				{reduced ? (
					<SimStill onDiveIn={() => setOpen(true)} />
				) : (
					<SimAttract onDiveIn={() => setOpen(true)} />
				)}
			</div>
			{open && (
				<SimFullscreen variant={variant} onClose={() => setOpen(false)} />
			)}
		</section>
	);
}

/* ----------------------------------------------------- attract mode ----- */

function SimAttract({ onDiveIn }: { onDiveIn: () => void }) {
	const hostRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);
	const [w, dispatch] = useEngine("attract", visible);

	// #15 rule: ambient loops pause off-screen
	useEffect(() => {
		const el = hostRef.current;
		if (!el) return;
		const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
			threshold: 0.25,
		});
		io.observe(el);
		return () => io.disconnect();
	}, []);

	const panes = panesOf(w);
	const without = w.view === "without";

	return (
		<div className="sim-attract" ref={hostRef} data-view={w.view}>
			<div className="sim-attract-top">
				<span className="lp-etch">EVERY DAY AFTER · SIMULATED</span>
				<span className="lp-etch sim-attract-count">
					{without ? `${panes.length} DASHBOARDS` : "ONE HQ"}
				</span>
			</div>
			<div className="sim-stage">
				<div className="sim-layer sim-layer-hq" aria-hidden={without}>
					<HqPanel w={w} dispatch={dispatch} interactive={false} compact />
				</div>
				<div className="sim-layer sim-layer-sprawl" aria-hidden={!without}>
					<SprawlGrid
						w={w}
						dispatch={dispatch}
						variant="spectacle"
						interactive={false}
						compact
					/>
				</div>
			</div>
			<div className="sim-attract-foot">
				<span className="sim-attract-line">
					The same three projects, both ways.
				</span>
				<button type="button" className="lp-btn lp-btn-next" onClick={onDiveIn}>
					Run it yourself
				</button>
			</div>
		</div>
	);
}

// Reduced motion: the claim-carrying still — sprawl vs one HQ, no clock.
function SimStill({ onDiveIn }: { onDiveIn: () => void }) {
	return (
		<div className="sim-attract sim-still" data-view="without">
			<div className="sim-attract-top">
				<span className="lp-etch">EVERY DAY AFTER · SIMULATED</span>
				<span className="lp-etch sim-attract-count">14 DASHBOARDS → 1 HQ</span>
			</div>
			<div className="sim-still-split">
				<div className="sim-still-cell">
					<span className="lp-etch">WITHOUT</span>
					<div className="sim-still-sprawl" aria-hidden="true">
						{Array.from({ length: 14 }, (_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: static frame
							<span className="sim-still-pane" key={i} />
						))}
					</div>
				</div>
				<div className="sim-still-cell">
					<span className="lp-etch">WITH ALFREDO</span>
					<div className="sim-still-hq" aria-hidden="true">
						<span className="sim-still-led" />
					</div>
				</div>
			</div>
			<div className="sim-attract-foot">
				<span className="sim-attract-line">
					The same three projects, both ways.
				</span>
				<button type="button" className="lp-btn lp-btn-next" onClick={onDiveIn}>
					Run it yourself
				</button>
			</div>
		</div>
	);
}

/* ------------------------------------------------------- fullscreen ----- */

export function SimFullscreen({
	variant,
	onClose,
}: {
	variant: SimVariant;
	onClose: () => void;
}) {
	const [w, dispatch] = useEngine("guided", true);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		document.documentElement.style.overflow = "hidden";
		// hide the OTHER passes' dev pills while the sim owns the screen
		document.documentElement.classList.add("sim-open");
		return () => {
			window.removeEventListener("keydown", onKey);
			document.documentElement.style.overflow = "";
			document.documentElement.classList.remove("sim-open");
		};
	}, [onClose]);

	const without = w.view === "without";
	const hot =
		w.mode === "guided"
			? BEATS[Math.min(w.beat, BEATS.length - 1)]?.hot
			: "none";
	const toggleHot =
		w.mode === "guided" &&
		(w.beat === 3 ||
			w.beat === 5 ||
			// spectacle's only exit from the sprawl is flipping back
			(w.beat === 4 && variant === "spectacle" && w.t - w.viewFlippedAt > 3));

	const joinWaitlist = () => {
		onClose();
		document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="sim-full" style={consoleCssVars} data-view={w.view}>
			<div className="sim-full-frame">
				<header className="sim-head">
					<span className="lp-etch sim-head-etch">
						ALFREDO HQ · SIMULATED FEED
					</span>
					<fieldset
						className={`sim-toggle${toggleHot ? " sim-hot" : ""}`}
						aria-label="With or without Alfredo"
					>
						<button
							type="button"
							className={without ? "" : "sim-toggle-on"}
							onClick={() => dispatch({ type: "toggle", view: "with" })}
						>
							<span className="sim-toggle-led" aria-hidden="true" />
							WITH ALFREDO
						</button>
						<button
							type="button"
							className={without ? "sim-toggle-on sim-toggle-without" : ""}
							onClick={() => dispatch({ type: "toggle", view: "without" })}
						>
							WITHOUT
						</button>
					</fieldset>
					<button
						type="button"
						className="sim-close"
						onClick={onClose}
						aria-label="Close the simulation"
					>
						✕
					</button>
				</header>

				<div className="sim-stage sim-stage-full">
					<div className="sim-layer sim-layer-hq" aria-hidden={without}>
						<HqPanel
							w={w}
							dispatch={dispatch}
							interactive={!without}
							hot={hot}
						/>
					</div>
					<div className="sim-layer sim-layer-sprawl" aria-hidden={!without}>
						<SprawlGrid
							w={w}
							dispatch={dispatch}
							variant={variant}
							interactive={without}
						/>
					</div>
					{w.sheet && !without && (
						<DeploySheet w={w} dispatch={dispatch} hot={hot === "deploy"} />
					)}
					{w.cta === "shown" && (
						<CtaCard
							w={w}
							onJoin={joinWaitlist}
							onStay={() => dispatch({ type: "cta-dismiss" })}
						/>
					)}
				</div>

				<BeatCard w={w} variant={variant} />

				<footer className="sim-foot">
					<span className="lp-etch">
						RUNS {w.counters.runs} · DEPLOYS {w.counters.deploys} · CAUGHT{" "}
						{w.counters.caught} · AUTO-CAUGHT {w.counters.autoCaught}
					</span>
					<span className="lp-etch lp-microprint">
						NOTHING HERE IS REAL · AGGREGATES GO LIVE WITH THE PAGE
					</span>
				</footer>
			</div>
		</div>
	);
}

/* --------------------------------------------------------- beat card ---- */

function BeatCard({ w, variant }: { w: World; variant: SimVariant }) {
	if (w.mode !== "guided") {
		return (
			<div className="sim-beat sim-beat-free">
				<span className="lp-etch">SANDBOX</span>
				<span className="sim-beat-text">
					Deploy more. Break things. Flip the switch whenever.
				</span>
			</div>
		);
	}
	const prompt =
		w.beat === 4
			? variant === "spectacle"
				? `${panesOf(w).length} dashboards. One is on fire — can you tell which? From out here you can only stare. Flip back to act.`
				: "One of these is on fire. Find it — every pane you open is another tab."
			: BEATS[Math.min(w.beat, BEATS.length - 1)].prompt;
	return (
		<div className="sim-beat">
			<span className="lp-etch">
				STEP {Math.min(w.beat + 1, BEATS.length)} / {BEATS.length}
			</span>
			<span className="sim-beat-text">{prompt}</span>
		</div>
	);
}

/* ----------------------------------------------------------- HQ view ---- */

function HqPanel({
	w,
	dispatch,
	interactive,
	compact = false,
	hot = "none",
}: {
	w: World;
	dispatch: (a: Action) => void;
	interactive: boolean;
	compact?: boolean;
	hot?: string;
}) {
	const firing = firingIncident(w);
	const firingProject = firing
		? w.projects.find((p) => p.id === firing.projectId)
		: null;
	const rate = totalRate(w);
	const bars = trend(w);
	const max = Math.max(...bars, 1);

	return (
		<div className={`sim-hq${compact ? " sim-hq-compact" : ""}`}>
			<div className="sim-tiles">
				<div className="sim-tile">
					<span className="lp-etch">ACTIVITY</span>
					<span className="sim-tile-num">{fmt(rate * 60)}/min</span>
					<span className="sim-spark" aria-hidden="true">
						{bars.map((b, i) => (
							<span
								className="sim-spark-bar"
								// biome-ignore lint/suspicious/noArrayIndexKey: fixed strip
								key={i}
								style={{ height: `${Math.max(8, (b / max) * 100)}%` }}
							/>
						))}
					</span>
				</div>
				<div className="sim-tile">
					<span className="lp-etch">MAIL</span>
					<span className="sim-tile-num">{fmt(w.mails)} sent</span>
				</div>
				<div className="sim-tile">
					<span className="lp-etch">MONEY</span>
					<span className="sim-tile-num">€ {fmt(w.revenue)}</span>
				</div>
				<div className={`sim-tile${firing ? " sim-tile-alert" : ""}`}>
					<span className="lp-etch">HEALTH</span>
					<span className="sim-tile-num">{firing ? "1 ALERT" : "OK"}</span>
				</div>
			</div>

			{/* lead slot: the one thing that matters right now */}
			{firing && firingProject ? (
				<div className="sim-lead sim-lead-alert">
					<div className="sim-lead-head">
						<span className="lp-etch">
							INCIDENT · FLAGGED BY {trayOf(firing.tray).provider.toUpperCase()}
						</span>
						<span className="sim-tag-red">FIRING</span>
					</div>
					<span className="sim-lead-big">
						{firingProject.name} · {trayOf(firing.tray).label.toLowerCase()}{" "}
						{firing.title}
					</span>
					{interactive && (
						<button
							type="button"
							className="lp-btn lp-btn-next sim-catch"
							onClick={() => dispatch({ type: "catch", id: firing.id })}
						>
							Restart it
						</button>
					)}
				</div>
			) : (
				<div className="sim-lead">
					<div className="sim-lead-head">
						<span className="lp-etch">FEED</span>
						<span className="sim-tag-green">
							{w.projects.length > 0 ? "ALL QUIET" : "EMPTY"}
						</span>
					</div>
					<ul className="sim-feed">
						{w.feed.slice(0, compact ? 3 : 5).map((f) => (
							<li key={f.id} className={`sim-feed-item sim-feed-${f.tone}`}>
								{f.text}
							</li>
						))}
					</ul>
				</div>
			)}

			<div className="sim-projects">
				{w.projects.map((p) => {
					const status = projectStatus(p, w.t, w.incidents);
					return (
						<div className={`sim-proj sim-proj-${status}`} key={p.id}>
							<span
								className={`sim-led${
									status === "alert"
										? " sim-led-red"
										: status === "wiring"
											? " sim-led-amber"
											: ""
								}`}
								aria-hidden="true"
							/>
							<span className="sim-proj-name">{p.name}</span>
							<span className="sim-proj-chips">
								{p.trays.map((tr) => (
									<span
										className={`sim-chip${trayLit(p, tr, w.t) ? " sim-chip-lit" : ""}${
											p.reused.includes(tr) ? " sim-chip-reused" : ""
										}`}
										key={tr}
										title={`${trayOf(tr).label} · ${trayOf(tr).provider}`}
									>
										{trayOf(tr).chip}
									</span>
								))}
							</span>
							<span className="lp-etch sim-proj-state">
								{w.t < p.liveAt
									? "WIRING…"
									: p.reused.length > 0 && w.t < p.liveAt + 2.5
										? `${p.reused.length} REUSED`
										: "LIVE"}
							</span>
						</div>
					);
				})}
				{interactive && !w.sheet && (
					<button
						type="button"
						className={`sim-proj sim-plus${hot === "plus" ? " sim-hot" : ""}`}
						onClick={() => dispatch({ type: "open-sheet" })}
					>
						<span className="sim-plus-sign" aria-hidden="true">
							+
						</span>
						new project
					</button>
				)}
			</div>
		</div>
	);
}

/* -------------------------------------------------------- sprawl view --- */

// The without-side: one nameless pane per (project × tray). Spectacle keeps
// it inert and pulsing; pain makes every pane a tab you have to open.
function SprawlGrid({
	w,
	dispatch,
	variant,
	interactive,
	compact = false,
}: {
	w: World;
	dispatch: (a: Action) => void;
	variant: SimVariant;
	interactive: boolean;
	compact?: boolean;
}) {
	const panes = panesOf(w);
	const firing = firingIncident(w);

	return (
		<div className={`sim-sprawl${compact ? " sim-sprawl-compact" : ""}`}>
			<div className="sim-sprawl-score">
				<span className="sim-sprawl-count">
					{panes.length} dashboards to check
				</span>
				<span className="lp-etch">WITH ALFREDO · 1</span>
				{variant === "pain" && interactive && firing && (
					<span className="lp-etch sim-sprawl-clicks">
						CLICKS {w.huntClicks}
					</span>
				)}
			</div>
			<div className="sim-panes">
				{panes.map((pane, i) => (
					<SprawlPane
						key={pane.id}
						pane={pane}
						index={i}
						w={w}
						variant={variant}
						interactive={interactive}
						guilty={
							firing !== null &&
							firing.projectId === pane.project.id &&
							firing.tray === pane.tray
						}
						firingId={firing?.id ?? null}
						dispatch={dispatch}
					/>
				))}
			</div>
		</div>
	);
}

function SprawlPane({
	pane,
	index,
	w,
	variant,
	interactive,
	guilty,
	firingId,
	dispatch,
}: {
	pane: Pane;
	index: number;
	w: World;
	variant: SimVariant;
	interactive: boolean;
	guilty: boolean;
	firingId: string | null;
	dispatch: (a: Action) => void;
}) {
	const opened = w.openedPanes.includes(pane.id);
	const revealed = variant === "spectacle" ? guilty : guilty && opened;
	const clickable = interactive && variant === "pain";

	const body = (
		<>
			<span className="sim-pane-dots" aria-hidden="true">
				<span />
				<span />
				<span />
			</span>
			<span className="sim-pane-title">{trayOf(pane.tray).label}</span>
			<span className="sim-pane-sub">{pane.project.name}</span>
			{revealed ? (
				<span className="sim-pane-alarm">
					{firingIncident(w)?.title ?? "on fire"}
				</span>
			) : variant === "pain" && opened ? (
				<span className="sim-pane-ok">nothing new</span>
			) : (
				<span className="sim-pane-noise" aria-hidden="true">
					<span style={{ width: `${34 + ((index * 37) % 46)}%` }} />
					<span style={{ width: `${22 + ((index * 53) % 58)}%` }} />
				</span>
			)}
			{revealed && clickable && firingId && (
				<button
					type="button"
					className="lp-btn lp-btn-next sim-pane-fix"
					onClick={(e) => {
						e.stopPropagation();
						dispatch({ type: "fix-pane", incidentId: firingId });
					}}
				>
					Restart it
				</button>
			)}
		</>
	);

	const cls = `sim-pane${guilty && variant === "spectacle" ? " sim-pane-guilty" : ""}${
		opened ? " sim-pane-open" : ""
	}${guilty && opened ? " sim-pane-guilty-open" : ""}`;

	if (clickable) {
		return (
			<button
				type="button"
				className={cls}
				style={{ transitionDelay: `${index * 14}ms` }}
				onClick={() => !opened && dispatch({ type: "open-pane", id: pane.id })}
			>
				{body}
			</button>
		);
	}
	return (
		<div className={cls} style={{ transitionDelay: `${index * 14}ms` }}>
			{body}
		</div>
	);
}

/* ------------------------------------------------------- deploy sheet --- */

function DeploySheet({
	w,
	dispatch,
	hot,
}: {
	w: World;
	dispatch: (a: Action) => void;
	hot: boolean;
}) {
	const sheet = w.sheet;
	if (!sheet) return null;
	const running = new Set(w.projects.flatMap((p) => p.trays));

	return (
		<div className="sim-sheet">
			<div className="sim-sheet-head">
				<span className="lp-etch">NEW PROJECT</span>
				{!sheet.locked && (
					<button
						type="button"
						className="lp-etch sim-sheet-shuffle"
						onClick={() => dispatch({ type: "sheet-name" })}
					>
						↻ NAME
					</button>
				)}
			</div>
			<span className="sim-sheet-name">{sheet.name}</span>
			<div className="sim-sheet-trays">
				{PICKABLE.map((tr) => {
					const on = sheet.picks.includes(tr.id);
					const reuse = on && running.has(tr.id);
					return (
						<button
							type="button"
							key={tr.id}
							className={`sim-tray${on ? " sim-tray-on" : ""}`}
							disabled={sheet.locked}
							onClick={() => dispatch({ type: "sheet-tray", tray: tr.id })}
						>
							<span className="sim-tray-box" aria-hidden="true">
								{on ? "✓" : ""}
							</span>
							<span className="sim-tray-name">{tr.label}</span>
							<span className="lp-etch sim-tray-tag">
								{reuse ? "REUSED" : on ? "START" : ""}
							</span>
						</button>
					);
				})}
				<div className="sim-tray sim-tray-implicit">
					<span className="sim-tray-box" aria-hidden="true">
						✓
					</span>
					<span className="sim-tray-name">Errors + Uptime</span>
					<span className="lp-etch sim-tray-tag">
						{running.size > 0 ? "REUSED" : "STANDARD"}
					</span>
				</div>
			</div>
			<button
				type="button"
				className={`lp-btn ${hot ? "lp-btn-next" : "lp-btn-keycap"}`}
				onClick={() => dispatch({ type: "deploy" })}
			>
				Deploy
			</button>
		</div>
	);
}

/* ----------------------------------------------------------- CTA card --- */

function CtaCard({
	w,
	onJoin,
	onStay,
}: {
	w: World;
	onJoin: () => void;
	onStay: () => void;
}) {
	return (
		<div className="sim-cta">
			<div className="sim-cta-card">
				<span className="lp-etch">RUN COMPLETE · SIMULATED</span>
				<span className="sim-cta-big">
					You ran {w.projects.length} projects from one screen.
				</span>
				<span className="sim-cta-sub">
					The real HQ does this with real trays on your servers. Be there when
					it boots.
				</span>
				<div className="sim-cta-btns">
					<button type="button" className="lp-btn lp-btn-next" onClick={onJoin}>
						Join the waitlist
					</button>
					<button
						type="button"
						className="lp-btn lp-btn-keycap"
						onClick={onStay}
					>
						Keep playing
					</button>
				</div>
			</div>
		</div>
	);
}

/* ----------------------------------------------------------- switcher --- */

/** Floating variant switcher: ‹ label ›, [ and ] keys, dev only. */
export function SimSwitcher({
	current,
	onChange,
}: {
	current: SimVariant | null;
	onChange: (v: SimVariant | null) => void;
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
			if (e.key !== "{" && e.key !== "}") return;
			const i = ORDER.indexOf(current);
			const next =
				e.key === "}"
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
		<div className="sim-switcher">
			<button
				type="button"
				onClick={() => cycle(-1)}
				aria-label="Previous sim variant"
			>
				←
			</button>
			<span>
				{current === null
					? "SIM: LIVE — current page"
					: `SIM ${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button
				type="button"
				onClick={() => cycle(1)}
				aria-label="Next sim variant"
			>
				→
			</button>
		</div>
	);
}
