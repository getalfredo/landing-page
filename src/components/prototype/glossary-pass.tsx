// PROTOTYPE — throwaway (wayfinder #49, glossary treatment). Three
// treatments of the locked three-term glossary (HQ / Porter / Tray), copy
// fixed by #34 and CONTEXT.md — wording is NOT an open axis, only the
// visual/interaction treatment is. Switchable via ?glossary=a|b|c on the
// real page (dev builds only), mounted at the page tail between the final
// CTA and the nameplate footer (#32). Each variant also answers the
// ticket's two open sub-questions differently:
//
//   a "Colophon plate" — static seam-divided definition list in one narrow
//        glass panel. Sits BELOW the waypointed page as a quiet printed
//        legend: NO waypoint, no minimap station. Reads as a chassis
//        colophon, a footnote for the reader who scrolled this far.
//   b "Keycap index"   — three bone keycaps (HQ / PORTER / TRAY); pressing
//        one depresses it (amber + LED) and reveals its definition in a
//        display readout below. A real waypointed station (08 TERMS). The
//        lore is behind the key — you press to learn it.
//   c "Schematic legend" — the three terms drawn as an etched topology
//        (Trays -> Porter -> HQ) with numbered callouts. A labeled picture,
//        not a list. Contained band with a waypoint. NOTE: this leans on
//        the same idea as #51 (etched mono architecture diagram) — flagged
//        for the operator; the glossary could borrow #51's diagram or defer.
//
// The #34 ripple rule holds: coined nouns appear only inside this section —
// none of the variants leak Porter/Tray teasers upward. Remove with
// glossary-pass.css.
import { useEffect, useState } from "react";
import "#/components/prototype/glossary-pass.css";

export type GlossaryVariant = "a" | "b" | "c" | "d";

const ORDER: (GlossaryVariant | null)[] = [null, "a", "b", "c", "d"];
const NAMES: Record<GlossaryVariant, string> = {
	a: "Colophon plate",
	b: "Keycap index",
	c: "Schematic legend",
	d: "Vocabulary tree",
};

/* ---------------------- content model ------------------------ */
// Locked copy — #34 resolution, verbatim. Order descends familiar ->
// internal (the reader earns each word). Do not reword here.

type Term = {
	key: string; // keycap face + schematic callout
	title: string; // display term
	lede: string; // opening sentence (the "what")
	body: string; // the rest of the one-liner (the "how")
};

const TERMS: Term[] = [
	{
		key: "HQ",
		title: "HQ",
		lede: "Your headquarters.",
		body: "The one dashboard every project reports to: traffic, email, payments, errors, uptime.",
	},
	{
		key: "PORTER",
		title: "Porter",
		lede: "Alfredo's worker on each of your servers.",
		body: "One server, one porter. It deploys your projects, sets out trays, and reports back to the HQ.",
	},
	{
		key: "TRAY",
		title: "Tray",
		lede: "One integration, ready to use: analytics, email, payments, auth.",
		body: "Alfredo sets each tray out once. Every project that needs it is served from the same tray.",
	},
];

/* ---------------------- variant state ------------------------ */

/** Reads ?glossary= on mount (dev only) and mirrors changes back into the URL. */
export function useGlossaryPass(): [
	GlossaryVariant | null,
	(v: GlossaryVariant | null) => void,
] {
	const [variant, setVariant] = useState<GlossaryVariant | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("glossary");
		if (v === "a" || v === "b" || v === "c" || v === "d") setVariant(v);
	}, []);

	const update = (v: GlossaryVariant | null) => {
		setVariant(v);
		const q = new URLSearchParams(window.location.search);
		if (v === null) q.delete("glossary");
		else q.set("glossary", v);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [variant, update];
}

/* ----------------- shared: section intro etch ---------------- */

function IntroEtch({
	waypoint,
	index = "08",
}: {
	waypoint?: boolean;
	index?: string;
}) {
	// b/c earn a waypoint station; a gets only the quiet lead-in etch.
	if (waypoint) {
		return (
			<div className="lp-waypoint" aria-hidden="true">
				<span className="lp-waypoint-line" />
				<span className="lp-etch lp-waypoint-text">
					<span className="lp-waypoint-index">{index}</span> TERMS
				</span>
				<span className="lp-waypoint-led" />
				<span className="lp-waypoint-line" />
			</div>
		);
	}
	return (
		<p className="lp-etch glp-lead" aria-hidden="true">
			<span className="glp-lead-led" /> THREE WORDS ALFREDO USES
		</p>
	);
}

/* ------------------- A — Colophon plate ---------------------- */

function GlossaryColophon() {
	return (
		<section className="lp-section glp-colophon" aria-label="The vocabulary">
			<IntroEtch />
			<dl className="glp-plate">
				{TERMS.map((t) => (
					<div className="glp-plate-row" key={t.key}>
						<dt className="glp-plate-term">
							<span className="glp-term-led" aria-hidden="true" />
							{t.title}
						</dt>
						<dd className="glp-plate-def">
							<span className="glp-def-lede">{t.lede}</span> {t.body}
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}

/* -------------------- B — Keycap index ----------------------- */

function GlossaryKeycaps() {
	const [active, setActive] = useState(0);
	const term = TERMS[active];

	return (
		<section className="lp-section glp-keycaps" aria-label="The vocabulary">
			<IntroEtch waypoint />
			<h2 className="lp-h2 glp-keycaps-h2">The words behind the keys.</h2>
			<div className="glp-key-rail" role="tablist" aria-label="Glossary terms">
				{TERMS.map((t, i) => (
					<button
						key={t.key}
						type="button"
						role="tab"
						aria-selected={i === active}
						className={`glp-key${i === active ? " glp-key-on" : ""}`}
						// Clicking the open key is a no-op (FAQ grammar #31): one
						// definition is always showing.
						onClick={() => i !== active && setActive(i)}
					>
						<span
							className={`glp-key-led${i === active ? " glp-key-led-on" : ""}`}
							aria-hidden="true"
						/>
						<span className="glp-key-face">{t.key}</span>
					</button>
				))}
			</div>
			<div className="glp-readout" aria-live="polite">
				<span className="lp-etch glp-readout-etch">
					{String(active + 1).padStart(2, "0")} · {term.key}
				</span>
				<p className="glp-readout-def">
					<span className="glp-readout-lede">{term.lede}</span> {term.body}
				</p>
			</div>
		</section>
	);
}

/* ------------------ C — Schematic legend --------------------- */

function GlossarySchematic() {
	return (
		<section
			className="lp-section lp-band glp-schematic"
			aria-label="The vocabulary"
		>
			<IntroEtch waypoint />
			<h2 className="lp-h2">How the words fit together.</h2>
			<div className="glp-diagram" aria-hidden="true">
				{/* HQ at the top, Porter feeding it, trays feeding the porter. */}
				<div className="glp-node glp-node-hq">
					<span className="glp-node-led" />
					<span className="glp-node-face">HQ</span>
				</div>
				<div className="glp-wire glp-wire-up" />
				<div className="glp-node glp-node-porter">
					<span className="glp-node-led" />
					<span className="glp-node-face">PORTER</span>
					<span className="lp-etch glp-node-sub">ONE SERVER</span>
				</div>
				<div className="glp-tray-rail">
					<span className="glp-wire glp-wire-tray" />
					<span className="glp-wire glp-wire-tray" />
					<span className="glp-wire glp-wire-tray" />
				</div>
				<div className="glp-trays">
					{["ANALYTICS", "EMAIL", "PAYMENTS"].map((label) => (
						<div className="glp-tray" key={label}>
							<span className="lp-etch glp-tray-label">{label}</span>
						</div>
					))}
				</div>
				<span className="lp-etch glp-tray-caption">TRAYS · SET OUT ONCE</span>
			</div>
			<dl className="glp-legend">
				{TERMS.map((t, i) => (
					<div className="glp-legend-row" key={t.key}>
						<dt className="glp-legend-term">
							<span className="glp-legend-index">
								{String(i + 1).padStart(2, "0")}
							</span>
							{t.title}
						</dt>
						<dd className="glp-legend-def">
							<span className="glp-def-lede">{t.lede}</span> {t.body}
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}

/* --------- D — The vocabulary tree (chosen direction) --------- */
// The operator's refined mix (#49 handover round 2): the topology IS the
// control surface — every node is a button, so nothing duplicates the
// terms. Real shape, not a tidy three: HQ over TWO porters (one per
// server) with FIVE trays fanned across them (3 on server 1, 2 on server
// 2). Collapsed by default — earned insider lore the reader opts into;
// opening it reveals the tree, then clicking any node reads that term.
// HQ -> term HQ, either porter -> term Porter, any tray -> term Tray.
// Placed BEFORE "Get in" (07), so it renumbers GET IN to 08 at fold-in.

type NodeRef = { key: string; term: number };

const HQ_NODE: NodeRef = { key: "hq", term: 0 };
const PORTERS: { key: string; sub: string; trays: string[] }[] = [
	{ key: "p1", sub: "SERVER 01", trays: ["ANALYTICS", "DATABASE", "EMAIL"] },
	{ key: "p2", sub: "SERVER 02", trays: ["PAYMENTS", "UPTIME"] },
];

function GlossaryTree() {
	const [expanded, setExpanded] = useState(false);
	const [active, setActive] = useState<NodeRef>(HQ_NODE);
	const term = TERMS[active.term];

	const nodeCls = (key: string, base: string) =>
		`${base}${active.key === key ? ` ${base}-active` : ""}`;

	return (
		<section
			className="lp-section lp-band glp-tree-sec"
			aria-label="The vocabulary"
		>
			<IntroEtch waypoint index="07" />

			{!expanded ? (
				<button
					type="button"
					className="glp-collapsed"
					onClick={() => setExpanded(true)}
					aria-expanded={false}
				>
					<span className="glp-collapsed-led" aria-hidden="true" />
					<span className="lp-etch glp-collapsed-label">
						THREE WORDS ALFREDO USES
					</span>
					<span className="lp-etch glp-collapsed-cue">＋ OPEN</span>
				</button>
			) : (
				<>
					<h2 className="lp-h2">The words, wired up.</h2>
					<p className="lp-etch glp-tree-hint" aria-hidden="true">
						TAP A NODE TO READ IT
					</p>

					<div className="glp-tree" aria-hidden="true">
						{/* HQ */}
						<button
							type="button"
							className={nodeCls("hq", "glp-tnode glp-tnode-hq")}
							onClick={() => setActive(HQ_NODE)}
						>
							<span className="glp-tnode-led" />
							<span className="glp-tnode-face">HQ</span>
						</button>
						<div className="glp-trunk" />

						{/* two porters, each fanning to its trays */}
						<div className="glp-porter-row">
							{PORTERS.map((p) => (
								<div className="glp-porter-col" key={p.key}>
									<button
										type="button"
										className={nodeCls(p.key, "glp-tnode glp-tnode-porter")}
										onClick={() => setActive({ key: p.key, term: 1 })}
									>
										<span className="glp-tnode-led" />
										<span className="glp-tnode-face">PORTER</span>
										<span className="lp-etch glp-tnode-sub">{p.sub}</span>
									</button>
									<div className="glp-tray-row">
										{p.trays.map((label) => {
											const key = `t:${label}`;
											return (
												<div className="glp-tray-col" key={label}>
													<button
														type="button"
														className={nodeCls(key, "glp-tnode glp-tnode-tray")}
														onClick={() => setActive({ key, term: 2 })}
													>
														<span className="glp-tnode-face">TRAY</span>
														<span className="lp-etch glp-tnode-sub">
															{label}
														</span>
													</button>
												</div>
											);
										})}
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="glp-readout" aria-live="polite">
						<span className="lp-etch glp-readout-etch">{term.key}</span>
						<p className="glp-readout-def">
							<span className="glp-readout-lede">{term.lede}</span> {term.body}
						</p>
					</div>

					<button
						type="button"
						className="lp-etch glp-collapse-close"
						onClick={() => setExpanded(false)}
					>
						－ CLOSE
					</button>
				</>
			)}
		</section>
	);
}

/* --------------------- pass mount ----------------------------- */

/** Mounts the chosen glossary treatment (before "Get in", #49 round 2). */
export function GlossaryPass({ variant }: { variant: GlossaryVariant }) {
	if (variant === "a") return <GlossaryColophon />;
	if (variant === "b") return <GlossaryKeycaps />;
	if (variant === "c") return <GlossarySchematic />;
	return <GlossaryTree />;
}

/* ---------------------- Switcher ----------------------------- */

/** Floating variant switcher: ‹ label ›, [ and ] keys, dev only. */
export function GlossarySwitcher({
	current,
	onChange,
}: {
	current: GlossaryVariant | null;
	onChange: (v: GlossaryVariant | null) => void;
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
		<div className="glp-switcher">
			<button
				type="button"
				onClick={() => cycle(-1)}
				aria-label="Previous glossary variant"
			>
				←
			</button>
			<span>
				{current === null
					? "GLOSSARY: OFF — [ ] to flip"
					: `GLOSSARY ${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button
				type="button"
				onClick={() => cycle(1)}
				aria-label="Next glossary variant"
			>
				→
			</button>
		</div>
	);
}
