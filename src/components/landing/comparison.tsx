// The "but can't what I already use do this?" section (wayfinder #74),
// placed between Every day after and the founder note (#41 decision 3) as
// waypoint 04 KEEP. Design locked as variant E "Comparison table" (#43):
// pick ONE competitor from the COMPARE AGAINST selector and see Alfredo
// against just that one, inverted — the seven #63 capability axes are the
// columns, the two products are the rows, Alfredo the highlighted row.
//
// Status is EFFORT, not presence (operator round 5): green = automatic,
// half-amber = manual, grey ring = not possible; never a bare ✓/✗, every
// cell keeps a short qualifier (#41 anti-strawman) and every competitor
// keeps its real green (automatic) wins so no row is all-grey. Pip shapes
// differ by more than hue (colour-blind-safe). Cast = Alfredo + the seven
// on-page products; Railway / Better-T-Stack stay subpage-only links.
//
// AEO (#39 §4): every competitor's row is rendered in the DOM; CSS hides the
// unselected ones, so all 56 cells stay in the server HTML. `VERIFIED JULY
// 2026` stamp sits over the #64-sourced cells.
//
// Coolify amendment (map note, 2026-07-19): Coolify/Dokploy are ordinary
// competitors and Alfredo's deploy is "Built in" — no "runs on top of
// Coolify" framing anywhere here.
//
// Copy is a #14 proposal distilled from docs/research/64-landscape-scoring.md
// (pricing stamped 2026-07-18). No SIMULATED etch: this is prose, not a
// product-looking screenshot (honesty rule scoped per #15).
import { useState } from "react";
import { Waypoint } from "#/components/landing/waypoint";
import "#/components/landing/comparison.css";

// A single head-to-head (Alfredo vs one selected product), laid out
// inverted — capabilities are columns, the two products are rows.
//   auto   (green)      — the tool does it for you, no manual setup
//   manual (half amber) — achievable, but you wire/build/maintain it
//   none   (grey ring)  — the tool genuinely cannot do it
type CellStatus = "auto" | "manual" | "none";
type Cell = { s: CellStatus; q: string };
type Column = {
	name: string;
	slug: string | null;
	alfredo?: boolean;
	cells: Cell[];
};

// Capability order shared by every column's `cells` array.
const AXES = [
	"Runs on your servers",
	"Deploys your projects",
	"Wires each project at birth",
	"One dashboard across projects",
	"Sees your business, not just CPU",
	"Works without assembly",
	"Flat cost for many projects",
];

const COLUMNS: Column[] = [
	{
		name: "Alfredo",
		slug: null,
		alfredo: true,
		cells: [
			{ s: "auto", q: "Your servers" },
			{ s: "auto", q: "Built in" },
			{ s: "auto", q: "The core" },
			{ s: "auto", q: "All projects" },
			{ s: "auto", q: "Included" },
			{ s: "auto", q: "Zero setup" },
			{ s: "auto", q: "Flat, your box" },
		],
	},
	{
		name: "Coolify",
		slug: "coolify",
		cells: [
			{ s: "auto", q: "Free OSS" },
			{ s: "auto", q: "Multi-server" },
			{ s: "manual", q: "You connect it" },
			{ s: "none", q: "Per project" },
			{ s: "none", q: "Infra only" },
			{ s: "manual", q: "Ops side is DIY" },
			{ s: "auto", q: "Free self-host" },
		],
	},
	{
		name: "Dokploy",
		slug: "dokploy",
		cells: [
			{ s: "auto", q: "Apache-2.0" },
			{ s: "auto", q: "Compose native" },
			{ s: "manual", q: "Do it yourself" },
			{ s: "none", q: "Per resource" },
			{ s: "none", q: "Infra only" },
			{ s: "manual", q: "Ops side is DIY" },
			{ s: "auto", q: "Free self-host" },
		],
	},
	{
		name: "Grafana",
		slug: "grafana",
		cells: [
			{ s: "auto", q: "AGPL OSS" },
			{ s: "none", q: "Never deploys" },
			{ s: "none", q: "Not its job" },
			{ s: "manual", q: "You build it" },
			{ s: "manual", q: "DIY data sources" },
			{ s: "manual", q: "Construction kit" },
			{ s: "auto", q: "Free OSS" },
		],
	},
	{
		name: "Datadog",
		slug: "datadog",
		cells: [
			{ s: "none", q: "SaaS only" },
			{ s: "none", q: "Never deploys" },
			{ s: "manual", q: "Per-account setup" },
			{ s: "auto", q: "Strongest today" },
			{ s: "manual", q: "Opt-in integrations" },
			{ s: "manual", q: "Agent + setup" },
			{ s: "none", q: "Per host, stacks" },
		],
	},
	{
		name: "Vercel",
		slug: "vercel",
		cells: [
			{ s: "none", q: "Not self-host" },
			{ s: "auto", q: "Great DX" },
			{ s: "manual", q: "Add-ons per project" },
			{ s: "none", q: "Own metrics only" },
			{ s: "none", q: "—" },
			{ s: "auto", q: "Deploy just works" },
			{ s: "manual", q: "Scales with use" },
		],
	},
	{
		name: "Cloudflare",
		slug: "cloudflare",
		cells: [
			{ s: "none", q: "Their edge" },
			{ s: "auto", q: "Workers / Pages" },
			{ s: "manual", q: "Per-project bindings" },
			{ s: "none", q: "Own analytics only" },
			{ s: "none", q: "—" },
			{ s: "auto", q: "Deploy just works" },
			{ s: "manual", q: "Generous free tier" },
		],
	},
	{
		name: "Supabase",
		slug: "supabase",
		cells: [
			{ s: "manual", q: "Docker, with gaps" },
			{ s: "manual", q: "Backend only" },
			// Supabase's real win: its bundle is provisioned for you (#64 §2.5).
			{ s: "auto", q: "Auth, DB, storage" },
			{ s: "none", q: "One backend" },
			{ s: "none", q: "—" },
			{ s: "manual", q: "Managed or Docker" },
			{ s: "manual", q: "$0–599/mo" },
		],
	},
];

const STATUS_LABEL: Record<CellStatus, string> = {
	auto: "automatic",
	manual: "manual",
	none: "not possible",
};

// The section-level honesty block (#63 §5.4), assembled from the stay-put-if
// lines into one list rather than repeated per block.
const NOT_FOR_YOU =
	"Skip Alfredo if you enjoy wiring each project yourself, if you want zero servers and never think about ops, if you already run a happy Grafana or Datadog setup, or if you need deep APM, tracing, or a managed Postgres backend today. And Alfredo is an early, unproven prototype. Every tool above is the mature, proven thing.";

const HEAD = {
	kicker: "BUT CAN'T WHAT I ALREADY USE DO THIS?",
	h2: "You probably already use something that does a piece of this.",
	intro:
		"Fair question. Most of these are tools we like and use ourselves. Here is the honest version: what you keep, what Alfredo adds, and when you should stay exactly where you are.",
};

/** The one place the /compare slug scheme lives, so a change is one edit. */
const subpageHref = (slug: string) => `/compare/alfredo-${slug}`;

const ALFREDO = COLUMNS[0];
const COMPETITORS = COLUMNS.slice(1);

function Pip({ status }: { status: CellStatus }) {
	return (
		<span
			className={`cmp-tbl-pip cmp-tbl-pip-${status}`}
			role="img"
			aria-label={STATUS_LABEL[status]}
		/>
	);
}

function TableRow({ col, rowType }: { col: Column; rowType: string }) {
	return (
		<tr className={`cmp-tbl-row cmp-tbl-row-${rowType}`}>
			<th scope="row" className="cmp-tbl-rowhead">
				{col.name}
			</th>
			{col.cells.map((cell, i) => (
				<td key={AXES[i]} className={`cmp-tbl-cell cmp-tbl-cell-${cell.s}`}>
					<Pip status={cell.s} />
					<span className="cmp-tbl-q">{cell.q}</span>
				</td>
			))}
		</tr>
	);
}

function CompareTable() {
	const [pick, setPick] = useState(COMPETITORS[0].name);

	return (
		<div className="cmp-tbl">
			<div
				className="cmp-tbl-picker"
				role="tablist"
				aria-label="Compare against"
			>
				<span className="lp-etch cmp-tbl-picker-label">COMPARE AGAINST</span>
				<div className="cmp-tbl-picker-opts">
					{COMPETITORS.map((c) => (
						<button
							key={c.name}
							type="button"
							role="tab"
							aria-selected={pick === c.name}
							className={`lp-etch cmp-tbl-opt${pick === c.name ? " cmp-tbl-opt-on" : ""}`}
							onClick={() => setPick(c.name)}
						>
							{c.name}
						</button>
					))}
				</div>
			</div>

			<div className="cmp-tbl-scroll">
				<table className="cmp-tbl-table">
					<caption className="lp-visually-hidden">
						Alfredo versus {pick} across seven capabilities: whether each is
						automatic, manual, or not possible.
					</caption>
					<thead>
						<tr>
							<th className="cmp-tbl-corner" scope="col">
								<span className="lp-etch">PRODUCT</span>
							</th>
							{AXES.map((axis) => (
								<th key={axis} scope="col" className="cmp-tbl-colhead">
									{axis}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						<TableRow col={ALFREDO} rowType="alf" />
						{/* All competitor rows stay in the DOM (AEO); the row class
						    below hides all but the picked one via CSS. */}
						{COMPETITORS.map((c) => (
							<TableRow
								key={c.name}
								col={c}
								rowType={pick === c.name ? "on" : "off"}
							/>
						))}
					</tbody>
				</table>
			</div>

			<div className="cmp-tbl-foot">
				<span className="cmp-tbl-legend">
					<span className="cmp-tbl-pip cmp-tbl-pip-auto" /> automatic
					<span className="cmp-tbl-pip cmp-tbl-pip-manual" /> manual
					<span className="cmp-tbl-pip cmp-tbl-pip-none" /> not possible
				</span>
				<span className="lp-etch cmp-tbl-stamp">VERIFIED JULY 2026</span>
			</div>

			<div className="cmp-tbl-links">
				{COMPETITORS.filter((c) => c.slug).map((c) => (
					<a
						key={c.slug}
						className="lp-etch cmp-link"
						href={subpageHref(c.slug as string)}
					>
						vs {c.name} →
					</a>
				))}
			</div>
		</div>
	);
}

// One "who should NOT use Alfredo" list, section-level per #63 §5.4.
function NotForYou() {
	return (
		<p className="cmp-notfor">
			<span className="lp-etch cmp-notfor-label">NOT FOR YOU IF</span>
			{NOT_FOR_YOU}
		</p>
	);
}

export function Comparison() {
	return (
		<section className="lp-section cmp-section" id="wp-compare">
			<Waypoint index="04" label="KEEP" />
			<p className="lp-etch cmp-kicker">{HEAD.kicker}</p>
			<h2 className="lp-h2">{HEAD.h2}</h2>
			<p className="lp-body">{HEAD.intro}</p>
			<CompareTable />
			<NotForYou />
		</section>
	);
}
