// Backing data for the nine /compare/alfredo-vs-<name> deep-dive subpages
// (wayfinder #75, cast locked in #65). Every field traces to the scored
// records in docs/research/64-landscape-scoring.md (§2 cast records, §3 and
// §6 for Railway/Cloudflare), applied against the #63 criteria: the seven
// capability axes, qualified prose cells (never bare ✓/✗), a plain
// relationship sentence (#63/#65; the #41 four-tag taxonomy is retired), and
// the non-adversarial frame — keep-first, every competitor keeps its real
// wins, closing on an honest "stay put if…".
//
// Coolify/Dokploy amendment (map note, 2026-07-19): they are ordinary
// competitors and Alfredo's deploy is "Built in" — no "runs on top of
// Coolify" / "its engine is Coolify" framing anywhere.
//
// Cell status is EFFORT, matching the on-page table (#74): auto = the tool
// does it for you, manual = achievable but you wire/build/maintain it, none =
// it genuinely cannot. Pricing and capability claims stamped 2026-07-18 from
// #64; re-verify numbers before any go-live.

export type CellStatus = "auto" | "manual" | "none";

export const STATUS_LABEL: Record<CellStatus, string> = {
	auto: "automatic",
	manual: "manual",
	none: "not possible",
};

// cell status → shared square-chip variant (.lp-sq, #76/#77): effort
// vocabulary maps onto the status vocabulary as auto=up, manual=partial,
// none=none
export const STATUS_SQ: Record<CellStatus, string> = {
	auto: "lp-sq-up",
	manual: "lp-sq-partial",
	none: "lp-sq-none",
};

// The seven #63 capability axes, in the order every cells[] array follows.
// Same labels as the on-page comparison table (#74) so the two never drift.
export const AXES = [
	"Runs on your servers",
	"Deploys your projects",
	"Wires each project at birth",
	"One dashboard across projects",
	"Sees your business, not just CPU",
	"Works without assembly",
	"Flat cost for many projects",
] as const;

export type Cell = { s: CellStatus; q: string };

// Alfredo's own column — constant across every subpage (the core claim set).
export const ALFREDO_CELLS: Cell[] = [
	{
		s: "auto",
		q: "Any VPS you can SSH into. Alfredo runs on your servers; it does not host your projects.",
	},
	{
		s: "auto",
		q: "Built in. Pick the integrations a project needs and deploy — there is no separate PaaS underneath.",
	},
	{
		s: "auto",
		q: "The core claim. Auth, email, database, analytics and payments are configured at creation, secrets are moved for you, and integrations already running are reused.",
	},
	{ s: "auto", q: "One HQ across every project you deploy." },
	{
		s: "auto",
		q: "Payments and email delivery sit next to traffic, errors and uptime — business signals, not just CPU.",
	},
	{
		s: "auto",
		q: "Zero setup — the cross-project view is assembled for you, not built.",
	},
	{
		s: "auto",
		q: "Flat: you pay for your own box, not per host, per project or per module.",
	},
];

export type Product = {
	slug: string;
	name: string;
	// The literal "but can't X do that for me?" thought (#63 §4.1).
	doubt: string;
	// One plain sentence on how Alfredo relates to X (#63 §4.8 / #65).
	relationship: string;
	// Seven qualified cells for X, in AXES order.
	cells: Cell[];
	youKeep: string;
	alfredoAdds: string;
	stayPutIf: string;
	realWins: string;
	// Per-route head (#58: each route declares its own; no root fallback).
	title: string;
	description: string;
};

export const PRODUCTS: Record<string, Product> = {
	coolify: {
		slug: "coolify",
		name: "Coolify",
		doubt: "Can't Coolify already deploy all my projects on my own servers?",
		relationship:
			"Coolify and Alfredo solve the same deploy problem on your own servers; Alfredo adds the wiring and one-HQ layer that sits above deploying.",
		cells: [
			{
				s: "auto",
				q: "Yes. Free and open source, self-hosted with no feature restrictions (coolify.io/pricing, 2026-07-18).",
			},
			{
				s: "auto",
				q: "Yes — apps, databases and 280+ one-click services, multi-server.",
			},
			{
				s: "manual",
				q: "No. One-click services come up as separate boxes; you connect auth, email, analytics and payments yourself, and nothing is shared between projects.",
			},
			{
				s: "none",
				q: "No. The dashboard is per project and covers deploys and infra.",
			},
			{
				s: "none",
				q: "No. CPU, logs and deploy status; no payments or email delivery.",
			},
			{
				s: "manual",
				q: "On the deploy side, yes; the cross-project ops view Alfredo describes does not exist in it.",
			},
			{
				s: "auto",
				q: "Free self-hosted; Coolify Cloud is $5/mo for 2 servers plus $3/mo per extra server (2026-07-18).",
			},
		],
		youKeep:
			"Coolify itself, if it is your deploy engine today — your servers and your deploy engine keep running, and nothing forces you off it.",
		alfredoAdds:
			"Wiring at project creation and one dashboard over all projects with business signals. Alfredo is an early, unproven prototype; Coolify is the proven part of many self-hosted stacks.",
		stayPutIf:
			"you are fine connecting integrations yourself and don't want a cross-project view — or you won't put a prototype in front of your deploys.",
		realWins:
			"Mature, widely used, a large service catalog, and an active community. It works today.",
		title: "Alfredo vs Coolify · Deploy plus wiring and one HQ",
		description:
			"Coolify deploys your projects on your own servers. Alfredo does too, and adds integration wiring at project creation and one dashboard across every project. What you keep, what Alfredo adds, and when to stay on Coolify.",
	},
	dokploy: {
		slug: "dokploy",
		name: "Dokploy",
		doubt: "Can't Dokploy do the same thing on my VPS?",
		relationship:
			"Dokploy solves the same deploy problem as Alfredo; Alfredo's wiring and dashboard layer sits above that problem, not inside it.",
		cells: [
			{ s: "auto", q: "Yes — open source, Apache-2.0." },
			{
				s: "auto",
				q: "Yes — Docker Compose native, database provisioning with backups, multi-server via Swarm.",
			},
			{ s: "manual", q: "No integration wiring and no shared services." },
			{
				s: "none",
				q: "No. Real-time CPU/memory/storage/network per resource; monitoring stops at the container boundary.",
			},
			{ s: "none", q: "No. Infra only." },
			{ s: "manual", q: "On the deploy side, yes." },
			{
				s: "auto",
				q: "Free OSS self-hosted; new paid Dokploy Cloud from $4.50/mo per server, Startup from $15/mo (2026-07-18).",
			},
		],
		youKeep: "Dokploy, if it is your deploy engine today.",
		alfredoAdds:
			"The wiring and HQ layer that has no equivalent in Dokploy. Adopting Alfredo alongside means running a second deploy stack or switching — a real cost, said plainly. Alfredo is a prototype; Dokploy deploys real projects today.",
		stayPutIf:
			"Dokploy already deploys your projects and deploys are your main need. Switching stacks to get a prototype's dashboard is hard to justify.",
		realWins: "Fast-growing, Docker Compose native, clean interface, free.",
		title: "Alfredo vs Dokploy · Same deploy problem, plus the layer above it",
		description:
			"Dokploy deploys your projects to your VPS. Alfredo deploys too, and adds the wiring and one-HQ layer Dokploy doesn't reach. What you keep, what Alfredo adds, and when to stay on Dokploy.",
	},
	vercel: {
		slug: "vercel",
		name: "Vercel",
		doubt: "Can't I just put everything on Vercel?",
		relationship:
			"Vercel rents you the deploy half; Alfredo self-hosts both halves, with the opposite trade-offs.",
		cells: [
			{
				s: "none",
				q: "No — the platform is not self-hostable (Next.js itself is open source).",
			},
			{
				s: "auto",
				q: "Yes — frontend and serverless, with strong preview workflows.",
			},
			{
				s: "manual",
				q: "No — marketplace add-ons are connected per project by you.",
			},
			{
				s: "none",
				q: "No — only Vercel-hosted projects, own-platform metrics.",
			},
			{ s: "none", q: "No." },
			{ s: "auto", q: "On the deploy side, yes — that is its strength." },
			{
				s: "manual",
				q: "Pro $20/user/mo, 1 TB transfer, then from $0.15/GB across several meters (2026-07-18). Documented tail risk: the June 2024 Cara bill of $96,280 in one week.",
			},
		],
		youKeep:
			"Any project you leave on Vercel — nothing in Alfredo depends on it.",
		alfredoAdds:
			"Your own servers, a flat cost shape, integration wiring at creation, and one view across all projects. Alfredo is a prototype and has none of Vercel's operational track record.",
		stayPutIf:
			"you want zero servers and never want to think about ops. That is a reasonable want, and it is not Alfredo.",
		realWins:
			"Deploy polish, preview deployments, a generous hobby tier, reliability at scale.",
		title: "Alfredo vs Vercel · Self-host both halves instead of renting one",
		description:
			"Vercel rents you a great deploy half. Alfredo self-hosts deploying and operating on your own servers, at a flat cost, with integrations wired at creation. What you keep, what Alfredo adds, and when to stay on Vercel.",
	},
	railway: {
		slug: "railway",
		name: "Railway",
		doubt: "Can't Railway spin up my apps and databases already?",
		relationship:
			"Railway rents the deploy half per project; Alfredo self-hosts deploys and adds the cross-project operations layer.",
		cells: [
			{ s: "none", q: "No." },
			{ s: "auto", q: "Yes, with one-click database templates." },
			{ s: "manual", q: "Database templates only — no integration wiring." },
			{
				s: "none",
				q: "No — the observability dashboard is scoped per project-environment, infra only (docs, July 2026).",
			},
			{ s: "none", q: "No." },
			{ s: "auto", q: "On the deploy side, yes." },
			{
				s: "manual",
				q: "Hobby $5/mo with included usage, Pro $20/mo per seat, then usage (2026-07-18).",
			},
		],
		youKeep: "Any project you leave on Railway.",
		alfredoAdds:
			"Your own hardware, flat costs, wiring beyond databases, and one view across projects. Alfredo is a prototype; Railway is a managed platform with a team behind it.",
		stayPutIf:
			"you are happy paying for managed infrastructure and run few projects.",
		realWins:
			"Good DX, low entry price, managed reliability, quick database templates.",
		title: "Alfredo vs Railway · Own your hardware and the cross-project view",
		description:
			"Railway rents a smooth deploy half per project. Alfredo self-hosts deploys on your own hardware, wires beyond databases, and gives one view across every project. What you keep, what Alfredo adds, and when to stay on Railway.",
	},
	supabase: {
		slug: "supabase",
		name: "Supabase",
		doubt: "Doesn't Supabase already wire auth, database and storage for me?",
		relationship:
			"Supabase gives one project a backend; Alfredo wires and watches all of your projects, and the two can coexist.",
		cells: [
			{
				s: "manual",
				q: "Partly — Docker self-hosting exists, but self-hosted behaves as one project (no orgs; managed backups/PITR, branching and multi-project Studio are platform-only, July 2026).",
			},
			{
				s: "manual",
				q: "Its own backend only — your app still needs a host.",
			},
			{
				s: "auto",
				q: "Its own bundle — Postgres, auth, storage — real and scoped to that one backend.",
			},
			{ s: "none", q: "No — Studio is one backend's console." },
			{ s: "none", q: "No." },
			{
				s: "manual",
				q: "Managed, yes; self-hosted is a Docker stack you run per project.",
			},
			{
				s: "manual",
				q: "Free $0, Pro from $25/mo, Team from $599/mo (2026-07-18).",
			},
		],
		youKeep:
			"Supabase in any project that uses it. Alfredo wires a different bundle (Convex, Better-Auth) and does not migrate yours.",
		alfredoAdds:
			"Deploys the whole project on your servers, wires beyond the backend (email, analytics, payments, uptime), and gives one view across all projects. Alfredo is a prototype; Supabase is a mature backend.",
		stayPutIf:
			"you need a deep managed Postgres backend right now. Nothing Alfredo provisions matches that depth.",
		realWins:
			"Maturity, docs, community, a genuinely useful free tier, backend depth.",
		title:
			"Alfredo vs Supabase · Wire and watch all your projects, not one backend",
		description:
			"Supabase wires a real backend for one project. Alfredo deploys the whole project on your servers, wires beyond the backend, and watches every project from one HQ. What you keep, what Alfredo adds, and when to stay on Supabase.",
	},
	"better-t-stack": {
		slug: "better-t-stack",
		name: "Better-T-Stack",
		doubt: "Can't Better-T-Stack wire my auth and database when it scaffolds?",
		relationship:
			"Use both: Better-T-Stack writes the code, Alfredo runs and watches it.",
		cells: [
			{
				s: "none",
				q: "Not applicable — it emits code, it doesn't run anything.",
			},
			{ s: "none", q: "No — at most a Cloudflare Workers deploy config." },
			{
				s: "manual",
				q: "As code, once — database “setup” is connection templates (Turso, Neon, Supabase, D1, Docker); nothing is provisioned or managed.",
			},
			{ s: "none", q: "No." },
			{ s: "none", q: "No." },
			{
				s: "manual",
				q: "The scaffold is one command; everything after is yours to build and run.",
			},
			{ s: "auto", q: "Free." },
		],
		youKeep:
			"The scaffolded code, permanently and lock-in-free. Nothing about Alfredo changes it.",
		alfredoAdds:
			"Running services instead of config stubs — the wired integrations exist and are watched after day one. Alfredo is a prototype; the scaffolder's output has no runtime to trust.",
		stayPutIf:
			"you ship one app and stop. A scaffolder plus any host is enough, and there is nothing to operate across.",
		realWins:
			"Breadth of frameworks, permanent output, zero dependency on anyone's runtime.",
		title:
			"Alfredo vs Better-T-Stack · Use both — it writes code, Alfredo runs it",
		description:
			"Better-T-Stack scaffolds your code once and is gone. Alfredo runs and watches the wired integrations after day one. Use both, honestly: what you keep, what Alfredo adds, and when a scaffolder alone is enough.",
	},
	grafana: {
		slug: "grafana",
		name: "Grafana",
		doubt: "Can't I just point Grafana at everything?",
		relationship:
			"Grafana can be built into most of what Alfredo ships assembled; Alfredo also deploys and wires projects, which Grafana never does.",
		cells: [
			{ s: "auto", q: "Yes — Grafana OSS is free, AGPLv3." },
			{ s: "none", q: "No — it observes; it never deploys or provisions." },
			{
				s: "none",
				q: "No — does not apply; every source is wiring you do.",
			},
			{
				s: "manual",
				q: "Yes, if you build it — cross-project unification is achievable and is itself an infrastructure project.",
			},
			{
				s: "manual",
				q: "DIY — a Sentry data source exists; Stripe is still an open plugin request (grafana/grafana#109069, “Requested”, 2026-07-18); nothing official for Postmark or email delivery.",
			},
			{
				s: "manual",
				q: "No — it is a dashboard construction kit: exporters, credentials, dashboard JSON, maintained per project.",
			},
			{
				s: "auto",
				q: "OSS free. Grafana Cloud free tier: 10k series, 50 GB logs, 3 active users, 14-day retention; Pro $19/mo base plus usage (2026-07-18).",
			},
		],
		youKeep:
			"Your Grafana, if you run one. Alfredo does not replace deep custom dashboards.",
		alfredoAdds:
			"The assembled cross-project view without the assembly, plus the deploy and wiring side Grafana never touches. Alfredo is a prototype; Grafana is two decades of dashboard depth.",
		stayPutIf:
			"you already run a happy Grafana/Prometheus stack. You have paid the assembly cost, and Alfredo's pitch is weakest there.",
		realWins:
			"Depth, flexibility, the data-source ecosystem, and a genuinely free self-hosted tier.",
		title: "Alfredo vs Grafana · The assembled view, instead of building it",
		description:
			"Grafana can be built into most of what Alfredo ships assembled — exporters, credentials, dashboard JSON, per project. Alfredo hands you the cross-project view without the assembly, and deploys and wires projects too. What you keep, and when to stay on Grafana.",
	},
	datadog: {
		slug: "datadog",
		name: "Datadog",
		doubt: "Isn't Datadog already the one dashboard over everything?",
		relationship:
			"Alfredo covers the dashboard part of Datadog for many small self-hosted projects; it does not attempt the deep tracing, and it deploys, which Datadog never does.",
		cells: [
			{
				s: "none",
				q: "No — SaaS only; CloudPrem is a partial exception for logs.",
			},
			{ s: "none", q: "No — it observes; it never deploys." },
			{
				s: "manual",
				q: "No — every integration is per-account wiring you configure.",
			},
			{ s: "auto", q: "Yes — the strongest existing single pane." },
			{
				s: "manual",
				q: "Yes, via opt-in integrations — Stripe account events, SendGrid/Mailgun/Postmark delivery (July 2026). Not a revenue dashboard out of the box.",
			},
			{
				s: "manual",
				q: "Partly — agent install plus per-integration setup per project; less work than Grafana, still work.",
			},
			{
				s: "none",
				q: "Per host, per module, and it stacks: Infrastructure Pro $15/host/mo annually ($18 on-demand), APM $31/host/mo with infra ($36 standalone, $48 on-demand) (2026-07-18). Shaped for companies, not a portfolio of small projects.",
			},
		],
		youKeep:
			"Datadog where you need depth. Alfredo does not attempt APM, tracing, or log search.",
		alfredoAdds:
			"The same one-view idea at portfolio scale, on your servers, at flat cost, plus deploying and wiring the projects it watches. Alfredo is a prototype; Datadog is the mature product.",
		stayPutIf:
			"you need deep APM, tracing, or log search. An HQ dashboard is not that.",
		realWins:
			"Depth, 1,000+ integrations, polish, and a real unified view that exists today.",
		title:
			"Alfredo vs Datadog · One view for many small projects, instead of renting it",
		description:
			"Datadog is a real unified view — rented per host, per module, shaped for companies. Alfredo brings the same one-view idea to a portfolio of small self-hosted projects at flat cost, and deploys them too. What you keep, and when to stay on Datadog.",
	},
	cloudflare: {
		slug: "cloudflare",
		name: "Cloudflare",
		doubt: "Can't I just deploy everything on Cloudflare?",
		relationship:
			"Cloudflare rents you the deploy half at the edge; Alfredo self-hosts both deploying and operating, with the opposite trade-offs.",
		cells: [
			{ s: "none", q: "No — it runs on Cloudflare's edge, not your servers." },
			{
				s: "auto",
				q: "Yes — Workers (now absorbing Pages) deploy frontends and serverless, with native support for Next.js, SvelteKit, Nuxt and Astro.",
			},
			{
				s: "manual",
				q: "No — D1/KV/R2 bindings are per-project config you wire, not provisioned integrations.",
			},
			{ s: "none", q: "No — own-platform analytics only, per project." },
			{ s: "none", q: "No." },
			{ s: "auto", q: "On the deploy side, yes." },
			{
				s: "manual",
				q: "Generous free tier that covers most prototypes; $5/mo paid tier (2026 pricing — re-verify before shipping).",
			},
		],
		youKeep:
			"Any project you leave on Cloudflare — nothing in Alfredo depends on it.",
		alfredoAdds:
			"Your own servers, integration wiring at creation, business signals, and one view across all projects. Alfredo is a prototype and has none of Cloudflare's global reach or reliability.",
		stayPutIf:
			"you want a zero-server edge platform and never want to run a box. That is a reasonable want, and it is not Alfredo.",
		realWins:
			"A global edge network, a generous free tier, strong framework support, and reliability at scale.",
		title:
			"Alfredo vs Cloudflare · Self-host both halves instead of renting the edge",
		description:
			"Cloudflare Workers rents you a fast edge deploy half. Alfredo self-hosts deploying and operating on your own servers, wires integrations at creation, and watches every project from one HQ. What you keep, and when to stay on Cloudflare.",
	},
};

// Map order = the on-page cast order, so the subpages and the section agree.
export const PRODUCT_SLUGS = [
	"coolify",
	"dokploy",
	"vercel",
	"railway",
	"supabase",
	"better-t-stack",
	"grafana",
	"datadog",
	"cloudflare",
] as const;
