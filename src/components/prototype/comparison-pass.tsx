// PROTOTYPE — throwaway (wayfinder #43, comparison section design). The
// "can't what I already use do this?" section, placed between Every day
// after and the founder note per #41 decision 3. Switchable via
// ?compare=a|b|c on the real page (dev builds only); param absent = the
// current page (no comparison section), the "does it earn its place"
// control. Three structurally different variants, all built against the
// locked five-block cast from #65 (BY HAND · COOLIFY/DOKPLOY ·
// GRAFANA/DATADOG · VERCEL/CLOUDFLARE · SUPABASE) and the non-adversarial
// keep -> adds -> stay-put-if register locked in #41:
//
//   e "Comparison table" — CURRENT DIRECTION (operator round 5): pick ONE
//        competitor and see Alfredo vs just that one, inverted — capabilities
//        are the columns, the two products are the rows. Status is EFFORT:
//        green = automatic, half-amber = manual, grey = not possible (never a
//        bare ✓/✗ — still qualified per #41). Alfredo deploys on its own (no
//        Coolify dependency). Every competitor's row stays in the DOM (AEO);
//        CSS hides the unpicked ones. Alfredo is the highlighted row. e is
//        the default.
//   d "How does it compare to ___?" — operator round 3:
//        the green product name in "How does Alfredo compare to ___?" IS the
//        selector — a toggle that cycles products and carries its own
//        progress-bar underline; no chip row. Below it, ONE fixed-height
//        card per product (same reserved space, no jump) that contrasts the
//        product against Alfredo (them -> with Alfredo) foregrounding the
//        USP, with a per-product accent + battleground axis word so each
//        reads uniquely. Auto-rotates every 10s until the reader clicks.
//        No "by hand" — a chore is not a product. a/b/c kept for reference.
//
//   a "Where are you now?" — the reader picks their current SITUATION from
//        a row of bone keycaps; the pressed cap reveals its full answer
//        (keep -> adds -> stay put if). Five situation groups. Answer is
//        the reader's own frame ("I wire it by hand"), not a vs-grid.
//   b "It plays nice"      — WINNER-candidate for AEO: one static honest
//        prose block, no interaction, one plain relationship sentence per
//        block, a section-level "who should not use Alfredo" line, and a
//        row of /compare subpage links for depth. Nothing hides, nothing
//        toggles — the whole answer is in the DOM and on screen.
//   c "Bring your stack"   — per-TOOL keycaps (eight named products, not
//        five situation groups); each cap leads with its one plain
//        relationship sentence, then keep / adds / stay-put. Finer grain
//        than a, tool-first instead of situation-first.
//
// Railway and Better-T-Stack are subpage-only cast (#65): they get /compare
// links but no on-page answer block. The section-level "who should not use
// Alfredo" list (#63 §5.4) renders under every variant.
//
// AEO guard (#39 §4): every answer's full content is rendered in the DOM
// regardless of interaction. a and c render all panels once and toggle
// visibility by CSS; b is fully static. No JS-injected-on-click copy, and
// no duplicated hidden copy that could drift.
//
// Copy note: #14 locks page copy, so every doubt line, keep/adds/stay-put
// sentence and relationship sentence here is a copy PROPOSAL for the
// operator, distilled from docs/research/64-landscape-scoring.md (pricing
// stamped 2026-07-18, re-verify before ship). No SIMULATED etch: this is
// prose, not a product-looking screenshot (honesty rule scoped per #15).
// Waypoint index "04" is a placeholder — at build the founder note and
// everything after renumber +1 (#41 decision 3). Remove with
// comparison-pass.css.
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "#/components/landing/use-prefers-reduced-motion";
import { Waypoint } from "#/components/landing/waypoint";
import "#/components/prototype/comparison-pass.css";

export type CompareVariant = "a" | "b" | "c" | "d" | "e";

const ORDER: (CompareVariant | null)[] = [null, "e", "d", "a", "b", "c"];
const NAMES: Record<CompareVariant, string> = {
	a: "Where are you now?",
	b: "It plays nice",
	c: "Bring your stack",
	d: "How does it compare to…",
	e: "Comparison table",
};

/* ------------------------- the content ------------------------- */
// Five locked answer blocks (#65). Each carries the reader's situation
// framing (variant a), the honest keep/adds/stay-put body, a plain
// relationship sentence (variant b/c lead), and the /compare subpages it
// covers. Content distilled from #64 cast records.

type Block = {
	key: string;
	situation: string; // variant a keycap: the reader's own frame
	tools: string; // sub-line under the situation cap
	doubt: string; // the "but can't X do that?" thought, written out
	keep: string;
	adds: string;
	stayPut: string;
	relationship: string; // one plain sentence (variant b/c lead)
	links: { name: string; slug: string }[];
};

const BLOCKS: Block[] = [
	{
		key: "byhand",
		situation: "I WIRE IT BY HAND",
		tools: "The status quo",
		doubt: "Can't I just set all of this up myself?",
		keep: "You already can. Everything Alfredo does, you can do by hand, and many people should.",
		adds: "Alfredo does the wiring once and keeps it running, so you stop paying the same setup and the same dashboard-checking in your own time on every new project.",
		stayPut:
			"Stay by hand if you enjoy the wiring, or you ship one project and never need a second view across them.",
		relationship: "Alfredo is the by-hand setup, done once and kept running.",
		links: [],
	},
	{
		key: "deploy",
		situation: "I USE A SELF-HOST PAAS",
		tools: "Coolify · Dokploy",
		doubt:
			"Can't Coolify or Dokploy already deploy all my projects on my servers?",
		keep: "Your servers and your deploy engine. Alfredo runs on top of Coolify, so that part of your stack stays exactly as it is.",
		adds: "Wiring at project creation (auth, email, database, analytics, payments configured, secrets moved, integrations reused across projects) and one view across every project. Neither Coolify nor Dokploy has that layer.",
		stayPut:
			"Stay put if you are fine connecting integrations yourself and do not want a cross-project view, or you will not put an early prototype in front of your deploys.",
		relationship:
			"Alfredo runs on top of Coolify; Dokploy solves the same deploy problem from below.",
		links: [
			{ name: "vs Coolify", slug: "coolify" },
			{ name: "vs Dokploy", slug: "dokploy" },
		],
	},
	{
		key: "watch",
		situation: "I WATCH A DASHBOARD",
		tools: "Grafana · Datadog",
		doubt: "Isn't this just a dashboard Grafana or Datadog already gives me?",
		keep: "Your Grafana if you run one, and Datadog where you need depth. Alfredo does not attempt deep APM, tracing, or log search.",
		adds: "The cross-project view assembled for you. Grafana makes you build it and maintain it; Datadog rents it by the host and never runs on your servers. Alfredo also deploys and wires the projects it watches, which neither one does.",
		stayPut:
			"Stay put if you already run a happy Grafana or Prometheus stack, or you need deep APM, tracing, or log search. An HQ dashboard is not that.",
		relationship:
			"Alfredo ships the dashboard part assembled and on your servers; it does not replace the deep end that Grafana and Datadog own.",
		links: [
			{ name: "vs Grafana", slug: "grafana" },
			{ name: "vs Datadog", slug: "datadog" },
		],
	},
	{
		key: "cloud",
		situation: "I DEPLOY TO A CLOUD",
		tools: "Vercel · Cloudflare",
		doubt: "Can't I just put everything on Vercel or Cloudflare?",
		keep: "Any project you leave there. Nothing in Alfredo depends on them, and they deploy well.",
		adds: "Your own servers, a flat cost shape, integration wiring at creation, and one view across all your projects instead of one platform's own metrics.",
		stayPut:
			"Stay put if you want zero servers and never want to think about ops. That is a reasonable want, and it is not what Alfredo is.",
		relationship:
			"Vercel and Cloudflare rent you the deploy half; Alfredo self-hosts both halves, with the opposite trade-offs.",
		links: [
			{ name: "vs Vercel", slug: "vercel" },
			{ name: "vs Cloudflare", slug: "cloudflare" },
		],
	},
	{
		key: "backend",
		situation: "I USE A BACKEND BUNDLE",
		tools: "Supabase",
		doubt: "Doesn't Supabase already wire auth, database and storage for me?",
		keep: "Supabase in any project that uses it. Alfredo wires a different bundle and does not migrate yours.",
		adds: "Deploys the whole project on your servers, wires beyond the backend (email, analytics, payments, uptime), and gives one view across all your projects instead of one backend's console.",
		stayPut:
			"Stay put if you need a deep managed Postgres backend right now. Nothing Alfredo provisions matches that depth.",
		relationship:
			"Supabase gives one project a backend; Alfredo wires and watches all of your projects, and the two can coexist.",
		links: [{ name: "vs Supabase", slug: "supabase" }],
	},
];

// The section-level honesty block (#63 §5.4), assembled from the stay-put-if
// lines into one list rather than repeated per block.
const NOT_FOR_YOU =
	"Skip Alfredo if you enjoy wiring each project yourself, if you want zero servers and never think about ops, if you already run a happy Grafana or Datadog setup, or if you need deep APM, tracing, or a managed Postgres backend today. And Alfredo is an early, unproven prototype. Every tool above is the mature, proven thing.";

// Per-tool rows for variants c and d. stayPut carries the #41-decision-5
// honesty close on every on-page answer; tag is the variant-d "together (or
// as a replacement)" framing etch; label is the display name for the
// heading blank ("compare to Coolify?").
type Tool = {
	name: string;
	slug: string | null;
	label: string; // heading-blank form, e.g. "Coolify", "doing it by hand"
	tag: string; // variant-d framing etch: use together / instead / replaces
	relationship: string;
	keep: string;
	adds: string;
	stayPut: string;
};

const TOOLS: Tool[] = [
	{
		name: "BY HAND",
		slug: null,
		label: "doing it by hand",
		tag: "IT DOES THE CHORE FOR YOU",
		relationship: "Alfredo is the by-hand setup, done once and kept running.",
		keep: "You keep the control. Everything here, you could do yourself.",
		adds: "Alfredo pays the setup and the checking once instead of on every new project.",
		stayPut:
			"Stay by hand if you enjoy the wiring, or you ship one project and never need a cross-project view.",
	},
	{
		name: "COOLIFY",
		slug: "coolify",
		label: "Coolify",
		tag: "USE THEM TOGETHER",
		relationship: "Alfredo runs on top of Coolify; it does not replace it.",
		keep: "Your servers and your deploy engine. Coolify is Alfredo's substrate.",
		adds: "Wiring at creation and one view across projects, which Coolify has no equivalent for.",
		stayPut:
			"Stay put if you are fine wiring integrations yourself and do not want a cross-project view.",
	},
	{
		name: "DOKPLOY",
		slug: "dokploy",
		label: "Dokploy",
		tag: "ON TOP, OR INSTEAD",
		relationship:
			"Dokploy solves the same deploy problem as Alfredo's substrate; Alfredo's wiring and dashboard sit above it.",
		keep: "Dokploy as your deploy engine, if it already is one.",
		adds: "The wiring and HQ layer Dokploy does not reach. Said plainly: adopting Alfredo means Coolify as substrate, a real switch.",
		stayPut:
			"Stay put if Dokploy already deploys your projects and deploys are your main need.",
	},
	{
		name: "GRAFANA",
		slug: "grafana",
		label: "Grafana",
		tag: "ALONGSIDE, OR INSTEAD",
		relationship:
			"Grafana can be built into most of what Alfredo ships assembled; Alfredo also deploys, which Grafana never does.",
		keep: "Your Grafana and your deep custom dashboards. Alfredo does not replace them.",
		adds: "The assembled cross-project view without the assembly, plus the deploy and wiring side Grafana never touches.",
		stayPut:
			"Stay put if you already run a happy Grafana or Prometheus stack. You have paid the assembly cost already.",
	},
	{
		name: "DATADOG",
		slug: "datadog",
		label: "Datadog",
		tag: "REPLACES THE DASHBOARD",
		relationship:
			"Alfredo covers the dashboard part of Datadog for many small self-hosted projects; not the deep tracing, and it deploys.",
		keep: "Datadog where you need depth. Alfredo does not attempt APM or log search.",
		adds: "The same one-view idea at portfolio scale, on your servers, at flat cost, plus deploying and wiring the projects it watches.",
		stayPut:
			"Stay put if you need deep APM, tracing, or log search. An HQ dashboard is not that.",
	},
	{
		name: "VERCEL",
		slug: "vercel",
		label: "Vercel",
		tag: "THE SELF-HOSTED SWAP",
		relationship:
			"Vercel rents you the deploy half; Alfredo self-hosts both halves with opposite trade-offs.",
		keep: "Any project you leave on Vercel. Nothing in Alfredo depends on it.",
		adds: "Your own servers, a flat cost shape, integration wiring at creation, and one view across all projects.",
		stayPut:
			"Stay put if you want zero servers and never want to think about ops.",
	},
	{
		name: "CLOUDFLARE",
		slug: "cloudflare",
		label: "Cloudflare",
		tag: "THE SELF-HOSTED SWAP",
		relationship:
			"Cloudflare rents the deploy half per project; Alfredo self-hosts both halves.",
		keep: "Any project you run on Workers or Pages. Bindings stay yours.",
		adds: "Self-hosted deploys, wiring beyond per-project bindings, and one cross-project view.",
		stayPut:
			"Stay put if you want zero servers and a generous free tier for small projects.",
	},
	{
		name: "SUPABASE",
		slug: "supabase",
		label: "Supabase",
		tag: "WIRED ALONGSIDE",
		relationship:
			"Supabase gives one project a backend; Alfredo wires and watches all of them.",
		keep: "Supabase in any project that uses it. Alfredo does not migrate your backend.",
		adds: "Deploys the whole project on your servers, wires beyond the backend, and one view across all projects.",
		stayPut: "Stay put if you need a deep managed Postgres backend right now.",
	},
];

// Subpage-only cast (#65): named on their own /compare pages but not given an
// on-page answer block. Railway demotes here (doubt 12, below every 15+
// player); Better-T-Stack's "use both" page is protected (#41 decision 4).
// Surfaced only as deeper-reading links, never as an on-page cast member.
const SUBPAGE_ONLY: { name: string; slug: string }[] = [
	{ name: "vs Railway", slug: "railway" },
	{ name: "vs Better-T-Stack", slug: "better-t-stack" },
];

/** The one place the /compare slug scheme lives, so a change is one edit. */
const subpageHref = (slug: string) => `/compare/alfredo-${slug}`;

// Variant-d data: a per-product head-to-head foregrounding the USP. Each row
// is a single sharp contrast on the one axis where that product most differs
// (`axis`), a "them" line and an "Alfredo" line, and a verdict. `mode` drives
// the card accent so complements (green, use together) and alternatives
// (amber, replaces) read differently at a glance. No "by hand" — a chore is
// not a product. Distilled from docs/research/64-landscape-scoring.md.
type Comparison = {
	name: string; // selector / them-side label
	label: string; // heading-blank form ("Coolify")
	slug: string;
	mode: "together" | "replaces" | "both";
	axis: string; // the battleground word, unique per card
	them: string; // what the product gives you
	alfredo: string; // the delta Alfredo adds or changes
	verdict: string; // one crisp closing line
};

const COMPARISONS: Comparison[] = [
	{
		name: "COOLIFY",
		label: "Coolify",
		slug: "coolify",
		mode: "together",
		axis: "WIRING",
		them: "Deploys your apps and databases to your own servers, with a large one-click catalogue.",
		alfredo:
			"Runs on top of Coolify, then wires auth, email, database, payments and analytics into every project and reuses them across all of them.",
		verdict:
			"Use them together. Alfredo is the wiring and operations layer above your deploys.",
	},
	{
		name: "DOKPLOY",
		label: "Dokploy",
		slug: "dokploy",
		mode: "both",
		axis: "THE LAYER ABOVE",
		them: "Deploys containers to your VPS with clean, fast tooling.",
		alfredo:
			"Adds per-project wiring and one cross-project dashboard on top. Its deploy engine is Coolify, so switching is a real move.",
		verdict:
			"The same deploy problem, a different engine. Alfredo's value is the layer above it.",
	},
	{
		name: "GRAFANA",
		label: "Grafana",
		slug: "grafana",
		mode: "both",
		axis: "ASSEMBLY",
		them: "Shows anything you wire up: exporters, data sources and dashboards you build and maintain per project.",
		alfredo:
			"Ships the cross-project view already assembled, and deploys the projects it watches. Grafana never deploys.",
		verdict:
			"Grafana is the construction kit. Alfredo is the finished view, with less depth.",
	},
	{
		name: "DATADOG",
		label: "Datadog",
		slug: "datadog",
		mode: "replaces",
		axis: "COST & OWNERSHIP",
		them: "One polished dashboard over everything, business signals included, priced per host and per module on their cloud.",
		alfredo:
			"Runs the same single view on your own servers at a flat cost, and deploys the projects too. No deep APM, tracing or log search.",
		verdict:
			"Replaces the dashboard for a fleet of small projects, not the deep tracing.",
	},
	{
		name: "VERCEL",
		label: "Vercel",
		slug: "vercel",
		mode: "replaces",
		axis: "OWNERSHIP",
		them: "Rents you a polished deploy platform with preview builds and usage-based pricing.",
		alfredo:
			"Self-hosts both the deploy and the operations layer on hardware you own, at a flat cost.",
		verdict: "The self-hosted alternative, with the opposite trade-offs.",
	},
	{
		name: "CLOUDFLARE",
		label: "Cloudflare",
		slug: "cloudflare",
		mode: "replaces",
		axis: "OWNERSHIP",
		them: "Deploys Workers and Pages on their edge, with per-project bindings to D1, KV and R2.",
		alfredo:
			"Self-hosts deploys and wires integrations as real running services, unified across every project.",
		verdict: "The self-hosted alternative to rented edge compute.",
	},
	{
		name: "SUPABASE",
		label: "Supabase",
		slug: "supabase",
		mode: "together",
		axis: "SCOPE",
		them: "Wires one project a strong backend: Postgres, auth and storage.",
		alfredo:
			"Wires a full stack into every project (email, analytics, payments, uptime) and watches them all from one dashboard.",
		verdict:
			"A backend for one project against wiring and operations across all of them. They coexist.",
	},
];

const MODE_TAG: Record<Comparison["mode"], string> = {
	together: "USE THEM TOGETHER",
	replaces: "THE SELF-HOSTED SWAP",
	both: "ON TOP, OR INSTEAD",
};

// Variant-e data: a single head-to-head (Alfredo vs one selected product),
// laid out inverted — capabilities are columns, the two products are rows.
// Status is about EFFORT, not just presence (operator round 5):
//   auto   (green)       — the tool does it for you, no manual setup
//   manual (half amber)  — achievable, but you wire/build/maintain it
//   none   (grey/empty)  — the tool genuinely cannot do it
// Never a bare mark: every cell keeps a short qualifier (#41 anti-strawman),
// and every competitor keeps its real green (automatic) wins so no row is
// all-grey. Cells distilled from docs/research/64-landscape-scoring.md
// (pricing stamped 2026-07-18, re-verify before ship). Alfredo deploys on
// its own — no Coolify dependency (operator round 5). "By hand" omitted.
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

const HEAD = {
	kicker: "BUT CAN'T WHAT I ALREADY USE DO THIS?",
	h2: "You probably already use something that does a piece of this.",
	intro:
		"Fair question. Most of these are tools we like, and some Alfredo runs on. Here is the honest version: what you keep, what Alfredo adds, and when you should stay exactly where you are.",
};

/* ---------------------- variant state ------------------------ */

/** Reads ?compare= on mount (dev only) and mirrors changes back to the URL. */
export function useComparePass(): [
	CompareVariant | null,
	(v: CompareVariant | null) => void,
] {
	const [variant, setVariant] = useState<CompareVariant | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("compare");
		if (v === "a" || v === "b" || v === "c" || v === "d" || v === "e")
			setVariant(v);
	}, []);

	const update = (v: CompareVariant | null) => {
		setVariant(v);
		const q = new URLSearchParams(window.location.search);
		if (v === null) q.delete("compare");
		else q.set("compare", v);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [variant, update];
}

/* --------------- variant a: "Where are you now?" -------------- */
// Situation keycaps; the pressed cap reveals its full answer. Every answer
// panel is rendered in the DOM (AEO guard); CSS shows only the active one.

function CompareSituations() {
	const [active, setActive] = useState(BLOCKS[0].key);
	return (
		<div className="cmp-sit">
			<div className="cmp-sit-prompt lp-etch">WHERE ARE YOU NOW?</div>
			<div
				className="cmp-sit-caps"
				role="tablist"
				aria-label="Your current setup"
			>
				{BLOCKS.map((b) => (
					<button
						key={b.key}
						type="button"
						role="tab"
						aria-selected={active === b.key}
						className={`cmp-sit-cap${active === b.key ? " cmp-sit-cap-on" : ""}`}
						onClick={() => setActive(b.key)}
					>
						<span className="cmp-sit-cap-label">{b.situation}</span>
						<span className="lp-etch cmp-sit-cap-tools">{b.tools}</span>
					</button>
				))}
			</div>
			<div className="cmp-sit-stage">
				{BLOCKS.map((b) => (
					<article
						key={b.key}
						className={`cmp-answer${active === b.key ? " cmp-answer-on" : ""}`}
						aria-hidden={active !== b.key}
					>
						<p className="cmp-answer-doubt">“{b.doubt}”</p>
						<dl className="cmp-answer-body">
							<dt className="lp-etch cmp-answer-term cmp-term-keep">
								YOU KEEP
							</dt>
							<dd className="cmp-answer-def">{b.keep}</dd>
							<dt className="lp-etch cmp-answer-term cmp-term-adds">
								ALFREDO ADDS
							</dt>
							<dd className="cmp-answer-def">{b.adds}</dd>
							<dt className="lp-etch cmp-answer-term cmp-term-stay">
								STAY PUT IF
							</dt>
							<dd className="cmp-answer-def cmp-answer-stay">{b.stayPut}</dd>
						</dl>
						{b.links.length > 0 && (
							<p className="cmp-answer-links">
								{b.links.map((l) => (
									<a
										key={l.slug}
										className="lp-etch cmp-link"
										href={subpageHref(l.slug)}
									>
										{l.name} →
									</a>
								))}
							</p>
						)}
					</article>
				))}
			</div>
		</div>
	);
}

/* ---------------- variant b: "It plays nice" ------------------ */
// Fully static: one honest prose block, one relationship sentence per group,
// section-level "not for you" line, and a subpage link row. Nothing hides.

function ComparePlaysNice() {
	return (
		<div className="cmp-prose">
			<ul className="cmp-prose-list">
				{BLOCKS.map((b) => (
					<li key={b.key} className="cmp-prose-item">
						<span className="lp-etch cmp-prose-tools">{b.tools}</span>
						<p className="cmp-prose-rel">{b.relationship}</p>
						<p className="cmp-prose-adds">
							<span className="cmp-prose-lead">You keep it. </span>
							{b.adds}
						</p>
					</li>
				))}
			</ul>
			<div className="cmp-prose-links">
				<span className="lp-etch cmp-prose-links-label">GO DEEPER</span>
				<div className="cmp-prose-links-row">
					{[...BLOCKS.flatMap((b) => b.links), ...SUBPAGE_ONLY].map((l) => (
						<a
							key={l.slug}
							className="lp-etch cmp-link"
							href={subpageHref(l.slug)}
						>
							{l.name} →
						</a>
					))}
				</div>
			</div>
		</div>
	);
}

/* ------------- section-level honesty block (#63 §5.4) --------- */
// One "who should NOT use Alfredo" list, assembled from the stay-put-if
// lines. Section-level, not per-block, so it renders under every variant.

function NotForYou() {
	return (
		<p className="cmp-notfor">
			<span className="lp-etch cmp-notfor-label">NOT FOR YOU IF</span>
			{NOT_FOR_YOU}
		</p>
	);
}

/* -------------- variant c: "Bring your stack" ---------------- */
// Per-tool keycaps; each leads with its plain relationship sentence, then
// keep / adds / stay-put. Every panel is rendered once and toggled by CSS
// (like variant a) — so all eight answers are in the DOM for the AEO guard
// with no duplicated hidden copy to drift.

function CompareBringStack() {
	const [active, setActive] = useState(TOOLS[0].name);
	return (
		<div className="cmp-stack">
			<div className="cmp-stack-prompt lp-etch">
				WHAT'S IN YOUR STACK TODAY?
			</div>
			<div
				className="cmp-stack-caps"
				role="tablist"
				aria-label="Tools you already use"
			>
				{TOOLS.map((t) => (
					<button
						key={t.name}
						type="button"
						role="tab"
						aria-selected={active === t.name}
						className={`lp-etch cmp-stack-cap${active === t.name ? " cmp-stack-cap-on" : ""}`}
						onClick={() => setActive(t.name)}
					>
						{t.name}
					</button>
				))}
			</div>
			<div className="cmp-stack-stage">
				{TOOLS.map((t) => (
					<article
						key={t.name}
						className={`cmp-stack-panel${active === t.name ? " cmp-stack-panel-on" : ""}`}
						aria-hidden={active !== t.name}
					>
						<p className="cmp-stack-rel">{t.relationship}</p>
						<div className="cmp-stack-body">
							<div className="cmp-stack-col">
								<span className="lp-etch cmp-answer-term cmp-term-keep">
									YOU KEEP
								</span>
								<p className="cmp-stack-def">{t.keep}</p>
							</div>
							<div className="cmp-stack-col">
								<span className="lp-etch cmp-answer-term cmp-term-adds">
									ALFREDO ADDS
								</span>
								<p className="cmp-stack-def">{t.adds}</p>
							</div>
						</div>
						<p className="cmp-stack-stay">
							<span className="lp-etch cmp-answer-term cmp-term-stay">
								STAY PUT IF
							</span>
							<span className="cmp-stack-stay-text">{t.stayPut}</span>
						</p>
						{t.slug && (
							<p className="cmp-answer-links">
								<a className="lp-etch cmp-link" href={subpageHref(t.slug)}>
									The full {t.name.toLowerCase()} comparison →
								</a>
							</p>
						)}
					</article>
				))}
			</div>
		</div>
	);
}

/* ----------- variant d: "How does it compare to ___?" -------- */
// Operator direction: a "How does Alfredo compare to ___?" heading whose
// blank is the selection, a clean selector, and ONE fixed-height pitch slot
// (same space reserved for every choice, no layout jump) framing Alfredo
// as a companion or a replacement. Auto-rotates every 10s with a progress
// bar under the selector until the reader picks manually. All pitch panels
// stay in the DOM (AEO guard); reduced motion pins the first and hides the
// bar. Selector lists the eight on-page-cast products (Railway/Better-T-
// Stack stay subpage-only).

const ROTATE_MS = 10000;

function CompareCompareTo() {
	const reduced = usePrefersReducedMotion();
	const [idx, setIdx] = useState(0);
	// The first manual interaction stops the auto-rotation; the toggle then
	// advances by click/keyboard only.
	const [manual, setManual] = useState(false);
	// Bumped each auto-advance so the progress fill animation restarts in sync.
	const [cycle, setCycle] = useState(0);

	useEffect(() => {
		if (reduced || manual) return;
		const id = setInterval(() => {
			setIdx((i) => (i + 1) % COMPARISONS.length);
			setCycle((c) => c + 1);
		}, ROTATE_MS);
		return () => clearInterval(id);
	}, [reduced, manual]);

	// The green name IS the selector: clicking (or arrowing) it advances to
	// the next product and takes over from the auto-rotation.
	const advance = (dir: 1 | -1) => {
		setManual(true);
		setIdx((i) => (i + dir + COMPARISONS.length) % COMPARISONS.length);
	};
	// Only arrows here — Enter/Space already fire the button's onClick
	// natively, so handling them again would advance twice.
	const onToggleKey = (e: ReactKeyboardEvent) => {
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			advance(-1);
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			advance(1);
		}
	};

	const rotating = !reduced && !manual;
	const current = COMPARISONS[idx];

	return (
		<div className="cmp-cmp">
			<h2 className="cmp-cmp-head">
				How does Alfredo compare to{" "}
				<button
					type="button"
					className="cmp-cmp-toggle"
					onClick={() => advance(1)}
					onKeyDown={onToggleKey}
					aria-label={`Comparing against ${current.label}. Activate to see the next product.`}
				>
					<span key={idx} className="cmp-cmp-blank">
						{current.label}
					</span>
					{/* Progress bar lives inside the toggle, as its underline. */}
					<span className="cmp-cmp-underline" aria-hidden="true">
						{rotating ? (
							<span
								key={cycle}
								className="cmp-cmp-fill"
								style={{ animationDuration: `${ROTATE_MS}ms` }}
							/>
						) : (
							<span className="cmp-cmp-fill cmp-cmp-fill-static" />
						)}
					</span>
					<span className="cmp-cmp-caret" aria-hidden="true">
						⇆
					</span>
				</button>
				?
			</h2>

			{/* Fixed-height contrast card: same space for every product, all in
			    the DOM (AEO guard); accent + axis word differ per product. */}
			<div className="cmp-cmp-stage">
				{COMPARISONS.map((c, i) => (
					<article
						key={c.name}
						className={`cmp-cmp-pitch cmp-mode-${c.mode}${idx === i ? " cmp-cmp-pitch-on" : ""}`}
						aria-hidden={idx !== i}
					>
						<div className="cmp-cmp-toprow">
							<span className="lp-etch cmp-cmp-mode">{MODE_TAG[c.mode]}</span>
							<span className="cmp-cmp-axis" aria-hidden="true">
								{c.axis}
							</span>
						</div>
						<div className="cmp-cmp-contrast">
							<div className="cmp-cmp-side cmp-cmp-them">
								<span className="lp-etch cmp-cmp-side-label">{c.name}</span>
								<p className="cmp-cmp-side-text">{c.them}</p>
							</div>
							<span className="cmp-cmp-arrow" aria-hidden="true">
								→
							</span>
							<div className="cmp-cmp-side cmp-cmp-us">
								<span className="lp-etch cmp-cmp-side-label">WITH ALFREDO</span>
								<p className="cmp-cmp-side-text">{c.alfredo}</p>
							</div>
						</div>
						<p className="cmp-cmp-verdict">{c.verdict}</p>
						<a className="lp-etch cmp-link" href={subpageHref(c.slug)}>
							The full {c.label} comparison →
						</a>
					</article>
				))}
			</div>
		</div>
	);
}

/* -------------- variant e: the comparison table -------------- */
// One head-to-head at a time: pick a competitor, and the table shows Alfredo
// against just that one, inverted — capabilities are the columns, the two
// products are the rows (operator round 5). A real <table>; Alfredo is the
// highlighted row; status is effort, not presence (auto / manual / none).
// AEO: every competitor's row is rendered in the DOM, CSS only hides the
// unselected ones, so all 56 cells stay in the server HTML.

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

/* ---------- the comparison section with a variant mounted ---------- */

export function CompareSection({ variant }: { variant: CompareVariant }) {
	return (
		<section className="lp-section cmp-section" id="wp-compare">
			<Waypoint index="04" label="KEEP" />
			<p className="lp-etch cmp-kicker">{HEAD.kicker}</p>
			{/* d brings its own "How does Alfredo compare to ___?" heading, so
			    the generic section H2/intro would just compete with it. */}
			{variant !== "d" && (
				<>
					<h2 className="lp-h2">{HEAD.h2}</h2>
					<p className="lp-body">{HEAD.intro}</p>
				</>
			)}
			{variant === "e" && <CompareTable />}
			{variant === "d" && <CompareCompareTo />}
			{variant === "a" && <CompareSituations />}
			{variant === "b" && <ComparePlaysNice />}
			{variant === "c" && <CompareBringStack />}
			{/* Section-level honesty close (#63 §5.4), under every variant. */}
			<NotForYou />
		</section>
	);
}

/* ---------------------- switcher bar ------------------------- */

export function CompareSwitcher({
	current,
	onChange,
}: {
	current: CompareVariant | null;
	onChange: (v: CompareVariant | null) => void;
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
			// , / . rather than ledger's [ ] so two active bars don't co-cycle.
			if (e.key !== "," && e.key !== ".") return;
			const i = ORDER.indexOf(current);
			const next =
				e.key === "."
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
		<div className="cmp-switcher">
			<button
				type="button"
				onClick={() => cycle(-1)}
				aria-label="Previous comparison variant"
			>
				←
			</button>
			<span>
				{current === null
					? "COMPARE: OFF — , . to flip"
					: `COMPARE ${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button
				type="button"
				onClick={() => cycle(1)}
				aria-label="Next comparison variant"
			>
				→
			</button>
		</div>
	);
}
