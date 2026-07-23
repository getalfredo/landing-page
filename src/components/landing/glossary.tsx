// Glossary section (wayfinder #49): the three coined terms — HQ / Porter /
// Tray — as variant D "Vocabulary tree". Collapsed by default (a `08 TERMS`
// pill the reader opts into — earned insider lore); opening it reveals a
// topology where every node IS a button that reads its term. Copy is locked
// by #34 / CONTEXT.md — wording is not an axis. The #34 ripple rule holds:
// the coined nouns appear only inside this section, never leaking upward.
// Placed BEFORE "Get in" (#49 round 2): this is waypoint `08 TERMS` (the
// #74 comparison section took 04 KEEP, pushing the tail +1), which renumbers
// the final CTA to `09 GET IN` (minimap + final-cta match).
import { useState } from "react";
import { Waypoint } from "#/components/landing/waypoint";
import "#/components/landing/glossary.css";

type Term = {
	key: string; // node face + readout etch
	title: string; // display term
	lede: string; // opening sentence (the "what")
	body: string; // the rest of the one-liner (the "how")
};

// Locked copy — #34 resolution, verbatim. Order descends familiar ->
// internal (the reader earns each word). Do not reword here.
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

// Real shape, not a tidy three: HQ over TWO porters (one per server) with
// FIVE trays fanned across them (3 on server 01, 2 on server 02) — the
// multi-server fact made literal. Every node maps to its coined term:
// HQ -> HQ, either porter -> Porter, any tray -> Tray.
type NodeRef = { key: string; term: number };

const HQ_NODE: NodeRef = { key: "hq", term: 0 };
const PORTERS: { key: string; sub: string; trays: string[] }[] = [
	{ key: "p1", sub: "SERVER 01", trays: ["ANALYTICS", "DATABASE", "EMAIL"] },
	{ key: "p2", sub: "SERVER 02", trays: ["PAYMENTS", "UPTIME"] },
];

export function Glossary() {
	const [expanded, setExpanded] = useState(false);
	const [active, setActive] = useState<NodeRef>(HQ_NODE);
	const term = TERMS[active.term];

	const nodeCls = (key: string, base: string) =>
		`${base}${active.key === key ? ` ${base}-active` : ""}`;

	return (
		<section
			className="lp-section lp-band glp-tree-sec"
			id="wp-terms"
			aria-label="The vocabulary"
		>
			<Waypoint index="08" label="TERMS" />

			{!expanded ? (
				<button
					type="button"
					className="glp-collapsed"
					onClick={() => setExpanded(true)}
					aria-expanded={false}
				>
					<span className="glp-caret" aria-hidden="true">
						▸
					</span>
					<span className="lp-etch glp-collapsed-label">
						THREE WORDS ALFREDO USES
					</span>
					<span className="lp-etch glp-collapsed-cue">OPEN</span>
				</button>
			) : (
				<>
					<h2 className="lp-h2">The words, wired up.</h2>
					<p className="lp-etch glp-tree-hint" aria-hidden="true">
						TAP A NODE TO READ IT
					</p>

					<div className="glp-tree">
						{/* HQ */}
						<button
							type="button"
							className={nodeCls("hq", "glp-tnode glp-tnode-hq")}
							onClick={() => setActive(HQ_NODE)}
						>
							<span className="glp-tnode-dash" aria-hidden="true" />
							<span className="glp-tnode-face">HQ</span>
						</button>
						<div className="glp-trunk" aria-hidden="true" />

						{/* two porters, each fanning to its trays */}
						<div className="glp-porter-row">
							{PORTERS.map((p) => (
								<div className="glp-porter-col" key={p.key}>
									<button
										type="button"
										className={nodeCls(p.key, "glp-tnode glp-tnode-porter")}
										onClick={() => setActive({ key: p.key, term: 1 })}
									>
										<span className="glp-tnode-dash" aria-hidden="true" />
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
						<span className="glp-caret" aria-hidden="true">
							▾
						</span>{" "}
						CLOSE
					</button>
				</>
			)}
		</section>
	);
}
