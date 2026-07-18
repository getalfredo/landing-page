# Landscape scoring: doubt metric applied to the full field

> Findings doc for [#64](https://github.com/getalfredo/landing-page/issues/64) (`wayfinder:research`, part of [#1](https://github.com/getalfredo/landing-page/issues/1)).
> Applies the criteria locked in [#63](./63-comparison-criteria.md) to the field surveyed in [#39](./39-competitive-landscape-comparison-section.md). Output feeds the cast lock ([#65](https://github.com/getalfredo/landing-page/issues/65)) and the prototype ([#43](https://github.com/getalfredo/landing-page/issues/43)).
> Date: 2026-07-18. All star counts, HN counts, and pricing were pulled fresh on this date; the #41 draft gut scores were not used as anchors.

## 0. Method

- **Doubt = presence × plausibility**, 1–5 integers each, per the [#63 rubric](./63-comparison-criteria.md). Scored at the product level.
- **Presence evidence collected 2026-07-18:** GitHub stars via the GitHub API; HN presence via the Algolia HN API (stories with the product name in the title, since 2025-01-01, with top-story points). Reddit's search API was unavailable (blocked unauthenticated), so r/selfhosted presence is cited qualitatively only where it is defensible without a number. HN *comment*-mention counts were also collected but discarded: several product names are homonyms (Nhost/Nostr, Convex/geometry, Kamal, Railway, Komodo) and the counts were visibly polluted.
- **Plausibility evidence:** current capability and pricing pages, re-fetched 2026-07-18 for every cell a cast record leans on. The [#39 §2](./39-competitive-landscape-comparison-section.md) table (snapshot 2026-07-14) was re-verified, not trusted; differences are listed in §5.
- **Tiers are recommendations, not verdicts.** Per #63 the metric ranks and never cuts; the cast lock (#65) makes the calls. The eight cast members keep their subpages regardless of tier shown here.
- Axes are numbered per #63 §3: 1 runs on your servers · 2 deploys · 3 wires at birth · 4 one view across projects · 5 business signals · 6 works without assembly · 7 cost shape for many small projects.

## 1. The ranking

| # | Player | Presence | Plausibility | Doubt | Axes the doubt touches | Recommended tier |
|---|--------|:---:|:---:|:---:|---|---|
| 1 | Doing it by hand | 5 | 5 | **25** | all seven | on-page answer (the baseline frame) |
| 1 | Coolify | 5 | 5 | **25** | 1, 2, 6 | on-page answer (anchor) |
| 1 | Grafana | 5 | 5 | **25** | 1, 4, 5, 6 | on-page answer (anchor, guaranteed per #45) |
| 4 | Datadog | 5 | 4 | **20** | 4, 5, 7 | on-page answer (anchor) |
| 5 | Vercel | 5 | 3 | **15** | 2, 7 | on-page answer |
| 5 | Supabase | 5 | 3 | **15** | 1, 3 | on-page answer |
| 5 | Dokploy | 3 | 5 | **15** | 1, 2, 6 | on-page answer (anchor) |
| 5 | Cloudflare Workers/Pages | 5 | 3 | **15** | 2, 7 | **unlisted, flagged to #65** |
| 9 | Railway | 4 | 3 | **12** | 2, 4, 7 | subpage-only (cast) |
| 9 | Fly.io | 4 | 3 | **12** | 2, 7 | mention |
| 9 | Heroku | 4 | 3 | **12** | 2, 3, 7 | mention |
| 12 | Dokku | 3 | 3 | **9** | 1, 2 | mention |
| 12 | Appwrite | 3 | 3 | **9** | 1, 3, 4 | mention |
| 12 | Render | 3 | 3 | **9** | 2 | mention |
| 12 | DO App Platform | 3 | 3 | **9** | 2 | mention |
| 12 | New Relic | 3 | 3 | **9** | 4, 5, 7 | mention |
| 17 | PocketBase | 4 | 2 | **8** | 3, 6 | mention |
| 17 | Netlify | 4 | 2 | **8** | 2, 7 | mention |
| 17 | CapRover | 2 | 4 | **8** | 1, 2 | mention |
| 17 | Portainer | 4 | 2 | **8** | 1, 4 | mention (unlisted, below threshold) |
| 21 | Convex | 3 | 2 | **6** | 3 | mention |
| 21 | Kamal | 2 | 3 | **6** | 1, 2 | mention |
| 21 | Komodo | 2 | 3 | **6** | 1, 2, 4 | omit (unlisted, below threshold) |
| 24 | create-next-app | 4 | 1 | **4** | 3 | mention |
| 24 | Better-T-Stack | 2 | 2 | **4** | 3 | subpage-only (cast; "use both" piece protected by #41 decision 4) |
| 26 | create-t3-app | 3 | 1 | **3** | 3 | mention |
| 27 | Nhost | 1 | 2 | **2** | 1, 3 | omit |
| — | Vercel Templates / Supabase starters | — | — | — | 3 | fold into parent products, no own row |

One unlisted product scored ≥ 15: **Cloudflare Workers/Pages** (§6). Portainer and Komodo were the strongest other unlisted candidates checked; both land below 15.

## 2. Cast records (full 8-field records per #63 §4)

### 2.1 Coolify — doubt 25 (presence 5 × plausibility 5)

1. **Doubt sentence.** "Can't Coolify already deploy all my projects on my own servers?"
2. **Presence 5** — 58,847 GitHub stars (GitHub API, 2026-07-18); 21 HN title-match stories since Jan 2025, top ["Coolify: Open-source and self-hostable Heroku / Netlify / Vercel alternative"](https://news.ycombinator.com/item?id=43555996) at 382 pts (Apr 2025); a fixture of r/selfhosted VPS threads. Rubric anchor for presence is met: the audience does not need it explained. **Plausibility 5** — rubric anchor named in #63: it deploys to your servers and has a dashboard.
3. **Seven cells (2026-07-18).**
   - *Runs on your servers:* yes. Free OSS, "without any restrictions on features" ([coolify.io](https://coolify.io/pricing)).
   - *Deploys your projects:* yes. Apps, databases, one-click services (280+ per its docs, July 2026), multi-server.
   - *Wires each project at birth:* no. One-click services come up as separate boxes; you connect auth, email, analytics and payments yourself, and nothing is shared between projects.
   - *One view across projects:* no. The dashboard is per project and covers deploys and infra.
   - *Sees your business:* no. CPU, logs, deploy status; no payments or email delivery.
   - *Works without assembly:* on the deploy side, yes. The ops view Alfredo describes does not exist in it.
   - *Cost shape:* free self-hosted; Coolify Cloud $5/mo for 2 servers, $3/mo per extra server ([pricing](https://coolify.io/pricing), 2026-07-18).
4. **You keep** — Coolify itself. Alfredo uses it as its deploy substrate. Your servers and your deploy engine stay.
5. **Alfredo adds** — wiring at project creation (auth, email, database, analytics, payments configured, secrets moved for you, integrations reused across projects) and one dashboard over all projects with business signals. Alfredo is an unproven prototype; Coolify is the proven part of the stack.
6. **Stay put if…** — you are fine connecting integrations yourself and do not want a cross-project view, or you will not put a prototype in front of your deploys.
7. **Coolify's real wins** — mature, widely used, large service catalog, active community. It works today.
8. **Relationship.** Alfredo runs on top of Coolify; it does not replace it.

### 2.2 Grafana — doubt 25 (presence 5 × plausibility 5)

1. **Doubt sentence.** "Can't I just point Grafana at everything?"
2. **Presence 5** — 75,622 stars (2026-07-18); 103 HN title-match stories since Jan 2025 (top 245 pts); rubric names it as a presence-5 example. **Plausibility 5** — rubric anchor: dashboards over everything.
3. **Seven cells (2026-07-18).**
   - *Runs on your servers:* yes. Grafana OSS is free, AGPLv3.
   - *Deploys your projects:* no. It observes; it never deploys or provisions.
   - *Wires each project at birth:* no. Does not apply; every source is wiring you do.
   - *One view across projects:* yes, if you build it. Cross-project unification is achievable and is itself an infrastructure project.
   - *Sees your business:* DIY. Sentry data source exists; Stripe is still an open plugin request ([grafana/grafana#109069](https://github.com/grafana/grafana/issues/109069), re-checked 2026-07-18: open, roadmap status "Requested"); nothing official for Postmark or email delivery.
   - *Works without assembly:* no. It is a dashboard construction kit: exporters, credentials, dashboard JSON, maintained per project.
   - *Cost shape:* OSS free. Grafana Cloud free tier: 10k metric series, 50 GB logs, 3 active users, 14-day retention; Pro $19/mo base plus usage ([pricing](https://grafana.com/pricing/), 2026-07-18).
4. **You keep** — your Grafana, if you run one. Alfredo does not replace deep custom dashboards.
5. **Alfredo adds** — the assembled cross-project view without the assembly, plus the deploy and wiring side Grafana never touches. Alfredo is a prototype; Grafana is two decades of dashboard depth.
6. **Stay put if…** — you already run a happy Grafana/Prometheus stack. You have paid the assembly cost; Alfredo's pitch is weakest there.
7. **Grafana's real wins** — depth, flexibility, the data-source ecosystem, and a genuinely free self-hosted tier.
8. **Relationship.** Grafana can be built into most of what Alfredo ships assembled; Alfredo also deploys projects, which Grafana never does.

### 2.3 Datadog — doubt 20 (presence 5 × plausibility 4)

1. **Doubt sentence.** "Isn't Datadog already the one dashboard over everything?"
2. **Presence 5** — 106 HN title-match stories since Jan 2025; new tools launch as "open-source Datadog alternative" (e.g. ClickStack, 241 pts, 2025), which is the default-vocabulary test passed. Revised up from the #41 gut draft (3): the name needs no explanation even to people who would never pay for it. **Plausibility 4** — it genuinely shows a unified cross-project view including business signals via opt-in integrations (Stripe events, SendGrid/Mailgun/Postmark per its docs); it is SaaS-only and never deploys, so not 5.
3. **Seven cells (2026-07-18).**
   - *Runs on your servers:* no. SaaS only; CloudPrem is a partial exception for logs.
   - *Deploys your projects:* no. It observes; it never deploys.
   - *Wires each project at birth:* no. Every integration is per-account wiring you configure.
   - *One view across projects:* yes. The strongest existing single pane.
   - *Sees your business:* yes, via opt-in integrations — Stripe account events, SendGrid/Mailgun/Postmark delivery ([docs.datadoghq.com](https://docs.datadoghq.com/integrations/stripe/), July 2026). Not a revenue dashboard out of the box.
   - *Works without assembly:* partly. Agent install plus per-integration setup per project; less work than Grafana, still work.
   - *Cost shape:* per host, per module, and it stacks: Infrastructure Pro $15/host/mo billed annually ($18 on-demand), APM $31/host/mo with infrastructure ($36 standalone, $48 on-demand) ([pricing](https://www.datadoghq.com/pricing/), 2026-07-18). Shaped for companies, not for a portfolio of small projects.
4. **You keep** — Datadog where you need depth. Alfredo does not attempt APM, tracing, or log search.
5. **Alfredo adds** — the same one-view idea at portfolio scale, on your servers, at flat cost, plus deploying and wiring the projects it watches. Alfredo is a prototype; Datadog is the mature product.
6. **Stay put if…** — you need deep APM, tracing, or log search. An HQ dashboard is not that.
7. **Datadog's real wins** — depth, 1,000+ integrations, polish, and a real unified view that exists today.
8. **Relationship.** Alfredo covers the dashboard part of Datadog for many small self-hosted projects; it does not attempt the deep tracing, and it deploys, which Datadog never does.

### 2.4 Vercel — doubt 15 (presence 5 × plausibility 3)

1. **Doubt sentence.** "Can't I just put everything on Vercel?"
2. **Presence 5** — rubric names it as a presence-5 example; 322 HN title-match stories since Jan 2025, including the [April 2026 security incident](https://news.ycombinator.com/item?id=47824463) at 867 pts. **Plausibility 3** — deploys well, but rented and per-project (the rubric's Railway shape); the thought dies on "runs on your servers".
3. **Seven cells (2026-07-18).**
   - *Runs on your servers:* no. The platform is not self-hostable; Next.js itself is OSS.
   - *Deploys your projects:* yes. Frontend and serverless, with strong preview workflows.
   - *Wires each project at birth:* no. Marketplace add-ons are connected per project by you.
   - *One view across projects:* no. Only Vercel-hosted projects, own-platform metrics.
   - *Sees your business:* no.
   - *Works without assembly:* on the deploy side, yes — that is its strength.
   - *Cost shape:* Pro $20/user/mo, 1 TB transfer included, then from $0.15/GB, across several usage meters ([pricing](https://vercel.com/pricing), 2026-07-18; unchanged from the snapshot). Documented tail risk: the June 2024 Cara bill of $96,280 in one week (TechCrunch, [HN](https://news.ycombinator.com/item?id=40612981)).
4. **You keep** — any project you leave on Vercel; nothing in Alfredo depends on it.
5. **Alfredo adds** — your own servers, a flat cost shape, integration wiring at creation, and one view across all projects. Alfredo is a prototype and has none of Vercel's operational track record.
6. **Stay put if…** — you want zero servers and never want to think about ops. That is a reasonable want, and it is not Alfredo.
7. **Vercel's real wins** — deploy polish, preview deployments, a generous hobby tier, reliability at scale.
8. **Relationship.** Vercel rents you the deploy half; Alfredo self-hosts both halves with opposite trade-offs.

### 2.5 Supabase — doubt 15 (presence 5 × plausibility 3)

1. **Doubt sentence.** "Doesn't Supabase already wire auth, database and storage for me?"
2. **Presence 5** — rubric example; 106,527 stars (2026-07-18); 216 HN title-match stories since Jan 2025; [$200M Series D at $2B](https://news.ycombinator.com/item?id=43763225) (Apr 2025, 342 pts). **Plausibility 3** — it wires a real bundle, but one backend per project; no deploy of your app, no cross-project operations.
3. **Seven cells (2026-07-18).**
   - *Runs on your servers:* partly. Docker self-hosting exists, but documented gaps remain: self-hosted behaves as one project, no orgs; managed backups/PITR, branching, and multi-project Studio are platform-only ([self-host feature matrix](https://supabase.com/docs/guides/troubleshooting/are-all-features-available-in-self-hosted-supabase-THPcqw), July 2026).
   - *Deploys your projects:* its own backend only. Your app still needs a host.
   - *Wires each project at birth:* its own bundle — Postgres, auth, storage — which is real and scoped to that backend.
   - *One view across projects:* no. Studio is one backend's console.
   - *Sees your business:* no.
   - *Works without assembly:* managed, yes; self-hosted is a Docker stack you run per project.
   - *Cost shape:* Free $0, Pro from $25/mo, Team from $599/mo ([pricing](https://supabase.com/pricing), 2026-07-18; unchanged from the snapshot).
4. **You keep** — Supabase in any project that uses it. Alfredo wires a different bundle (Convex, Better-Auth) and does not migrate yours.
5. **Alfredo adds** — deploys the whole project on your servers, wires beyond the backend (email, analytics, payments, uptime), and gives one view across all projects. Alfredo is a prototype; Supabase is a mature backend.
6. **Stay put if…** — you need a deep managed Postgres backend right now. Nothing Alfredo provisions matches that depth.
7. **Supabase's real wins** — maturity, docs, community, a genuinely useful free tier, backend depth.
8. **Relationship.** Supabase gives one project a backend; Alfredo wires and watches all of your projects, and the two can coexist.

### 2.6 Dokploy — doubt 15 (presence 3 × plausibility 5)

1. **Doubt sentence.** "Can't Dokploy do the same thing on my VPS?"
2. **Presence 3** — rubric anchor names Dokploy at 3 (known to the niche). Fresh evidence puts it at the top of that band: 35,735 stars on 2026-07-18, up from ~26k in the July-14 snapshot; steady niche coverage (["Dokploy is the sweet spot between PaaS and EC2"](https://news.ycombinator.com/item?id=44884077), 98 pts, Aug 2025). At presence 4 the doubt would be 20; the tier recommendation would not change. **Plausibility 5** — a self-hosted PaaS that deploys to your servers, same shape as the Coolify anchor.
3. **Seven cells (2026-07-18).**
   - *Runs on your servers:* yes. OSS, Apache-2.0.
   - *Deploys your projects:* yes. Docker Compose native, database provisioning with backups, multi-server via Swarm.
   - *Wires each project at birth:* no. No integration wiring, no shared services.
   - *One view across projects:* no. Real-time CPU/memory/storage/network per resource; monitoring stops at the container boundary.
   - *Sees your business:* no.
   - *Works without assembly:* on the deploy side, yes.
   - *Cost shape:* free OSS self-hosted. New since the snapshot: a paid Dokploy Cloud — Hobby $4.50/mo per server, Startup from $15/mo with 3 servers ([pricing](https://dokploy.com/pricing), 2026-07-18).
4. **You keep** — Dokploy, if it is your deploy engine today. Alfredo does not run on it; its substrate is Coolify.
5. **Alfredo adds** — the wiring and HQ layer that has no equivalent in Dokploy. Adopting Alfredo next to Dokploy means running a second deploy stack or switching substrates — a real cost, said plainly.
6. **Stay put if…** — Dokploy already deploys your projects and deploys are your main need. Switching substrates to get a prototype's dashboard is hard to justify.
7. **Dokploy's real wins** — fast-growing, Docker Compose native, clean interface, free.
8. **Relationship.** Dokploy solves the same deploy problem as Alfredo's Coolify substrate; Alfredo's wiring and dashboard layer sits above that problem, not inside it.

### 2.7 Railway — doubt 12 (presence 4 × plausibility 3)

1. **Doubt sentence.** "Can't Railway spin up my apps and databases already?"
2. **Presence 4** — widely known among indie hackers; HN title counts are polluted by the common word, but platform incidents alone reach the front page ("Incident Report: Railway Blocked by Google Cloud", 560 pts, 2025, via Algolia HN search). Not default vocabulary at the Vercel level. **Plausibility 3** — the rubric's own anchor: deploys, but rented and per-project.
3. **Seven cells (2026-07-18).**
   - *Runs on your servers:* no.
   - *Deploys your projects:* yes, with one-click database templates.
   - *Wires each project at birth:* no. Database templates only.
   - *One view across projects:* no. The observability dashboard is scoped per project-environment, infra only (docs, July 2026).
   - *Sees your business:* no.
   - *Works without assembly:* on the deploy side, yes.
   - *Cost shape:* Hobby $5/mo with included usage, Pro $20/mo per seat, then usage ([pricing](https://railway.com/pricing), 2026-07-18; unchanged from the snapshot).
4. **You keep** — any project you leave on Railway.
5. **Alfredo adds** — your own hardware, flat costs, wiring beyond databases, one view across projects. Alfredo is a prototype; Railway is a managed platform with a team behind it.
6. **Stay put if…** — you are happy paying for managed infrastructure and run few projects.
7. **Railway's real wins** — good DX, low entry price, managed reliability, quick database templates.
8. **Relationship.** Railway rents the deploy half per project; Alfredo self-hosts deploys and adds the cross-project operations layer.

### 2.8 Better-T-Stack — doubt 4 (presence 2 × plausibility 2)

1. **Doubt sentence.** "Can't Better-T-Stack wire my auth and database when it scaffolds?"
2. **Presence 2** — 5,580 stars (2026-07-18); near-zero HN presence (one 1-pt story since Jan 2025). Known inside the TypeScript scaffolding niche. **Plausibility 2** — the doubt lives exactly one beat on axis 3 ("it sets up Better-Auth and Convex for me") and dies on the next: it emits code once and is gone; nothing runs, nothing is watched.
3. **Seven cells (2026-07-18, README re-checked).**
   - *Runs on your servers:* not applicable — it emits code.
   - *Deploys your projects:* no. At most a Cloudflare Workers deploy config.
   - *Wires each project at birth:* as code, once. Database "setup" is connection templates (Turso, Neon, Supabase, D1, Docker); nothing is provisioned or managed.
   - *One view across projects:* no.
   - *Sees your business:* no.
   - *Works without assembly:* the scaffold is one command; everything after is yours.
   - *Cost shape:* free.
4. **You keep** — the scaffolded code, permanently and lock-in-free. Nothing about Alfredo changes it.
5. **Alfredo adds** — running services instead of config stubs: the wired integrations exist and are watched after day one. Alfredo is a prototype; the scaffolder's output has no runtime to trust.
6. **Stay put if…** — you ship one app and stop. A scaffolder plus any host is enough, and there is nothing to operate across.
7. **Better-T-Stack's real wins** — breadth of frameworks, permanent output, zero dependency on anyone's runtime.
8. **Relationship.** Use both: Better-T-Stack writes the code, Alfredo runs and watches it. (Its subpage stays a "use both" piece per [#41] decision 4; the low score does not touch that.)

## 3. Everyone else: scores, evidence, cell notes

Format: scores → evidence → axes touched → cell notes for the backing table.

- **Doing it by hand — 25 (5 × 5).** The audience's status quo (#39 §1.0); presence needs no citation, plausibility is literal: it does everything Alfredo does, paid in your time. Axes: all seven. Cells: your servers, manual deploys, manual wiring every time, N dashboards, signals scattered, maximum assembly, server cost only. Tier: on-page — it is the baseline frame, not a competitor row.
- **Fly.io — 12 (4 × 3).** 81 HN title stories since Jan 2025; a recurring HN name. Deploys micro-VMs but you wire everything; rented; per-app Prometheus metrics. Axes 2, 7. Pure pay-as-you-go (~$1.94/mo for a small always-on VM, July 2026 snapshot).
- **Heroku — 12 (4 × 3).** Still common vocabulary: ["Replacing a $3000/mo Heroku bill with a $55/mo server"](https://news.ycombinator.com/item?id=45661253) hit 813 pts in Oct 2025. Plausibility 3 — it deploys and its add-ons *do* provision services per app, the closest managed-cloud lookalike to axis 3; but rented, per-app, and each add-on brings its own dashboard (the sprawl pattern). No free tier since Nov 2022. Axes 2, 3, 7.
- **Dokku — 9 (3 × 3).** 32,044 stars, long-known. Git-push deploys on your server, CLI-first, no bundled dashboard, no wiring. Axes 1, 2.
- **Appwrite — 9 (3 × 3).** 56,608 stars; self-hostable; multi-project console (backend-scoped); Appwrite Sites now markets itself as ["the open-source Vercel alternative"](https://news.ycombinator.com/item?id=44029057) (Show HN, May 2025), so it deploys sites too. Still no cross-project business dashboard; Messaging sends mail, does not monitor delivery. Axes 1, 3, 4.
- **Render — 9 (3 × 3).** Managed Heroku-shape PaaS; per-service metrics; Hobby free, Professional $19/user/mo plus compute (Apr 2026 plans, per snapshot). Axes 2.
- **DO App Platform — 9 (3 × 3).** DigitalOcean the brand is universal; the product itself is band 3. Managed PaaS from $5/mo, per-app insights only. Axes 2.
- **New Relic — 9 (3 × 3).** Known observability name (32 HN title stories); unified SaaS telemetry, real free tier (100 GB/mo), then per-GB plus steep per-user pricing; no self-host. Axes 4, 5, 7.
- **PocketBase — 8 (4 × 2).** 59,877 stars; [671-pt HN story](https://news.ycombinator.com/item?id=46075320) (Nov 2025); the indie darling. But one binary backs one app; five products means five admin UIs; no deploy path, no payments/email/analytics scope. Axes 3, 6.
- **Netlify — 8 (4 × 2).** Known name; frontend-scoped deploys, rented, credit-based pricing (Free 300 credits/mo, Pro $20/mo per snapshot); no backend wiring, own-platform observability. Axes 2, 7.
- **CapRover — 8 (2 × 4).** 15,094 stars but fading mindshare (zero relevant HN title hits since Jan 2025). Plausibility high for the same reason as Coolify: self-hosted PaaS with a dashboard and one-click catalog. Axes 1, 2.
- **Portainer — 8 (4 × 2).** Unlisted candidate, checked: 37,991 stars, an r/selfhosted staple for container management. It shows and manages containers across hosts and can deploy stacks, but wires nothing and knows nothing about business signals. Axes 1, 4. Below the 15 flag line.
- **Convex — 6 (3 × 2).** Rubric anchor at presence 3. Backend bundle with per-deployment console; FSL self-hosting without support. Also on Alfredo's own truth-list — framing is "we wire and operate it", not "we replace it". Axes 3.
- **Kamal — 6 (2 × 3).** Rubric anchor puts it at presence 1; fresh evidence (14,409 stars, steady HN chatter in Rails circles) supports 2 for the wider self-hosting audience. Deploy pipeline for your own VMs, no UI, no wiring. Axes 1, 2.
- **Komodo — 6 (2 × 3).** Unlisted candidate, checked: 11,661 stars (moghtech/komodo), rising in r/selfhosted; builds and deploys across servers with a web UI. Small mindshare; no integration wiring, no business signals. Axes 1, 2, 4. Below the flag line.
- **create-next-app — 4 (4 × 1).** Everyone knows it; scaffolds one app and stops. The "operating" thought does not survive a sentence (rubric anchor). Axes 3.
- **create-t3-app — 3 (3 × 1).** 29,048 stars but zero HN title stories since Jan 2025; past its peak, still known in the TS niche. Scaffolder anchor: plausibility 1. Axes 3.
- **Nhost — 2 (1 × 2).** Rubric anchor at presence 1; 9,241 stars. Self-hostable Hasura-based backend bundle, per-project console. Axes 1, 3.
- **Vercel Templates / Supabase starters** — not scored separately; they are features of scored products and fold into those rows.

## 4. Tier recommendations (input to #65, not verdicts)

- **On-page answer:** by hand, Coolify, Grafana (guaranteed per #45), Datadog, Vercel, Supabase, Dokploy. Ordered by doubt, this is every player at 15+ that is already cast.
- **Subpage-only:** Railway, Better-T-Stack (its "use both" subpage is protected regardless of score).
- **Mention** (a named line in the backing table or a sentence, no own answer): Fly.io, Heroku, Dokku, Appwrite, Render, DO App Platform, New Relic, PocketBase, Netlify, CapRover, Portainer, Convex, Kamal, create-next-app, create-t3-app.
- **Omit** (backing-table row at most): Nhost, Komodo.
- **Cloudflare Workers/Pages** is flagged (§6); its tier is #65's call — at doubt 15 it would sit in on-page-answer territory if added to the cast.

## 5. What changed since the #39 snapshot (2026-07-14 → 2026-07-18)

- **Dokploy now sells a cloud tier.** The snapshot listed it as free OSS only; dokploy.com/pricing now shows Dokploy Cloud Hobby at $4.50/mo per server and Startup from $15/mo. Stars grew from ~26k to 35,735 (the snapshot's figure was stale, not four days of growth).
- **Grafana Cloud free tier has a 3-active-user limit** and 14-day retention alongside the 10k series / 50 GB logs the snapshot recorded; Pro is a $19/mo base fee plus usage, not a flat $19.
- **Datadog on-demand rates** sit above the snapshot's annual figures: Infrastructure $18 and APM $48 on-demand vs $15/$31 billed annually. Worth carrying both numbers in any shipped cell.
- **Coolify Cloud pricing is now concretely $5/mo for 2 servers + $3/server** (snapshot said "~$4–5/mo").
- **Unchanged and re-verified:** Vercel Pro $20/user, 1 TB, $0.15/GB; Railway Hobby $5 / Pro $20 per seat; Supabase $0/$25/$599; Grafana still has no Stripe data source (issue #109069 open, "Requested"); Better-T-Stack still scaffolds only.
- **Mindshare events since the snapshot's sources:** Vercel's April 2026 security incident (867 pts on HN) and the Oct 2025 "Replacing a $3000/mo Heroku bill" thread (813 pts) both reinforce, not change, the presence scores.

## 6. Flag to #65: Cloudflare Workers/Pages — doubt 15 (presence 5 × plausibility 3)

Not in the #39 survey. Presence 5: Cloudflare is default vocabulary, and 2026 coverage describes Workers (now absorbing Pages) as a default deploy target for side projects, with native support for Next.js, SvelteKit, Nuxt and Astro and a free tier that covers most prototypes ([cogley.jp](https://cogley.jp/articles/cloudflare-pages-to-workers-migration), [mecanik.dev](https://mecanik.dev/en/posts/cloudflare-pages-vs-workers-which-to-use-in-2026/)). Plausibility 3: it deploys projects and binds D1/KV/R2 per project, but it is rented, per-project, not self-hostable, and has no cross-project business view — the Railway shape. Axes 2 and 7. Cell notes: not self-hostable; deploys frontends and serverless; bindings are per-project config, not provisioned integrations; own-platform analytics only; free tier generous, $5/mo paid tier. Recommendation: #65 decides whether it joins the managed-cloud group next to Vercel; scoring says it raises at least as much doubt as Netlify or Heroku and more reach than either.

## Sources

Scoring inputs (all pulled 2026-07-18): GitHub API star counts (coollabsio/coolify, Dokploy/dokploy, caprover/caprover, dokku/dokku, basecamp/kamal, pocketbase/pocketbase, appwrite/appwrite, nhost/nhost, supabase/supabase, grafana/grafana, t3-oss/create-t3-app, AmanVarshney01/create-better-t-stack, get-convex/convex-backend, portainer/portainer, moghtech/komodo); Algolia HN API title-restricted story counts since 2025-01-01 with top-story points (homonym-polluted terms discarded). Pricing/capability re-verification (2026-07-18): coolify.io/pricing, dokploy.com/pricing, vercel.com/pricing, railway.com/pricing, supabase.com/pricing, grafana.com/pricing, datadoghq.com/pricing, github.com/grafana/grafana/issues/109069, github.com/AmanVarshney01/create-better-t-stack README. Named HN stories: 43555996 (Coolify, 382 pts), 46075320 (PocketBase, 671 pts), 45661253 (Heroku bill, 813 pts), 43763225 (Supabase Series D, 342 pts), 47824463 (Vercel April 2026 incident, 867 pts), 45934940 (Grafana, 245 pts), 44884077 (Dokploy, 98 pts), 44029057 (Appwrite Sites, 44 pts). Cloudflare 2026 positioning: cogley.jp, mecanik.dev, vibecoding.app (secondary, used for mindshare only). Everything not re-verified above carries the [#39](./39-competitive-landscape-comparison-section.md) July-2026 stamp and must be re-confirmed before shipping.
