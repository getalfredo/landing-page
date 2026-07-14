# Research: competitive landscape & comparison-section patterns

> Findings doc for [#39](https://github.com/getalfredo/landing-page/issues/39) (`wayfinder:research`, part of [#1](https://github.com/getalfredo/landing-page/issues/1)).
> Feeds the comparison **grilling** ticket ([#41](https://github.com/getalfredo/landing-page/issues/41)) → prototype ([#43](https://github.com/getalfredo/landing-page/issues/43)) → build.
> Date: 2026-07-14. Sources are primary (official docs, pricing pages, product homepages) plus named third-party write-ups, cited inline.

## Scope & standing rules

The comparison section places Alfredo against **the other ways a self-hosting indie hacker solves the same problem**, so a visitor can locate it in five seconds. Two rules from the map govern everything below:

1. **Honesty is a hard rule.** No strawmanning. Where an incumbent genuinely wins — including on maturity, reliability, and free tiers that an early-stage prototype has not earned — the section must say so.
2. **Alfredo's differentiator is a _dual_ promise, and only one half is novel.** (1) **Deploy** — spin up a project by selecting the integrations it needs, no per-project reconfiguring of analytics/email/DB/secrets/auth. (2) **Operations** — one cross-project HQ over the wired integrations (traffic, email delivery, payments, errors, uptime) that compounds as projects share already-running integrations. The deploy half is a crowded field; **the cross-project operations HQ is the actual white space** (see §3).

> ⚠️ **Caveats before publishing.** Alfredo is an early-stage prototype — every "win" below is a _positioning_ advantage, not a proven maturity/reliability one, and the section must not imply otherwise. All pricing reflects **July 2026** and must be re-confirmed against live pricing pages before any number ships. Vendor apex domains were partly egress-blocked during research; figures were cross-checked via search over the same primary pages but should be treated as provisional.

---

## 1. The alternatives shortlist (competitive landscape)

Five categories, roughly ordered by how an indie hacker actually encounters them. None is a single-product "vs" — Alfredo competes with **approaches**, which shapes the section design (§4).

| # | Category | Representative players | Solves the **deploy** half? | Solves the **cross-project ops HQ** half? |
|---|----------|------------------------|:---:|:---:|
| 0 | **Doing it by hand** | your own scripts + N SaaS dashboards | You, every time | No — this _is_ the sprawl |
| 1 | **Scaffolders / starters** | create-t3-app, Better-T-Stack, create-next-app, Vercel/Supabase templates | Code once, then gone | No |
| 2 | **PaaS / self-host deploy** | Railway, Render, Fly.io, **Coolify** (substrate) | Yes (infra) | No (per-project infra metrics only) |
| 3 | **BaaS** | Supabase, Nhost, Convex | Its own backend only | No (backend console only) |
| 4 | **Managed clouds ("rent your stack")** | Vercel, Netlify, Heroku | Yes (zero-ops) | No (own-platform metrics only) |

### 0. Doing it by hand — the real default

The honest baseline. Most self-hosting indie hackers already own servers and stitch tools together per project: provision a DB, wire Better-Auth, set up Postmark, drop in Umami, add Sentry, configure Uptime Kuma, copy secrets around — then repeat all of it for the next project. This is the **setup tax** (paid in full every project, no amortization — cf. the map's deploy-model clarification) and the **dashboard sprawl** (N tools × N projects = N dashboards) that Alfredo names as its two-act enemy.

- **Deploy:** maximal control, zero platform cost, zero lock-in — but you are the provisioner every single time.
- **Ops:** no unified view at all; this is the pain, not a solution to it.
- **Honest read:** this is the audience's status quo and Alfredo's truest competitor. The section should frame Alfredo as _automating the thing they already do by hand on their own servers_ — not as another rented platform. Where by-hand wins: total control and no dependency on an unproven runtime.

### 1. Scaffolders / starters — code once, then gone

- **create-t3-app** (create.t3.gg) — Interactive CLI scaffolding a typesafe Next.js app from a fixed menu: Next.js, TS, Tailwind, tRPC, Prisma/Drizzle, NextAuth/Auth.js. Self-describes as "a scaffolding tool, not a framework… once you initialize an app, it's yours" and "NOT an all-inclusive template" ([create.t3.gg/en/introduction](https://create.t3.gg/en/introduction)). **Deploy:** nothing — writes code to a folder. **Ops:** none.
- **Better-T-Stack** / create-better-t-stack (better-t-stack.dev) — Broader "roll your own stack" CLI with a visual [Stack Builder](https://www.better-t-stack.dev/new): many frontends (React/TanStack Start, Next, Nuxt, Svelte, Solid, Astro, RN), backends (Hono, Express, Fastify, Elysia, Convex), DBs, ORMs, and **Better-Auth + Convex** among the options ([README](https://github.com/AmanVarshney01/create-better-t-stack/blob/main/README.md)) — two tools Alfredo also wires, but emitted as _code_, not running services. Can emit a Cloudflare Workers deploy config + DB connection presets, but that's a connection scaffold, not managed provisioning. **Ops:** none.
- **Others:** create-next-app (single app, stops there); **Vercel Templates** (one-click clone+deploy, e.g. [Next.js + Supabase](https://vercel.com/templates/next.js/supabase) — closer to "select integration, deploy," but per-template, single-project, on Vercel's managed cloud, no cross-project HQ); **Supabase starters** (pre-wire Supabase Auth + Postgres RLS + storage, some add Stripe/Paddle — bound to Supabase's managed backend).

**Honest read.** Category is _orthogonal_, not overlapping: every scaffolder hands you a repo and disappears — no provisioning of running services, no dashboard, certainly not a cross-project one. That is precisely Alfredo's white space (recurring ops + shared-integration compounding). Where they flatly win **today**: maturity, framework breadth, community trust, and the fact that scaffolder output is permanent and lock-in-free, whereas Alfredo is an unproven runtime you depend on.

### 2. PaaS / self-host deploy platforms

- **Railway** (railway.com) — Git-push PaaS on its own hardware; one-click DB templates (Postgres, MySQL, Mongo, Redis, ClickHouse). Hobby $5/mo (incl. $5 usage), Pro $20/mo, then usage-metered ([docs.railway.com/pricing](https://docs.railway.com/pricing)). Has a real [Observability Dashboard](https://docs.railway.com/observability) — but **scoped per project-environment** (CPU/mem/disk/net, logs, spend, threshold alerts), i.e. _infra telemetry, not business signals, and not cross-project_.
- **Render** (render.com) — Heroku-style managed cloud: web services, workers, cron, managed Postgres/Key-Value, Blueprints (IaC). New plans (Apr 2026): Hobby free, Professional $19/user/mo, plus per-service compute from $7/mo ([render.com/pricing](https://render.com/pricing)). Per-service metrics/logs/alerts; no cross-project business-signal HQ.
- **Fly.io** (fly.io) — Firecracker micro-VMs ("Machines"), pure pay-as-you-go since Oct 2024; ~$1.94/mo for an always-on 256 MB shared VM, metered egress ([fly.io/pricing](https://fly.io/pricing/)). Lowest-level of the three — you wire everything yourself; Prometheus/Grafana metrics per app; no cross-project HQ.
- **Coolify** (coolify.io) — **Alfredo's own substrate, and its closest neighbor.** OSS self-hostable PaaS deploying sites/apps/DBs and **280+ one-click services** onto _your own servers_ over SSH, with **multi-server / Docker Swarm**, auto Let's Encrypt, S3 backups, no lock-in ([coolify.io/docs](https://coolify.io/docs), [github.com/coollabsio/coolify](https://github.com/coollabsio/coolify)). Self-hosted is free/OSS; Coolify Cloud ~$4–5/mo adds HA/managed notifications. Its 280+ catalog **already includes tools in Alfredo's set** (Umami, Uptime Kuma, Postgres…) as one-click deploys.
  - **Competitor, substrate, or both? → Both.** Alfredo sits _on top of_ Coolify's deploy primitives (substrate) and overlaps it on the deploy axis (Coolify already does select-a-service-and-deploy). Alfredo's differentiated layer is the two things Coolify does **not** do: (1) **auto-wiring** integrations into each new project (auth+email+DB+payments+analytics pre-configured, secrets propagated, **shared services reused across projects**) rather than deploying isolated one-click boxes; (2) the unified **cross-project operations HQ** over app/business signals. Coolify's dashboard is deploy/infra-oriented, project-by-project.

**Honest read.** All four solve "get code running" well, and three ship observability — but every dashboard is **infra-scoped** (CPU/mem/logs per service/env) and none provisions or _wires_ the analytics/email/auth/payments layer, nor unifies business signals across projects. That combined "wire-the-integrations + one cross-project HQ" claim is the seam. Where incumbents unambiguously win: Railway/Render/Fly are managed, reliable, mature (the "rented stack" that just works); Coolify already owns the battle-tested self-host deploy engine Alfredo _depends on rather than replaces_. Fair framing: **these are deploy platforms with per-project infra dashboards; Alfredo's bet is the operations layer above them plus zero-per-project integration setup — an unproven advantage today, not a maturity one.**

### 3. BaaS (Backend-as-a-Service)

- **Supabase** (supabase.com) — Postgres + Auth + Storage + Realtime + Edge Functions + auto REST/GraphQL, per-project Studio. Fully self-hostable via Docker Compose, **but officially documented caveats are significant**: managed backups/PITR, branching, multi-project/org Studio, advanced metrics, read replicas, and ETL are **platform-only, not available self-hosted**, and self-hosted behaves as **one project** — no orgs, staging+prod = two full stacks ([self-host feature matrix](https://supabase.com/docs/guides/troubleshooting/are-all-features-available-in-self-hosted-supabase-THPcqw), [self-hosting/docker](https://supabase.com/docs/guides/self-hosting/docker)). Free $0 / Pro $25/org/mo / Team $599/mo ([pricing](https://supabase.com/pricing)). Studio is scoped to **one backend** — never spans email/payments/uptime.
- **Nhost** (nhost.io) — Managed Postgres + **Hasura GraphQL** + Auth + Storage + Functions + "Nhost Run." 100% OSS, whole stack self-hostable via docker-compose ([github.com/nhost/nhost](https://github.com/nhost/nhost)); managed backups/PITR gated to paid cloud. Starter $0 (pauses after ~1 wk idle) / Pro from $25/mo / Team from $599/mo ([pricing](https://nhost.io/pricing)). Per-project console only.
- **Convex** (convex.dev) — Reactive DB + TS functions + built-in cron/scheduling + file storage + full-text/vector search + auth. `npx convex deploy` provisions the reactive backend in one step. Backend/dashboard/CLI open-sourced under **FSL → Apache-2.0 after 2 years** (may self-host, may not build a competing hosted Convex; no support plan self-hosted) ([open-source](https://www.convex.dev/open-source), [self-hosting](https://docs.convex.dev/self-hosting)). Free / Professional $25/dev/mo ([pricing](https://www.convex.dev/pricing)). Per-deployment console only.

**Honest read.** All three answer "give me a backend bundle fast," and all self-host at **single-backend, single-project** granularity. **None provides a cross-project operations dashboard spanning analytics + email + payments + uptime** — each dashboard is its own backend surface. That is exactly the seam Alfredo's dual promise targets. Where they beat a prototype today: maturity, free tiers, DX polish, reliability, years of docs/community. (Note Convex + Better-Auth also appear in Alfredo's own truth-list, so the framing is "we wire and operate these across projects," not "we replace them.")

### 4. Managed clouds — "rent your stack" (the named false escape)

The category [#2](https://github.com/getalfredo/landing-page/issues/2)/[#10](https://github.com/getalfredo/landing-page/issues/10) already position as the false escape: you escape the setup tax but stop **owning** your stack — you rent it, with metered costs and lock-in.

- **Vercel** (vercel.com) — Next.js-native serverless cloud; excellent web/serverless deploy DX. **Not self-hostable** (the platform; Next.js itself is OSS). Pro $20/dev/mo, 1 TB transfer included, then **$0.15/GB** — a rate Vercel _lowered from $0.40/GB_ on 25 Jun 2024 in response to bill-shock complaints ([pricing](https://vercel.com/pricing)). Billing spans ~7 metered axes, so "bandwidth" understates exposure; a DDoS produced a **~$23,000** bill ([writeup](https://usagebox.com/articles/vercel-23000-dollar-bill-usage-based-platform-bill-shock-2026)). Spend Management (default $200 budget, optional hard pause) is **opt-in**. Analytics scoped to Vercel-hosted projects only.
- **Netlify** (netlify.com) — Jamstack cloud; git deploys, previews, edge functions, forms. **Not self-hostable.** Moved to a **credit-based usage model** (Sep 2025, refined Apr 2026) ([pricing](https://www.netlify.com/pricing/), [changelog](https://www.netlify.com/changelog/2026-04-14-pricing-updates-april-2026/)). Free 300 credits/mo (~15 GB); Pro $20/mo flat. Canonical bill shock: a 3 MB file DDoS'd into ~60 TB egress → a **~$104,000** invoice ([forum](https://answers.netlify.com/t/clarification-on-ddos-attack-fees-and-protections-100k-charge/127953)). Observability limited to Netlify's own surface.
- **Heroku** (heroku.com) — The original PaaS; `git push heroku`, buildpacks, add-on marketplace. **Ended all free plans 28 Nov 2022** ([FAQ](https://help.heroku.com/RSBRUH58/removal-of-heroku-free-product-plans-faq)) — a concrete case of rented-platform terms changing under you. Eco $5/mo / Basic $7/mo / Standard-1X $50/mo. Its add-on model — each add-on with its **own** dashboard — _is_ the dashboard-sprawl pattern Alfredo names.

**Honest read.** Vercel/Netlify/Heroku deliver the deploy half brilliantly (zero-ops, mature, reliable) but structurally cannot deliver the other half: none is self-hostable (you rent), all carry usage-metered, largely **uncapped** cost tail-risk (egress/DDoS bill shock documented from thousands to ~$100K), and each dashboard sees only its own platform. The honest counterweight the section must keep: for a solo who just wants to ship, these incumbents' polish, cheap entry tiers, and reliability are real advantages a prototype has not yet earned.

---

## 2. Honest win / lose / too-early axes

The spine of a fair section. Grouped so the section can concede openly.

### Where Alfredo genuinely differs (the defensible wins)
- **Cross-project operations HQ.** No player in any category unifies traffic + email delivery + payments + errors + uptime across _all your projects_ in one dashboard. Scaffolders have none; PaaS/BaaS/managed-cloud dashboards are each **single-scope** (per-env infra, or one backend, or one platform). This is the one claim with genuine white space.
- **Compounding via shared integrations.** "Add project N, reuse the integrations already running" is unique to Alfredo's model. (Copy guard from the map: never imply the _first_ project amortizes setup — every project is the same one step; compounding comes from **overlap**, not amortization.)
- **Own-your-stack + zero-per-project setup, together.** Coolify gives own-your-stack; managed clouds give zero-setup; scaffolders give a starting point. Alfredo's bet is **both at once on your own servers** — no one else pairs self-host ownership with wired-once, select-and-deploy provisioning.

### Where Alfredo does not win (concede these plainly)
- **Deploy engine.** Coolify (its substrate) and Railway/Render/Fly already deploy services well. Alfredo does not out-deploy them; it wires + operates _on top_.
- **In-app framework/typesafety layer.** create-t3-app / Better-T-Stack own end-to-end typesafety and framework breadth; Alfredo doesn't touch it.
- **Backend depth.** Supabase/Nhost/Convex are deeper, more mature backends than anything Alfredo provisions.

### Too early to claim parity (don't overclaim)
- **Maturity, reliability, uptime track record** vs any incumbent — Alfredo is a prototype.
- **Free tier / DX polish / docs / community** — all incumbents lead here today.
- **Breadth of integrations** — Alfredo's set is 8 opinionated tools; BaaS/PaaS catalogs are far larger.

### Who should **not** pick Alfredo (a trust-builder — see §3)
- People who want zero servers and never to think about ops → a managed cloud.
- People who need a deep managed backend right now → Supabase/Convex.
- People shipping one app and done → a scaffolder + any host.
Naming these openly is itself a conversion mechanic (§3).

---

## 3. Comparison-section design patterns worth grilling

### Patterns surveyed (with failure modes)
- **Feature-matrix table (us-vs-them).** The default; readers can "absorb comparable information" and _verify_ it — which is why including rows the competitor wins builds trust ([poweredbysearch](https://www.poweredbysearch.com/learn/best-saas-comparison-pages/)). Failure mode: the "feature table with a logo on top" — an all-green column reads as biased and gets closed instantly ([Medium: most SaaS comparison pages…](https://medium.com/@deian-isac/most-saas-comparison-pages-are-just-feature-tables-with-a-logo-on-top-bb58f2d9f77e)). Real examples: **Postmark**, **Unbounce** ([reviewflowz](https://www.reviewflowz.com/blog/competitive-comparison-landing-page-examples), [saaslandingpage](https://saaslandingpage.com/articles/15-best-comparison-page-examples-and-why-they-work/)).
- **Two-column "with / without X" contrast.** Communicates a worldview fast and emotionally; weak at substantiating claims and the **easiest to strawman** ("without us = chaos"). Note: this overlaps the hero demo's own "with/without Alfredo" contrast — see the demo↔comparison boundary fog in [#1](https://github.com/getalfredo/landing-page/issues/1)/[#40](https://github.com/getalfredo/landing-page/issues/40)/[#41](https://github.com/getalfredo/landing-page/issues/41).
- **Dedicated `/compare/[competitor]` (vs) pages.** One page per competitor for "X vs Y" search. "X vs Y" = decision/BOFU; "Alternatives to X" = discovery/category — different intent, different layout ([backstageseo](https://backstageseo.com/blog/b2b-comparison-pages/)). Great for high-intent traffic + AI citations; failure mode is thin duplicated templates.
- **Interactive competitor switcher (tabs/toggle).** **Heap** swaps the opposing column via an on-page menu — multi-competitor breadth with one-vs-one depth ([unkover](https://unkover.com/blog/comparison-pages/)). Suits the console/control-surface aesthetic, but tabbed content is less scannable, costs a tap on mobile, and is **weaker for SEO/AEO** when JS-gated or split off one crawlable URL ([eleken tabs UX](https://www.eleken.co/blog-posts/tabs-ux)).
- **"When to use which" honest guide / segmented scorecards.** **Snov.io** shows separate scorecards per solution instead of one long table ([saaslandingpage](https://saaslandingpage.com/articles/15-best-comparison-page-examples-and-why-they-work/)). Highest-trust; fits Alfredo's "5 approaches, not 1 product" reality better than a us-vs-them grid.
- **Checkmark/x grid.** Compact but lowest-information — a bare ✓/✗ hides nuance and is the easiest place to strawman a partial competitor capability. Best examples add a qualifier/tooltip per cell.

### Staying fair / anti-strawman (the standing rule, operationalized)
- **Give competitors real wins** — verifiable tables beat sales collateral ([poweredbysearch](https://www.poweredbysearch.com/learn/best-saas-comparison-pages/)).
- **Add an explicit "who should NOT use Alfredo."** "Why [product] might not be right for you" pages reportedly convert ~13.8%; conceding a real limitation earns credibility and only sheds bad-fit prospects ([textranch](https://blog.textranch.com/how-to-edit-comparison-pages-that-need-to-rank-and-convert/)).
- **Avoid loaded adjectives** — "revolutionary/seamless" for us vs "basic/clunky/outdated" for them is the canonical red flag ([textranch](https://blog.textranch.com/how-to-edit-comparison-pages-that-need-to-rank-and-convert/)).
- **Date & source claims** — competitor features change; undated ✗ marks go stale and read as dishonest (critical given our July-2026 pricing caveat).
- **Praised-for-honesty exemplars:** **PostHog's** "best [X] alternatives" pages openly recommend competitors for cases PostHog loses ([best-fathom-alternatives](https://posthog.com/blog/best-fathom-alternatives), [best-plausible-alternatives](https://posthog.com/blog/best-plausible-alternatives)); third-party **EU Picks Plausible vs Fathom** ("wins for 9 out of 10 people," then the edge cases, [eupick](https://eupick.com/blog/plausible-vs-fathom/)).

### AEO/SEO value (ties to [#37](https://github.com/getalfredo/landing-page/issues/37))
- **High commercial intent.** "X vs Y" / "best [category]" / "alternatives to X" are BOFU and convert far above head terms — comparison pages cited at ~7.5–20% ([backstageseo](https://backstageseo.com/blog/b2b-comparison-pages/), [reviewflowz](https://www.reviewflowz.com/blog/competitive-comparison-landing-page-examples)).
- **LLMs cite comparison content disproportionately.** An AI asked "is X or Y better" does what a comparison page does, so it cites one; comparison/vs pages reportedly cite at ~2.4× generic blog posts, and a real HTML `<table>` lifts citation ~2.5× vs the same facts in prose ([averi.ai](https://www.averi.ai/how-to/llm%E2%80%91optimized-content-structures-tables-faqs-snippets)).
- **Machine-readable structure wins.** Open with the answer (verdict up top), use a real `<table>` (not an image), add **FAQPage JSON-LD** (Q-framed criteria: "Can Alfredo self-host?", "Is it cheaper than Render?") and **ItemList** for alternatives sets — JSON-LD is the preferred AEO format in 2026 ([mqlmagnet](https://www.mqlmagnet.com/post/faq-schema-for-ai-search), [aeolyft](https://aeolyft.com/blog/best-schemaorg-types-for-product-comparison-tables-4-top-picks-2026/)). **Note:** this directly reopens the no-JSON-LD decision from [#21](https://github.com/getalfredo/landing-page/issues/21) — flag for §4/[#37](https://github.com/getalfredo/landing-page/issues/37).

### Mobile mechanics (the indie-hacker audience is on phones)
Wide multi-column tables are "technically responsive but practically unusable" on phones. Fixes, best-first: **column focus / pin-and-swipe** (pin our column or the label column, swipe competitors) > **sticky first column + sticky header** (needs `overflow-x:auto`, opaque cells, careful z-index) > **row-to-card collapse** > **per-product swipeable scorecards** (the Snov.io approach). Plain horizontal scroll is a last resort, not a design ([razegrowth](https://razegrowth.com/blog/saas-feature-comparison-tables), [css-tricks sticky table](https://css-tricks.com/a-table-with-both-a-sticky-header-and-a-sticky-first-column/)).

---

## 4. Decisions to grill (hand-off to [#41](https://github.com/getalfredo/landing-page/issues/41))

1. **Axis of comparison: products vs approaches.** Alfredo competes with **5 approaches**, not one product. A category-axis "when to use which" guide (by-hand / scaffolder / PaaS / BaaS / managed cloud → where Alfredo fits) likely honors the honesty rule better than a us-vs-named-competitor checkmark grid. Grill: approach-axis, product-axis, or a hybrid (approaches in the section, named `/compare/x` pages for search)?
2. **On-page section vs dedicated `/compare/[x]` pages** — same content, a teaser linking out, or both? (Section = placement; dedicated pages = BOFU search + AI citation.)
3. **Static table vs interactive competitor-switcher** — a Heap-style toggle suits the HQ/control-surface aesthetic and consolidates 5 alternatives, but costs scannability and AEO. Weigh against the console identity.
4. **How honesty is encoded structurally** — a dedicated "when NOT to use Alfredo / pick a PaaS instead" block + competitor-wins rows + dated/sourced cells, vs relying on tone. Pick the mechanism, not just the intention.
5. **Cell encoding** — bare ✓/✗ vs qualified cells/tooltips (bare marks are where strawmanning sneaks in).
6. **Mobile strategy for a 5–6-column table** — commit early to pin-and-swipe / sticky-first-column / row-to-card; don't let it default to broken horizontal scroll.
7. **Demo ↔ comparison boundary** — does the "with/without Alfredo, vs Better-T-Stack" contrast live in the demo, this section, or both? (Open fog in [#1](https://github.com/getalfredo/landing-page/issues/1); decided across [#40](https://github.com/getalfredo/landing-page/issues/40)/[#41](https://github.com/getalfredo/landing-page/issues/41).)
8. **Reopen JSON-LD?** Comparison content is the strongest AEO case for FAQPage/ItemList schema; [#21](https://github.com/getalfredo/landing-page/issues/21) shipped none. Route the actual call through [#37](https://github.com/getalfredo/landing-page/issues/37).

## Sources
Primary: create.t3.gg, better-t-stack.dev + create-better-t-stack README, railway.com/docs, render.com, fly.io, coolify.io + coollabsio/coolify, supabase.com (docs/pricing/self-host matrix), nhost.io + nhost/nhost, convex.dev (pricing/open-source/self-hosting), vercel.com, netlify.com, heroku.com help center. Comparison-pattern & AEO write-ups: poweredbysearch, saaslandingpage, reviewflowz, unkover, backstageseo, textranch, razegrowth, css-tricks, averi.ai, mqlmagnet, aeolyft, posthog.com, eupick.com (all linked inline). Incident evidence: Netlify community forum (~$104K), Vercel bill-shock writeup (~$23K), Heroku free-plan removal FAQ.
