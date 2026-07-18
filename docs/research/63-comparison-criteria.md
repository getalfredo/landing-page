# Comparison criteria: the doubt metric and content axes

> Criteria doc for [#63](https://github.com/getalfredo/landing-page/issues/63) (`wayfinder:grilling`, part of [#1](https://github.com/getalfredo/landing-page/issues/1)).
> Applied mechanically by the scoring ticket ([#64](https://github.com/getalfredo/landing-page/issues/64)); thresholds read by the cast lock ([#65](https://github.com/getalfredo/landing-page/issues/65)); records consumed by the prototype ([#43](https://github.com/getalfredo/landing-page/issues/43)) and the `/compare` subpage build.
> Decided 2026-07-18. Raw landscape data: [#39 findings doc](./39-competitive-landscape-comparison-section.md) (§2 table is the cell source; pricing stamped July 2026, re-verify before shipping any number).

## 1. The doubt metric

One number per product: how likely is it that a visitor thinks **"but can't X do that for me?"**

```
doubt = presence × plausibility        (1–5 each → 1–25)
```

Multiplicative on purpose: a tool nobody knows raises no doubt no matter how much it overlaps, and a famous tool with zero perceived overlap raises none either. No other weights.

Score at the **product** level (Coolify, not "self-host PaaS"). Every score cites evidence.

### Presence — is X in our reader's head?

The reader: a self-hosting indie hacker (see map positioning). Evidence: r/selfhosted and HN presence, GitHub stars for OSS, whether the tool comes up unprompted in stack conversations.

- **5** — default vocabulary; they don't need it explained (Vercel, Supabase, Grafana)
- **3** — known to the niche, not universal (Dokploy, Convex)
- **1** — they would have to look it up (Kamal, Nhost)

### Plausibility — does the doubt feel true once they think it?

Evidence: does X have a dashboard surface, does it deploy, does its own marketing claim ground next to Alfredo's?

- **5** — X visibly does something that looks like Alfredo's core (Grafana: dashboards over everything; Coolify: deploys to your servers)
- **3** — partial overlap that needs a squint (Railway: deploys, but rented and per-project)
- **1** — the thought doesn't survive one sentence (a scaffolder "operating" projects)

## 2. What a score earns: ranking, not cutting

Operator ruling: **keep everything for now; cut or hide later.**

- The metric **orders**, it never drops. All eight cast members (Coolify, Dokploy, Vercel, Railway, Supabase, Better-T-Stack, Grafana, Datadog) keep their `/compare/alfredo-vs-<x>` subpage and their on-page candidacy, ordered highest doubt first.
- Anchors stand regardless of score (per [#45](https://github.com/getalfredo/landing-page/issues/45)): Coolify, Dokploy, Grafana, Datadog have fixed table rows and vs-pages; Grafana is guaranteed an on-page answer.
- If [#64](https://github.com/getalfredo/landing-page/issues/64) scores an **unlisted** product ≥ 15, flag it to the cast lock ([#65](https://github.com/getalfredo/landing-page/issues/65)) as a candidate addition.
- Any later cutting or hiding is a design call for [#43](https://github.com/getalfredo/landing-page/issues/43)/[#65](https://github.com/getalfredo/landing-page/issues/65), guided by this ranking. Note: Better-T-Stack's subpage is a "use both" piece ([#41](https://github.com/getalfredo/landing-page/issues/41) decision 4) — a low doubt score never kills it.
- Products with no subpage and no on-page answer still get their row in the backing table on the `/compare` pages.

## 3. The seven content axes

Every on-page answer and every subpage compares on these, phrased in second person. Cells are qualified prose, never bare ✓/✗, and dated ([#39 §2](./39-competitive-landscape-comparison-section.md) is the model).

1. **Runs on your servers** — self-hostable
2. **Deploys your projects**
3. **Wires each project at birth** — auth, email, database, analytics, payments configured at creation; the core claim
4. **One view across all your projects** — cross-project dashboard
5. **Sees your business, not just your CPU** — payments and email delivery next to traffic, errors, uptime
6. **Works without assembly** — ready vs construction kit (the Grafana axis)
7. **Costs shaped for many small projects** — vs per-host / per-module stacking (the Datadog axis)

Boundary between the cousins: axis 3 is **deploy-side** setup (wiring a new project), axis 6 is **dashboard-side** setup (building the view). Grafana can fail axis 6 while axis 3 doesn't even apply to it.

Axes 3, 5, 6, 7 carry the operations pillar as [#45](https://github.com/getalfredo/landing-page/issues/45) requires (assembly cost, business signals, portfolio pricing).

## 4. The per-product record

For each scored product, [#64](https://github.com/getalfredo/landing-page/issues/64) outputs:

1. **Doubt sentence** — the literal "but can't X do that for me?" thought, written out
2. **Presence score + evidence** and **plausibility score + evidence** (rubrics above)
3. **Seven qualified cells** — prose, dated, sourced; re-verify anything stale in [#39 §2](./39-competitive-landscape-comparison-section.md), pricing especially
4. **You keep** — what stays if you adopt Alfredo alongside or on top of X
5. **Alfredo adds** — the delta, honest that Alfredo is an unproven prototype
6. **Stay put if…** — mandatory, a real case, never a strawman
7. **X's real wins** — named plainly: maturity, reliability, free tiers, depth where true
8. **Relationship sentence** — one plain sentence saying how Alfredo relates to X ("Alfredo runs on top of Coolify", "Alfredo replaces the dashboard part of Datadog, but not the deep tracing"). The four-tag taxonomy (RUNS ON / WIRES / PAIRS WITH / INSTEAD OF) from [#41](https://github.com/getalfredo/landing-page/issues/41) is retired — operator found it unclear. Whether the section renders any tag from these sentences is [#43](https://github.com/getalfredo/landing-page/issues/43)'s call.

## 5. Standing rules over every field

- **Plain language.** Short plain sentences, words a tired person understands, no marketing rhythm. Matches the locked [#14](https://github.com/getalfredo/landing-page/issues/14) voice rules — scoring output lands already in the page's voice.
- **No loaded adjectives**, ours or theirs. Strawmanning sneaks in at scoring time, not just at build time.
- **Dated, sourced claims.** July 2026 stamps; re-confirm before any number ships.
- The **"who should not use Alfredo"** block is section-level (one list, not per-product), assembled by [#43](https://github.com/getalfredo/landing-page/issues/43) from the stay-put-if lines.

## 6. Who gets scored

Everything in the [#39 §2](./39-competitive-landscape-comparison-section.md) table, plus anything new [#64](https://github.com/getalfredo/landing-page/issues/64) finds worth a row. The eight cast members get full records; everyone else gets at minimum scores + cells (backing-table material).
