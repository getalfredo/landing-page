# Research: competitive landscape & comparison-section patterns

> Findings doc for [#39](https://github.com/getalfredo/landing-page/issues/39) (`wayfinder:research`, part of [#1](https://github.com/getalfredo/landing-page/issues/1)).
> Feeds the comparison **grilling** ticket ([#41](https://github.com/getalfredo/landing-page/issues/41)) → prototype ([#43](https://github.com/getalfredo/landing-page/issues/43)) → build.
> Date: 2026-07-14. **Rev 2** (same day): added the observability/unified-dashboard category and adjacent players, narrowed the white-space claim accordingly, ran an adversarial verification pass on every statistic (unverifiable GEO-vendor numbers replaced with sourced claims), and added the full comparison table (§2).

## Scope & standing rules

The comparison section places Alfredo against **the other ways a self-hosting indie hacker solves the same problem**, so a visitor can locate it in five seconds. Two rules from the map govern everything below:

1. **Honesty is a hard rule.** No strawmanning. Where an incumbent genuinely wins — including on maturity, reliability, and free tiers that an early-stage prototype has not earned — the section must say so.
2. **Alfredo's differentiator is a _dual_ promise, and the defensible claim is the _combination_.** (1) **Deploy** — spin up a project by selecting the integrations it needs, no per-project reconfiguring of analytics/email/DB/secrets/auth. (2) **Operations** — one cross-project HQ over the wired integrations (traffic, email delivery, payments, errors, uptime) that compounds as projects share already-running integrations. Neither half alone is white space (see §3.1); the pairing is.

> ⚠️ **Caveats before publishing.** Alfredo is an early-stage prototype — every "win" below is a _positioning_ advantage, not a proven maturity/reliability one, and the section must not imply otherwise. All pricing reflects **July 2026** and must be re-confirmed against live pricing pages before any number ships. A verification pass (Rev 2) checked every statistic: numbers below are either traceable to a named incident/published dataset, or explicitly marked as anecdote. Vendor apex domains were partly egress-blocked during research; figures were cross-checked via search over the same primary pages.

---

## 1. The alternatives shortlist (competitive landscape)

Six categories, roughly ordered by how an indie hacker encounters them. None is a single-product "vs" — Alfredo competes with **approaches**, which shapes the section design (§4).

| # | Category | Representative players | Solves the **deploy** half? | Solves the **cross-project ops** half? |
|---|----------|------------------------|:---:|:---:|
| 0 | **Doing it by hand** | your own scripts + N SaaS dashboards | You, every time | No — this _is_ the sprawl |
| 1 | **Scaffolders / starters** | create-t3-app, Better-T-Stack, create-next-app, templates | Code once, then gone | No |
| 2 | **PaaS / self-host deploy** | Railway, Render, Fly.io, **Coolify** (substrate), Dokploy, CapRover, Dokku, Kamal, DO App Platform | Yes (infra) | No (per-project infra metrics only) |
| 3 | **BaaS** | Supabase, Nhost, Convex, PocketBase, Appwrite | Its own backend only | No (backend console only) |
| 4 | **Managed clouds ("rent your stack")** | Vercel, Netlify, Heroku | Yes (zero-ops) | No (own-platform metrics only) |
| 5 | **Observability / unified dashboards** | Grafana, Datadog, New Relic | No — they observe, never deploy | **Yes, with catches** (see §1.5 — this is why the white-space claim must be narrow) |

### 0. Doing it by hand — the real default

The honest baseline. Most self-hosting indie hackers already own servers and stitch tools together per project: provision a DB, wire Better-Auth, set up Postmark, drop in Umami, add Sentry, configure Uptime Kuma, copy secrets around — then repeat all of it for the next project. This is the **setup tax** (paid in full every project, no amortization — cf. the map's deploy-model clarification) and the **dashboard sprawl** (N tools × N projects = N dashboards) that Alfredo names as its two-act enemy.

- **Deploy:** maximal control, zero platform cost, zero lock-in — but you are the provisioner every single time.
- **Ops:** no unified view at all; this is the pain, not a solution to it.
- **Honest read:** this is the audience's status quo and Alfredo's truest competitor. The section should frame Alfredo as _automating the thing they already do by hand on their own servers_ — not as another rented platform. Where by-hand wins: total control and no dependency on an unproven runtime.

### 1. Scaffolders / starters — code once, then gone

- **create-t3-app** (create.t3.gg) — Interactive CLI scaffolding a typesafe Next.js app from a fixed menu: Next.js, TS, Tailwind, tRPC, Prisma/Drizzle, NextAuth/Auth.js. Self-describes as "a scaffolding tool, not a framework… once you initialize an app, it's yours" and "NOT an all-inclusive template" ([create.t3.gg/en/introduction](https://create.t3.gg/en/introduction)). **Deploy:** nothing — writes code to a folder. **Ops:** none.
- **Better-T-Stack** / create-better-t-stack (better-t-stack.dev) — Broader "roll your own stack" CLI with a visual [Stack Builder](https://www.better-t-stack.dev/new): many frontends (React/TanStack Start, Next, Nuxt, Svelte, Solid, Astro, RN), backends (Hono, Express, Fastify, Elysia, Convex), DBs, ORMs, and **Better-Auth + Convex** among the options ([README](https://github.com/AmanVarshney01/create-better-t-stack/blob/main/README.md)) — two tools Alfredo also wires, but emitted as _code_, not running services. Can emit a Cloudflare Workers deploy config + DB connection presets, but that's a connection scaffold, not managed provisioning. **Ops:** none.
- **Others:** create-next-app (single app, stops there); **Vercel Templates** (one-click clone+deploy, e.g. [Next.js + Supabase](https://vercel.com/templates/next.js/supabase) — closer to "select integration, deploy," but per-template, single-project, on Vercel's managed cloud, no cross-project HQ); **Supabase starters** (pre-wire Supabase Auth + Postgres RLS + storage, some add Stripe/Paddle — bound to Supabase's managed backend).

**Honest read.** Category is _orthogonal_, not overlapping: every scaffolder hands you a repo and disappears — no provisioning of running services, no dashboard, certainly not a cross-project one. Where they flatly win **today**: maturity, framework breadth, community trust, and the fact that scaffolder output is permanent and lock-in-free, whereas Alfredo is an unproven runtime you depend on.

### 2. PaaS / self-host deploy platforms

- **Railway** (railway.com) — Git-push PaaS on its own hardware; one-click DB templates (Postgres, MySQL, Mongo, Redis, ClickHouse). Hobby $5/mo (incl. $5 usage), Pro $20/mo, then usage-metered ([docs.railway.com/pricing](https://docs.railway.com/pricing)). Has a real [Observability Dashboard](https://docs.railway.com/observability) — but **scoped per project-environment** (CPU/mem/disk/net, logs, spend, threshold alerts), i.e. _infra telemetry, not business signals, and not cross-project_.
- **Render** (render.com) — Heroku-style managed cloud: web services, workers, cron, managed Postgres/Key-Value, Blueprints (IaC). New plans (Apr 2026): Hobby free, Professional $19/user/mo, plus per-service compute from $7/mo ([render.com/pricing](https://render.com/pricing)). Per-service metrics/logs/alerts; no cross-project business-signal HQ.
- **Fly.io** (fly.io) — Firecracker micro-VMs ("Machines"), pure pay-as-you-go since Oct 2024; ~$1.94/mo for an always-on 256 MB shared VM, metered egress ([fly.io/pricing](https://fly.io/pricing/)). Lowest-level of the three — you wire everything yourself; Prometheus/Grafana metrics per app; no cross-project HQ.
- **Coolify** (coolify.io) — **Alfredo's own substrate, and its closest neighbor.** OSS self-hostable PaaS deploying sites/apps/DBs and **280+ one-click services** onto _your own servers_ over SSH, with **multi-server / Docker Swarm**, auto Let's Encrypt, S3 backups, no lock-in ([coolify.io/docs](https://coolify.io/docs), [github.com/coollabsio/coolify](https://github.com/coollabsio/coolify)). Self-hosted is free/OSS; Coolify Cloud ~$4–5/mo. Its catalog **already includes tools in Alfredo's set** (Umami, Uptime Kuma, Postgres…) as one-click deploys.
  - **Competitor, substrate, or both? → Both.** Alfredo sits _on top of_ Coolify's deploy primitives (substrate) and overlaps it on the deploy axis. Alfredo's differentiated layer is the two things Coolify does **not** do: (1) **auto-wiring** integrations into each new project (auth+email+DB+payments+analytics pre-configured, secrets propagated, **shared services reused across projects**) rather than deploying isolated one-click boxes; (2) the unified **cross-project operations HQ** over app/business signals. Coolify's dashboard is deploy/infra-oriented, project-by-project.
- **Adjacent self-host deployers** (same shape, briefer profiles):
  - **Dokploy** (dokploy.com) — OSS (Apache-2.0) self-hosted PaaS, the most direct Coolify rival (~26k GitHub stars); Docker Compose native, DB provisioning with automated backups, Traefik/SSL, multi-server via Docker Swarm ([github.com/Dokploy/dokploy](https://github.com/Dokploy/dokploy)). Dashboard is real-time CPU/mem/storage/network per resource + app logs — **monitoring stops at the container boundary**; no integration wiring, no business signals.
  - **CapRover** (caprover.com) — free OSS PaaS on Docker Swarm; web dashboard, one-click app catalog, auto SSL. Ops = app logs + optional monitoring add-ons.
  - **Dokku** (dokku.com) — "the smallest PaaS": git-push deploys with buildpacks/Dockerfiles, plugin system; CLI-first, no bundled dashboard.
  - **Kamal** (kamal-deploy.org) — Basecamp's zero-downtime Docker deploy CLI for your own VMs; purely a deploy pipeline, no UI, ops = `kamal logs`.
  - **DigitalOcean App Platform** — managed (rented) PaaS from $5/mo; per-app insights/alerts only ([docs](https://docs.digitalocean.com/products/app-platform/details/pricing/)).

**Honest read.** All of these solve "get code running" well, and several ship observability — but every dashboard is **infra-scoped** (CPU/mem/logs per service/env/container) and none provisions or _wires_ the analytics/email/auth/payments layer, nor unifies business signals across projects. Where incumbents unambiguously win: Railway/Render/Fly are managed, reliable, mature; Coolify (and Dokploy) already own the battle-tested self-host deploy engine Alfredo _depends on rather than replaces_. Fair framing: **these are deploy platforms with per-project infra dashboards; Alfredo's bet is the operations layer above them plus zero-per-project integration setup — an unproven advantage today, not a maturity one.**

### 3. BaaS (Backend-as-a-Service)

- **Supabase** (supabase.com) — Postgres + Auth + Storage + Realtime + Edge Functions + auto REST/GraphQL, per-project Studio. Fully self-hostable via Docker Compose, **but officially documented caveats are significant**: managed backups/PITR, branching, multi-project/org Studio, advanced metrics, read replicas, and ETL are **platform-only, not available self-hosted**, and self-hosted behaves as **one project** — no orgs; staging+prod = two full stacks ([self-host feature matrix](https://supabase.com/docs/guides/troubleshooting/are-all-features-available-in-self-hosted-supabase-THPcqw), [self-hosting/docker](https://supabase.com/docs/guides/self-hosting/docker)). Free $0 / Pro $25/org/mo / Team $599/mo ([pricing](https://supabase.com/pricing)). Studio is scoped to **one backend** — never spans email/payments/uptime.
- **Nhost** (nhost.io) — Managed Postgres + **Hasura GraphQL** + Auth + Storage + Functions + "Nhost Run." 100% OSS, whole stack self-hostable via docker-compose ([github.com/nhost/nhost](https://github.com/nhost/nhost)); managed backups/PITR gated to paid cloud. Starter $0 (pauses after ~1 wk idle) / Pro from $25/mo ([pricing](https://nhost.io/pricing)). Per-project console only.
- **Convex** (convex.dev) — Reactive DB + TS functions + built-in cron + file storage + full-text/vector search + auth. `npx convex deploy` provisions the reactive backend in one step. Backend/dashboard/CLI open-sourced under **FSL → Apache-2.0 after 2 years** (may self-host, may not build a competing hosted Convex; no support plan self-hosted) ([open-source](https://www.convex.dev/open-source), [self-hosting](https://docs.convex.dev/self-hosting)). Free / Professional $25/dev/mo ([pricing](https://www.convex.dev/pricing)). Per-deployment console only.
- **PocketBase** (pocketbase.io) — the indie darling: "realtime backend in 1 file" — a single Go binary bundling embedded SQLite, realtime subscriptions, auth, file storage, and an admin UI ([github.com/pocketbase/pocketbase](https://github.com/pocketbase/pocketbase)). Eliminates backend assembly _within one app_; but each instance backs **a single application** — five products = five binaries with five admin UIs. No payments/email/analytics scope at all, no deploy path (you still need a server), no cross-project view.
- **Appwrite** (appwrite.io) — self-hostable (Docker install) + cloud; bundles Auth, Databases, Storage, Functions, Messaging, Realtime, Sites ([self-hosting docs](https://appwrite.io/docs/advanced/self-hosting)). Its console **does manage multiple projects in one place** — closer to Alfredo than PocketBase — but it's a per-project BaaS control panel (API keys, users, DBs, function logs), **not** a cross-project business dashboard: no unified payments, third-party email deliverability, external analytics, error tracking, or uptime across the portfolio. Messaging _sends_ email/SMS/push via providers you configure per project; it doesn't monitor delivery health portfolio-wide.

**Honest read.** All five answer "give me a backend bundle fast," and all self-host at **single-backend granularity** (Appwrite's multi-project console being the partial exception — still backend-scoped). None provides a cross-project operations dashboard spanning analytics + email + payments + uptime. Where they beat a prototype today: maturity, free tiers, DX polish, reliability, years of docs/community. (Note Convex + Better-Auth also appear in Alfredo's own truth-list, so the framing is "we wire and operate these across projects," not "we replace them.")

### 4. Managed clouds — "rent your stack" (the named false escape)

The category [#2](https://github.com/getalfredo/landing-page/issues/2)/[#10](https://github.com/getalfredo/landing-page/issues/10) already position as the false escape: you escape the setup tax but stop **owning** your stack — you rent it, with metered costs and lock-in.

- **Vercel** (vercel.com) — Next.js-native serverless cloud; excellent web/serverless deploy DX. **Not self-hostable** (the platform; Next.js itself is OSS). Pro $20/dev/mo, 1 TB transfer included, then **$0.15/GB** — a rate Vercel _lowered from $0.40/GB_ in June 2024 amid bill-shock complaints ([changelog](https://vercel.com/changelog/lower-pricing-for-fast-data-transfer), [blog](https://vercel.com/blog/improved-infrastructure-pricing)). Billing spans ~7 metered axes, so "bandwidth" understates exposure. The documented bill-shock exhibit: **in June 2024 the artist platform Cara received a $96,280 Vercel bill for a single week** after growing from 40k to 650k users ([TechCrunch](https://techcrunch.com/2024/06/06/a-social-app-for-creatives-cara-grew-from-40k-to-650k-users-in-a-week-because-artists-are-fed-up-with-metas-ai-policies/), [InfoQ](https://www.infoq.com/news/2024/06/vercel-serverless-scale-expenses/), [HN](https://news.ycombinator.com/item?id=40612981)). Spend Management (default $200 budget, optional hard pause) is **opt-in**. Analytics scoped to Vercel-hosted projects only.
- **Netlify** (netlify.com) — Jamstack cloud — git deploys, previews, edge functions, forms. **Not self-hostable.** Moved to a **credit-based usage model** (Sep 2025, refined Apr 2026) ([pricing](https://www.netlify.com/pricing/), [changelog](https://www.netlify.com/changelog/2026-04-14-pricing-updates-april-2026/)). Free 300 credits/mo (~15 GB); Pro $20/mo flat. The canonical bill-shock case (verified): a free-tier static site with a ~3 MB mp3 was DDoS'd (60.7 TB egress on the peak day alone), producing a **$104,500 invoice**; Netlify support initially offered to reduce it to 5% (~$5,225), and the bill was fully waived after the Feb 2024 HN thread drew the CEO's response ([HN thread](https://news.ycombinator.com/item?id=39520776), [CEO response](https://news.ycombinator.com/item?id=39521986)). Observability limited to Netlify's own surface.
- **Heroku** (heroku.com) — The original PaaS; `git push heroku`, buildpacks, add-on marketplace. **Ended all free plans 28 Nov 2022** ([official FAQ](https://help.heroku.com/RSBRUH58/removal-of-heroku-free-product-plans-faq), [changelog](https://devcenter.heroku.com/changelog-items/2461)) — a concrete case of rented-platform terms changing under you. Eco $5/mo / Basic $7/mo / Standard-1X $50/mo. Its add-on model — each add-on with its **own** dashboard — _is_ the dashboard-sprawl pattern Alfredo names.

**Honest read.** Vercel/Netlify/Heroku deliver the deploy half brilliantly (zero-ops, mature, reliable) but structurally cannot deliver the other half: none is self-hostable, all carry usage-metered, largely **uncapped** cost tail-risk (documented from ~$96K to ~$104K in the incidents above — both eventually waived or reduced, but discretionarily), and each dashboard sees only its own platform. The honest counterweight: for a solo who just wants to ship, these incumbents' polish, cheap entry tiers, and reliability are real advantages a prototype has not yet earned.

### 5. Observability / unified dashboards — the category that narrows the white-space claim

A self-hosting indie hacker's obvious retort to "one HQ" is: _"I'll just point Grafana at everything"_ — or pay Datadog. This category must be in the comparison or the section strawmans by omission.

- **Grafana OSS + Grafana Cloud** (grafana.com) — Grafana OSS is free, AGPLv3, self-hostable, with dashboards + alerting over any number of projects and a genuinely broad data-source catalog ([pricing](https://grafana.com/pricing/), [data sources](https://grafana.com/docs/grafana/latest/datasources/)). Against Alfredo's five signals: **errors ✓** (official [Sentry data source](https://grafana.com/grafana/plugins/grafana-sentry-datasource/)); **traffic ~** (no Umami plugin — point the Postgres data source at Umami's DB + a [community dashboard](https://grafana.com/grafana/dashboards/24431-umami-business-intelligence/)); **payments ✗** (no Stripe data source — an [open feature request](https://github.com/grafana/grafana/issues/109069); DIY via the [Infinity plugin](https://grafana.com/grafana/plugins/yesoreyeram-infinity-datasource/) against the REST API); **email delivery ✗** (nothing official; same DIY path); **uptime ~** (not built into OSS — Prometheus + Blackbox Exporter + community dashboards; turnkey [Synthetic Monitoring is Cloud-only](https://grafana.com/grafana/plugins/grafana-synthetic-monitoring-app/)). Grafana Cloud's free tier is generous for indie scale (10k metric series, 50 GB logs, no expiry; Pro $19/mo + usage) ([free tier](https://grafana.com/products/cloud/free-tier/)). **The honest catch: Grafana is a dashboard _construction kit_.** Every signal requires standing up or connecting the source (exporters, DB credentials, API keys), designing dashboards, and maintaining the wiring per project. Cross-project unification is achievable — and is itself an infrastructure project. It observes; it never deploys or provisions.
- **Datadog** (datadoghq.com) — the strongest existing one-pane-of-glass: infra, APM, logs, synthetics/uptime, error tracking, RUM, 1,000+ integrations ([platform](https://www.datadoghq.com/product/platform/integrations/)). It genuinely covers business signals via official opt-in integrations: [Stripe](https://docs.datadoghq.com/integrations/stripe/) (account event logs via webhook — not a revenue dashboard out of the box), [SendGrid](https://docs.datadoghq.com/integrations/sendgrid/)/[Mailgun](https://docs.datadoghq.com/integrations/mailgun/)/[Postmark](https://docs.datadoghq.com/integrations/postmark/) email delivery. Honest catches: **not self-hostable** (SaaS only, partial CloudPrem exception for logs); **pricing shaped for companies, hostile to a many-small-projects portfolio** — modular per-product billing that stacks: Infrastructure ~$15/host/mo, APM ~$31/host/mo, synthetics per test run, logs per GB ([pricing](https://www.datadoghq.com/pricing/)); and every integration is per-account wiring you configure — Datadog observes projects, it never deploys them.
- **New Relic** (newrelic.com) — same shape: unified SaaS telemetry, real free tier (100 GB ingest/mo, 1 full user), then per-GB ($0.40+) and steep per-user pricing ($99–$349+/full user/mo); no self-host ([pricing](https://newrelic.com/pricing)).

**The corrected white-space statement** (supersedes Rev 1's overbroad "no player unifies…"): Datadog demonstrably unifies traffic, errors, uptime, and (via opt-in integrations) payments and email signals across projects — and Grafana can be assembled to. What survives, and is defensible:

1. **Nobody pairs the unified view with the deploy/wiring layer.** Datadog and Grafana observe projects; they never deploy them or provision their integrations — every new project still pays the setup tax by hand.
2. **Among self-hostable options, business signals are DIY.** Grafana has no Stripe or Postmark data source; the self-hosted "unified HQ" is a build-and-maintain project of exporters, ETL, and dashboard JSON.
3. **The turnkey unified option is rented** — Datadog/New Relic are SaaS whose per-host/per-GB/per-user pricing punishes a portfolio of many small projects.

**Alfredo's white space is the _combination_ — self-hosted, deploy-wired, business-signals-included, zero-assembly HQ — not the existence of a unified dashboard per se.**

---

## 2. The full comparison table

Every player surveyed, against the axes that matter for the section. Practice what §4 preaches: qualified cells, not bare marks. **The Alfredo row describes the product's design intent — it is a prototype; nothing in that row is shipped-and-proven.** Pricing = July 2026, re-verify before shipping any number.

| Player | Self-hostable | Deploys your projects | Wires integrations per project¹ | Cross-project dashboard | Business signals in it² | Pricing shape |
|---|---|---|---|---|---|---|
| **— By hand —** | | | | | | |
| DIY scripts + N SaaS tools | ✓ (it's your server) | manual, every time | manual, every time | ✗ (N separate dashboards) | scattered across N tabs | server cost only |
| **— Scaffolders —** | | | | | | |
| create-t3-app | n/a (emits code) | ✗ | ✗ (scaffolds auth+DB _code_, once) | ✗ | ✗ | free |
| Better-T-Stack | n/a (emits code) | ✗ (CF Workers config at most) | ✗ (scaffolds Better-Auth/Convex _code_) | ✗ | ✗ | free |
| **— PaaS / self-host deploy —** | | | | | | |
| Railway | ✗ | ✓ | ✗ (DB templates only) | ✗ (per project-env, infra only) | ✗ | $5–20/mo + usage |
| Render | ✗ | ✓ | ✗ (managed DB/KV only) | ✗ (per service, infra only) | ✗ | free–$19/user + compute |
| Fly.io | ✗ | ✓ (VMs; you wire the rest) | ✗ | ✗ (per app, Prometheus) | ✗ | pure pay-as-you-go |
| Coolify | ✓ OSS | ✓ (280+ one-click services) | ~ (deploys services as isolated boxes; no wiring/reuse) | ✗ (per project, infra only) | ✗ | free OSS / Cloud ~$5/mo |
| Dokploy | ✓ OSS | ✓ | ✗ | ✗ (per container, infra only) | ✗ | free OSS |
| CapRover / Dokku / Kamal | ✓ OSS | ✓ (deploy only) | ✗ | ✗ (minimal to none) | ✗ | free OSS |
| DO App Platform | ✗ | ✓ | ✗ | ✗ (per app insights) | ✗ | $5+/service/mo |
| **— BaaS —** | | | | | | |
| Supabase | ~ (single-project; platform-only feature gaps) | its own backend only | its own bundle (DB+auth+storage) | ✗ (one backend's Studio) | ✗ | free / $25/org / $599 |
| Nhost | ✓ OSS | its own backend only | its own bundle (Hasura+auth) | ✗ (per-project console) | ✗ | free / $25+ |
| Convex | ~ (FSL license; no support) | its own backend only | its own bundle (DB+functions+cron) | ✗ (per-deployment console) | ✗ | free / $25/dev |
| PocketBase | ✓ (single binary) | its own backend, **one app each** | its own bundle (SQLite+auth+files) | ✗ (one admin UI per app) | ✗ | free |
| Appwrite | ✓ (Docker) | its own backend only | its own bundle (auth+DB+messaging) | ~ (multi-project console, backend-scoped) | ✗ (sends mail; doesn't monitor delivery) | free / cloud tiers |
| **— Managed clouds —** | | | | | | |
| Vercel | ✗ | ✓ (frontend/serverless) | ✗ (marketplace add-ons, per project) | ✗ (Vercel-hosted projects, own metrics) | ✗ | $20/dev + ~7 usage meters |
| Netlify | ✗ | ✓ (frontend/serverless) | ✗ | ✗ (own platform only) | ✗ | $20/mo + credits |
| Heroku | ✗ | ✓ | ~ (add-ons — each with its own dashboard) | ✗ (per app) | ✗ | $5–50+/dyno, no free tier |
| **— Observability —** | | | | | | |
| Grafana OSS | ✓ | ✗ (observes only) | ✗ | ✓ **if you build it** (construction kit) | ~ DIY (Sentry ✓; Stripe/Postmark: no data source) | free (AGPLv3) |
| Grafana Cloud | ✗ (managed) | ✗ | ✗ | ✓ (assembled by you) | ~ DIY | generous free tier / $19+ + usage |
| Datadog | ✗ (SaaS only) | ✗ (observes only) | ✗ (integrations you configure) | ✓ genuinely unified | ✓ via opt-in integrations (Stripe events, SendGrid/Mailgun/Postmark) | ~$15+/host/mo **per module**, stacks fast |
| New Relic | ✗ | ✗ | ✗ | ✓ | ~ (integration-dependent) | 100 GB free, then per-GB + $99–349/user |
| **— Alfredo (design intent, unproven) —** | | | | | | |
| Alfredo | ✓ (your servers, Coolify substrate) | ✓ (select integrations → deploy) | ✓ **the core claim** (auth/email/DB/analytics/payments wired, secrets propagated, shared services reused) | ✓ **the HQ** (cross-project by design) | ✓ (traffic, email delivery, payments, errors, uptime) | unpriced prototype |

¹ "Wires integrations" = provisions/configures analytics, transactional email, auth, payments, error tracking for a project at creation time. BaaS rows wire _their own bundle_, which is real but scoped to their backend.
² "Business signals" = payments and email-delivery health, as opposed to infra telemetry (CPU/mem/logs).

Reading the table honestly: **no row except Alfredo's has ✓ in both "wires integrations" and "cross-project dashboard" — and Alfredo's row is the only unproven one.** That's the section's argument and its obligation in one line.

---

## 3. Honest win / lose / too-early axes

The spine of a fair section. Grouped so the section can concede openly.

### Where Alfredo genuinely differs (the defensible wins)
- **The combination** (§1.5's corrected statement): self-hosted **and** deploy-wired **and** business-signals-included **and** zero-assembly. Each property exists somewhere; the pairing exists nowhere. Datadog has the unified view but rents and never deploys; Grafana self-hosts but is a construction kit; Coolify deploys on your servers but doesn't wire or unify.
- **Compounding via shared integrations.** "Add project N, reuse the integrations already running" appears in no surveyed player. (Copy guard from the map: never imply the _first_ project amortizes setup — every project is the same one step; compounding comes from **overlap**, not amortization.)
- **Business signals for a portfolio, out of the box.** Payments and email-delivery health next to traffic/errors/uptime, without per-source assembly (Grafana's gap) or per-module SaaS pricing (Datadog's gap).

### Where Alfredo does not win (concede these plainly)
- **Deploy engine.** Coolify (its substrate), Dokploy, and Railway/Render/Fly already deploy services well. Alfredo does not out-deploy them; it wires + operates _on top_.
- **Observability depth.** Datadog/Grafana go far deeper on APM, tracing, log search, and alerting than an HQ dashboard aims to. Alfredo is a founder-metrics HQ, not an observability platform.
- **In-app framework/typesafety layer.** create-t3-app / Better-T-Stack own end-to-end typesafety and framework breadth; Alfredo doesn't touch it.
- **Backend depth.** Supabase/Nhost/Convex are deeper, more mature backends than anything Alfredo provisions.

### Too early to claim parity (don't overclaim)
- **Maturity, reliability, uptime track record** vs any incumbent — Alfredo is a prototype.
- **Free tier / DX polish / docs / community** — all incumbents lead here today.
- **Breadth of integrations** — Alfredo's set is 8 opinionated tools; PaaS/BaaS/observability catalogs are far larger.

### Who should **not** pick Alfredo (a trust-builder — see §4)
- People who want zero servers and never to think about ops → a managed cloud.
- People who need a deep managed backend right now → Supabase/Convex.
- People shipping one app and done → a scaffolder + any host.
- People who already run a happy Grafana/Prometheus stack → they've paid the assembly cost; Alfredo's pitch is weakest there.
- Teams needing deep APM/tracing → Datadog/New Relic class tooling, not an HQ.
Naming these openly is itself a conversion mechanic (§4).

---

## 4. Comparison-section design patterns worth grilling

### Patterns surveyed (with failure modes)
- **Feature-matrix table (us-vs-them).** The default; readers can "absorb comparable information" and _verify_ it — which is why including rows the competitor wins builds trust ([poweredbysearch](https://www.poweredbysearch.com/learn/best-saas-comparison-pages/)). Failure mode: the "feature table with a logo on top" — an all-green column reads as biased and gets closed instantly ([Medium: most SaaS comparison pages…](https://medium.com/@deian-isac/most-saas-comparison-pages-are-just-feature-tables-with-a-logo-on-top-bb58f2d9f77e)). Real examples: **Postmark**, **Unbounce** ([reviewflowz](https://www.reviewflowz.com/blog/competitive-comparison-landing-page-examples), [saaslandingpage](https://saaslandingpage.com/articles/15-best-comparison-page-examples-and-why-they-work/)).
- **Two-column "with / without X" contrast.** Communicates a worldview fast and emotionally; weak at substantiating claims and the **easiest to strawman** ("without us = chaos"). Note: this overlaps the hero demo's own "with/without Alfredo" contrast — see the demo↔comparison boundary fog in [#1](https://github.com/getalfredo/landing-page/issues/1)/[#40](https://github.com/getalfredo/landing-page/issues/40)/[#41](https://github.com/getalfredo/landing-page/issues/41).
- **Dedicated `/compare/[competitor]` (vs) pages.** One page per competitor for "X vs Y" search. "X vs Y" = decision/BOFU; "Alternatives to X" = discovery/category — different intent, different layout ([backstageseo](https://backstageseo.com/blog/b2b-comparison-pages/)). Great for high-intent traffic + AI citations; failure mode is thin duplicated templates.
- **Interactive competitor switcher (tabs/toggle).** **Heap** swaps the opposing column via an on-page menu — multi-competitor breadth with one-vs-one depth ([unkover](https://unkover.com/blog/comparison-pages/)). Suits the console/control-surface aesthetic, but tabbed content is less scannable, costs a tap on mobile, and is **weaker for SEO/AEO** when JS-gated or split off one crawlable URL ([eleken tabs UX](https://www.eleken.co/blog-posts/tabs-ux)).
- **"When to use which" honest guide / segmented scorecards.** **Snov.io** shows separate scorecards per solution instead of one long table ([saaslandingpage](https://saaslandingpage.com/articles/15-best-comparison-page-examples-and-why-they-work/)). Highest-trust; fits Alfredo's "six approaches, not one product" reality better than a us-vs-them grid.
- **Checkmark/x grid.** Compact but lowest-information — a bare ✓/✗ hides nuance and is the easiest place to strawman a partial competitor capability. Best examples add a qualifier/tooltip per cell (as §2's table does).

### Staying fair / anti-strawman (the standing rule, operationalized)
- **Give competitors real wins** — verifiable tables beat sales collateral ([poweredbysearch](https://www.poweredbysearch.com/learn/best-saas-comparison-pages/)).
- **Add an explicit "who should NOT use Alfredo."** Admitting who your product is not for builds trust — consumer research calls this the **"blemishing effect"**: a small dose of negative information can make the overall pitch _more_ persuasive (Ein-Gar, Shiv & Tormala, _Journal of Consumer Research_, 2012 — [abstract](https://academic.oup.com/jcr/article-abstract/38/5/846/1727913)). It also sheds bad-fit prospects who'd churn anyway. _(Rev 2: replaces an unverifiable "~13.8% conversion" figure from a content-farm source.)_
- **Avoid loaded adjectives** — "revolutionary/seamless" for us vs "basic/clunky/outdated" for them is the canonical red flag ([textranch](https://blog.textranch.com/how-to-edit-comparison-pages-that-need-to-rank-and-convert/) — qualitative guidance only; its statistics did not survive verification).
- **Date & source claims** — competitor features change; undated ✗ marks go stale and read as dishonest (hence the July-2026 stamps and per-cell qualifiers in §2).
- **Praised-for-honesty exemplars:** **PostHog's** "best [X] alternatives" pages openly recommend competitors for cases PostHog loses ([best-fathom-alternatives](https://posthog.com/blog/best-fathom-alternatives), [best-plausible-alternatives](https://posthog.com/blog/best-plausible-alternatives)); third-party **EU Picks Plausible vs Fathom** ("wins for 9 out of 10 people," then the edge cases, [eupick](https://eupick.com/blog/plausible-vs-fathom/)).

### AEO/SEO value (ties to [#37](https://github.com/getalfredo/landing-page/issues/37)) — statistics verified in Rev 2
- **High commercial intent, with real numbers.** Grow & Convert's published analysis of client SEO conversion rates found **comparison/alternatives keywords ("X vs Y," "X alternative") the highest-converting content category, averaging 8.43%** vs 4.85% for main-category keywords — with the honest caveat that most individual posts convert under 4% and outliers pull the average up ([growandconvert.com](https://www.growandconvert.com/conversion-rate-optimization/average-seo-conversion-rate/)).
- **LLMs cite comparison content disproportionately — measured.** Omniscient Digital analyzed 23,387 AI citations across ChatGPT, Perplexity, Gemini, AI Mode, and AI Overviews: **comparison-style listicles are the single most-cited format at 21.9% of all citations, rising to ~41% for commercial-intent queries** ([beomniscient.com](https://beomniscient.com/blog/content-types-cited-in-llms/)). _(Rev 2: replaces an unverifiable "2.4×" vendor figure.)_
- **Structure and generative-engine visibility.** The Princeton/AI2/GaTech GEO study (KDD 2024) found adding **statistics, quotations, and source citations** boosted generative-engine visibility by up to ~40% across 10,000 queries ([arXiv:2311.09735](https://arxiv.org/abs/2311.09735)). A widely-repeated "tables lift citations 2.5×" claim could **not** be traced to any real study and was dropped in Rev 2; use a real HTML `<table>` for extractability and accessibility, not because of that number.
- **LLM-referred traffic quality — treat as anecdote.** One enterprise told VentureBeat its LLM-referred traffic converts at 30–40% ([venturebeat](https://venturebeat.com/technology/llm-referred-traffic-converts-at-30-40-and-most-enterprises-arent-optimizing)); larger multi-site studies find more modest advantages (~18% in one 13-month study ([searchengineland](https://searchengineland.com/what-13-months-of-data-reveals-about-llm-traffic-growth-and-conversions-470115)); no statistically significant edge in Amsive's 54-site pair study). Directionally positive, not a benchmark.
- **Machine-readable structure.** Open with the answer (verdict up top), use a real `<table>`, add **FAQPage JSON-LD** (Q-framed criteria: "Can Alfredo self-host?") and **ItemList** for alternatives sets ([mqlmagnet](https://www.mqlmagnet.com/post/faq-schema-for-ai-search), [aeolyft](https://aeolyft.com/blog/best-schemaorg-types-for-product-comparison-tables-4-top-picks-2026/)). **Note:** this directly reopens the no-JSON-LD decision from [#21](https://github.com/getalfredo/landing-page/issues/21) — route via [#37](https://github.com/getalfredo/landing-page/issues/37).

### Mobile mechanics (the indie-hacker audience is on phones)
Wide multi-column tables are "technically responsive but practically unusable" on phones. Fixes, best-first: **column focus / pin-and-swipe** (pin our column or the label column, swipe competitors) > **sticky first column + sticky header** (needs `overflow-x:auto`, opaque cells, careful z-index) > **row-to-card collapse** > **per-product swipeable scorecards** (the Snov.io approach). Plain horizontal scroll is a last resort, not a design ([razegrowth](https://razegrowth.com/blog/saas-feature-comparison-tables), [css-tricks sticky table](https://css-tricks.com/a-table-with-both-a-sticky-header-and-a-sticky-first-column/)).

---

## 5. Decisions to grill (hand-off to [#41](https://github.com/getalfredo/landing-page/issues/41))

1. **Axis of comparison: products vs approaches.** Alfredo competes with **six approaches**, not one product. A category-axis "when to use which" guide likely honors the honesty rule better than a us-vs-named-competitor checkmark grid. Grill: approach-axis, product-axis, or a hybrid (approaches in the section, named `/compare/x` pages for search)?
2. **Does the observability category appear on the page?** §1.5 says the comparison strawmans by omission without it — but "Grafana/Datadog" may be too much surface area for a landing-page section. Decide: full row, one honest sentence ("already happy with Grafana? we're not for you"), or dedicated-page-only.
3. **On-page section vs dedicated `/compare/[x]` pages** — same content, a teaser linking out, or both? (Section = placement; dedicated pages = BOFU search + AI citation.)
4. **Static table vs interactive competitor-switcher** — a Heap-style toggle suits the HQ/control-surface aesthetic and consolidates six approaches, but costs scannability and AEO. Weigh against the console identity.
5. **How honesty is encoded structurally** — a dedicated "when NOT to use Alfredo" block + competitor-wins rows + dated/qualified cells (as §2 models), vs relying on tone. Pick the mechanism, not just the intention.
6. **Cell encoding** — bare ✓/✗ vs qualified cells/tooltips (bare marks are where strawmanning sneaks in; §2's table is the reference).
7. **Mobile strategy for a wide table** — commit early to pin-and-swipe / sticky-first-column / row-to-card; don't let it default to broken horizontal scroll.
8. **Demo ↔ comparison boundary** — does the "with/without Alfredo, vs Better-T-Stack" contrast live in the demo, this section, or both? (Open fog in [#1](https://github.com/getalfredo/landing-page/issues/1); decided across [#40](https://github.com/getalfredo/landing-page/issues/40)/[#41](https://github.com/getalfredo/landing-page/issues/41).)
9. **Reopen JSON-LD?** Comparison content is the strongest AEO case for FAQPage/ItemList schema; [#21](https://github.com/getalfredo/landing-page/issues/21) shipped none. Route the actual call through [#37](https://github.com/getalfredo/landing-page/issues/37).

## Sources
Primary: create.t3.gg, better-t-stack.dev + create-better-t-stack README, railway.com/docs, render.com, fly.io, coolify.io + coollabsio/coolify, dokploy.com + Dokploy/dokploy, caprover.com, dokku.com, kamal-deploy.org, digitalocean.com, supabase.com (docs/pricing/self-host matrix), nhost.io + nhost/nhost, convex.dev (pricing/open-source/self-hosting), pocketbase.io + pocketbase/pocketbase, appwrite.io, vercel.com (pricing/changelog/blog), netlify.com, heroku.com help center + devcenter changelog, grafana.com (pricing/plugins/dashboards), docs.datadoghq.com (Stripe/SendGrid/Mailgun/Postmark integrations), newrelic.com. Incidents (verified): Cara $96,280 Vercel bill (TechCrunch, InfoQ, HN 40612981), Netlify $104,500 DDoS bill (HN 39520776 + CEO response 39521986), Heroku free-plan removal (official FAQ). Studies (verified): Grow & Convert SEO conversion analysis, Omniscient Digital AI-citation study (23,387 citations), GEO paper arXiv:2311.09735, Ein-Gar/Shiv/Tormala JCR 2012 (blemishing effect). Comparison-pattern write-ups (qualitative use only): poweredbysearch, saaslandingpage, reviewflowz, unkover, backstageseo, textranch, razegrowth, css-tricks, mqlmagnet, aeolyft, posthog.com, eupick.com. **Removed in Rev 2 as unverifiable:** "13.8% conversion" (textranch), "2.4× LLM citation" (citevera), "2.5× table lift" (averi.ai), "$23K Vercel DDoS bill" (usagebox.com).
